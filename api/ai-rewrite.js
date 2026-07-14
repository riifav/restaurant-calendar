const crypto = require("node:crypto");

const MONTHLY_LIMIT = 20;
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

function sendJson(response, status, body) {
  response.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

function currentMonth() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  return `${year}-${month}`;
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload, secret) {
  const encoded = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verify(token, secret) {
  if (!token || !token.includes(".")) return null;
  const [encoded, receivedSignature] = token.split(".");
  const expectedSignature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.deviceId || !payload.issuedAt) return null;
    if (Date.now() / 1000 - payload.issuedAt > TOKEN_MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}

function refreshMonth(payload) {
  const month = currentMonth();
  if (payload.month === month) return payload;
  return {
    ...payload,
    month,
    count: 0,
    lastInputHash: "",
    lastRewrite: "",
  };
}

function safeCodeMatches(receivedCode, expectedCode) {
  const received = Buffer.from(String(receivedCode || ""));
  const expected = Buffer.from(String(expectedCode || ""));
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

async function rewriteWithGemini(note, businessType, writingTone) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const businessTypeLabels = {
    restaurant: "飲食店",
    salon: "美容室・サロン",
    "gym-school": "スポーツジム・教室",
    retail: "小売店",
    other: "その他",
  };
  const writingToneLabels = {
    friendly: "親しみやすい",
    polite: "丁寧",
    concise: "短く簡潔",
  };
  const businessLabel = businessTypeLabels[businessType] || businessTypeLabels.restaurant;
  const toneLabel = writingToneLabels[writingTone] || writingToneLabels.friendly;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: [
            "あなたはお店のSNS告知文を整える校正担当です。",
            `このお店の種類は「${businessLabel}」、文章の雰囲気は「${toneLabel}」です。`,
            "お店の種類に合う自然な言葉を選びますが、業種から事実を推測して追加してはいけません。",
            "入力された短いメモを、自然で丁寧な日本語の一文に直してください。",
            "文脈から明らかな誤字は修正してください。商品名、金額、日付、営業時間などの事実は変えないでください。",
            "入力にない商品、価格、営業情報は絶対に足さないでください。",
            "回答は整えた文章だけにし、説明や引用符は付けないでください。",
          ].join("\n"),
        }],
      },
      contents: [{ role: "user", parts: [{ text: note }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 120,
      },
    }),
  });

  if (!response.ok) throw new Error(`Gemini API returned ${response.status}`);
  const data = await response.json();
  const rewritten = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!rewritten) throw new Error("Gemini API returned an empty response");
  return rewritten.replace(/^[「『\"']+|[」』\"']+$/g, "").trim();
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "POSTのみ利用できます。" });
  }

  const accessCode = process.env.AI_ACCESS_CODE;
  const authSecret = process.env.AI_AUTH_SECRET;
  if (!accessCode || !authSecret) {
    return sendJson(response, 503, { error: "AIリライトの設定が完了していません。" });
  }

  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : (request.body || {});

  if (body.action === "authorize") {
    if (!/^\d{7}$/.test(String(body.code || "")) || !safeCodeMatches(body.code, accessCode)) {
      return sendJson(response, 401, { error: "確認コードが違います。" });
    }
    const payload = {
      deviceId: String(body.deviceId || crypto.randomUUID()).slice(0, 100),
      issuedAt: Math.floor(Date.now() / 1000),
      month: currentMonth(),
      count: 0,
      lastInputHash: "",
      lastRewrite: "",
    };
    return sendJson(response, 200, {
      token: sign(payload, authSecret),
      remaining: MONTHLY_LIMIT,
    });
  }

  const authorization = request.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  let payload = verify(token, authSecret);
  if (!payload) return sendJson(response, 401, { error: "AIリライトの認証が必要です。" });
  payload = refreshMonth(payload);

  if (body.action === "status") {
    return sendJson(response, 200, {
      token: sign(payload, authSecret),
      remaining: Math.max(0, MONTHLY_LIMIT - payload.count),
    });
  }

  if (body.action !== "rewrite") return sendJson(response, 400, { error: "操作を確認できません。" });
  const note = String(body.note || "").replace(/\s+/g, " ").trim().slice(0, 200);
  if (!note) return sendJson(response, 400, { error: "特記事項を入力してください。" });

  const inputHash = crypto.createHash("sha256").update(note).digest("base64url");
  if (payload.lastInputHash === inputHash && payload.lastRewrite) {
    return sendJson(response, 200, {
      rewritten: payload.lastRewrite,
      cached: true,
      token: sign(payload, authSecret),
      remaining: Math.max(0, MONTHLY_LIMIT - payload.count),
    });
  }

  if (payload.count >= MONTHLY_LIMIT) {
    return sendJson(response, 429, {
      error: "今月のAIリライトは20回までです。",
      limitReached: true,
      token: sign(payload, authSecret),
      remaining: 0,
    });
  }

  try {
    const rewritten = await rewriteWithGemini(note, body.businessType, body.writingTone);
    payload.count += 1;
    payload.lastInputHash = inputHash;
    payload.lastRewrite = rewritten.slice(0, 300);
    return sendJson(response, 200, {
      rewritten,
      cached: false,
      token: sign(payload, authSecret),
      remaining: MONTHLY_LIMIT - payload.count,
    });
  } catch {
    return sendJson(response, 502, { error: "AIリライトを利用できませんでした。" });
  }
};
