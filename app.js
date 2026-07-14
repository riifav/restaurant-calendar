const STORAGE_KEY = "business-calendar-v2";
const MAX_POST_LENGTH = 140;

const STATUS = {
  OPEN: "open",
  CLOSED: "closed",
  SHORT: "short",
};

const statusLabels = {
  [STATUS.OPEN]: "営業日",
  [STATUS.CLOSED]: "お休み",
  [STATUS.SHORT]: "変則営業",
};

const imageSkins = [
  // ウォーム系
  { id: "coral-lemon", group: "warm", background: "#FFFDF8", header: "#EC6A70", footer: "#F5E190", closed: "#F4B8B7", short: "#F5E190", sunday: "#D94F45", saturday: "#5595C4", ink: "#493638", headerText: "#FFFFFF" },
  { id: "gold-rose", group: "warm", background: "#FFFDF8", header: "#E6CD9E", footer: "#E12545", closed: "#F2BBC6", short: "#F6DEA0", sunday: "#E12545", saturday: "#627EAF", ink: "#443D35", headerText: "#4A3D29" },
  { id: "terracotta-gold", group: "warm", background: "#FFFDF8", header: "#C65D3B", footer: "#F2C14E", closed: "#E7B2A1", short: "#F2D58E", sunday: "#C44748", saturday: "#5B93C5", ink: "#463735", headerText: "#FFFFFF" },
  { id: "peach-mint", group: "warm", background: "#FFFDF8", header: "#FFB4A2", footer: "#84C7AE", closed: "#F3C6C1", short: "#F4D99B", sunday: "#D95B65", saturday: "#5A9BCD", ink: "#4B3E3D", headerText: "#FFFFFF" },
  // クール系
  { id: "blue-turquoise", group: "cool", background: "#F9FBFF", header: "#5B6FD8", footer: "#1ABEAC", closed: "#D7B7D3", short: "#E5D88D", sunday: "#D94F45", saturday: "#3D91C8", ink: "#2E3756", headerText: "#FFFFFF" },
  { id: "sky-green", group: "cool", background: "#FAFCFF", header: "#90B8DC", footer: "#48A748", closed: "#E9B9C0", short: "#E4D58D", sunday: "#D94F45", saturday: "#4C93CD", ink: "#344452", headerText: "#FFFFFF" },
  { id: "ocean-sky", group: "cool", background: "#F8FCFF", header: "#1D5D9B", footer: "#75C2F6", closed: "#D7B8D2", short: "#D6E8A4", sunday: "#D94F45", saturday: "#2C8DC6", ink: "#263B55", headerText: "#FFFFFF" },
  { id: "ice-navy", group: "cool", background: "#F8FCFC", header: "#A8DADC", footer: "#457B9D", closed: "#E4BEC8", short: "#E3D890", sunday: "#C75662", saturday: "#357EAF", ink: "#2C4B60", headerText: "#244B5A" },
  // 明るい系
  { id: "lemon-purple", group: "bright", background: "#FFFDF8", header: "#F9F200", footer: "#9790D6", closed: "#EFADB6", short: "#F9F200", sunday: "#D94F45", saturday: "#7770BD", ink: "#363336", headerText: "#3B3842" },
  { id: "pink-yellow", group: "bright", background: "#FFFDF8", header: "#FF5D8F", footer: "#FFD166", closed: "#F6B8C8", short: "#FFE09A", sunday: "#D94F45", saturday: "#4D94C8", ink: "#4B3540", headerText: "#FFFFFF" },
  { id: "orange-blue", group: "bright", background: "#FFFDF8", header: "#F77F00", footer: "#3A86FF", closed: "#F1B694", short: "#F5D778", sunday: "#D94F45", saturday: "#3379E2", ink: "#3F3A35", headerText: "#FFFFFF" },
  { id: "aqua-lemon", group: "bright", background: "#FCFFFD", header: "#00C2A8", footer: "#FDE74C", closed: "#F1B8C3", short: "#FDEB8D", sunday: "#D94F45", saturday: "#3A92C8", ink: "#284A4A", headerText: "#FFFFFF" },
  // 暗い系
  { id: "forest-coral", group: "dark", background: "#FFFDF8", header: "#183467", footer: "#ED6C67", closed: "#EDB0AF", short: "#F5D39B", sunday: "#D94F45", saturday: "#4E8FC5", ink: "#263044", headerText: "#FFFFFF" },
  { id: "taupe-rose", group: "dark", background: "#FFFDFC", header: "#665051", footer: "#D57B7B", closed: "#E5B8B8", short: "#E7D29C", sunday: "#C45358", saturday: "#648DBA", ink: "#443A3B", headerText: "#FFFFFF" },
  { id: "indigo-coral", group: "dark", background: "#FBFBFD", header: "#3D405B", footer: "#E07A5F", closed: "#E2B9BD", short: "#E8D692", sunday: "#C65559", saturday: "#5279BB", ink: "#303247", headerText: "#FFFFFF" },
  { id: "moss-copper", group: "dark", background: "#FFFDF8", header: "#283618", footer: "#BC6C25", closed: "#DFB9B1", short: "#DDCF90", sunday: "#C45358", saturday: "#4B86B7", ink: "#364027", headerText: "#FFFFFF" },
  // かわいい系
  { id: "standard", group: "cute", background: "#FFFDF8", header: "#F8B6B6", footer: "#78BFA3", closed: "#F8B6B6", short: "#F8E7A0", sunday: "#D94F45", saturday: "#66A9D6", ink: "#333333", headerText: "#FFFDF8" },
  { id: "lavender-rose", group: "cute", background: "#FFFDF8", header: "#9786B7", footer: "#E5A19F", closed: "#E4C0D6", short: "#F2D8A3", sunday: "#D94F45", saturday: "#6E90C0", ink: "#403C4B", headerText: "#FFFFFF" },
  { id: "pink-mint", group: "cute", background: "#FFFDFD", header: "#FF9EBB", footer: "#B8E0D2", closed: "#F5C6D2", short: "#F7D99A", sunday: "#D95B65", saturday: "#5C9DCA", ink: "#4C3D46", headerText: "#FFFFFF" },
  { id: "lilac-candy", group: "cute", background: "#FFFDFE", header: "#CDB4DB", footer: "#FFC8DD", closed: "#E5C5D9", short: "#F8DDA0", sunday: "#D95B65", saturday: "#6297C8", ink: "#4D4157", headerText: "#FFFFFF" },
  // シック系
  { id: "navy-sand", group: "chic", background: "#FFFDF9", header: "#2B2D42", footer: "#D4A373", closed: "#DDB9BC", short: "#E7D59A", sunday: "#B95159", saturday: "#557FB3", ink: "#31303A", headerText: "#FFFFFF" },
  { id: "plum-rose", group: "chic", background: "#FFFCFD", header: "#4A4E69", footer: "#C9ADA7", closed: "#E0C0CF", short: "#E5D69C", sunday: "#B95159", saturday: "#617EAE", ink: "#353847", headerText: "#FFFFFF" },
  { id: "slate-blush", group: "chic", background: "#FCFCFD", header: "#355070", footer: "#EAAC8B", closed: "#E4BEC2", short: "#E7D89A", sunday: "#BF5760", saturday: "#5282BC", ink: "#2F4055", headerText: "#FFFFFF" },
  { id: "teal-gold", group: "chic", background: "#FFFEFA", header: "#264653", footer: "#E9C46A", closed: "#DAB8BB", short: "#E9D796", sunday: "#B95159", saturday: "#477EB0", ink: "#294550", headerText: "#FFFFFF" },
  // モノトーン＋差し色
  { id: "graphite-blue", group: "monotone", background: "#FFFFFF", header: "#191919", footer: "#2F80ED", closed: "#2F80ED", short: "#191919", sunday: "#D94F45", saturday: "#2F80ED", ink: "#242424", headerText: "#FFFFFF" },
  { id: "charcoal-coral", group: "monotone", background: "#FFFFFF", header: "#2B2B2B", footer: "#EB5757", closed: "#EB5757", short: "#2B2B2B", sunday: "#D94F45", saturday: "#4D8EC4", ink: "#2B2B2B", headerText: "#FFFFFF" },
  { id: "warm-gray-mustard", group: "monotone", background: "#FAFAFA", header: "#707070", footer: "#F2C94C", closed: "#F2C94C", short: "#707070", sunday: "#D94F45", saturday: "#4D8EC4", ink: "#353535", headerText: "#FFFFFF" },
  { id: "cool-gray-mint", group: "monotone", background: "#FFFFFF", header: "#B8B8B8", footer: "#27AE60", closed: "#27AE60", short: "#B8B8B8", sunday: "#D94F45", saturday: "#4D8EC4", ink: "#2F2F2F", headerText: "#242424" },
];

const imageFonts = [
  { id: "rounded", name: "丸ゴシック", family: '"M PLUS Rounded 1c"' },
  { id: "gothic", name: "さわらびゴシック", family: '"Sawarabi Gothic"' },
  { id: "mincho", name: "明朝体", family: '"Zen Old Mincho"' },
];

const DEFAULT_SKIN_ID = "coral-lemon";
const DEFAULT_FONT_ID = "rounded";
const DEFAULT_SNS_IDS = ["instagram", "x"];
const SNS_OPTIONS = [
  { id: "instagram", label: "Instagram", icon: "./logo_Instagram.svg", url: "https://www.instagram.com/" },
  { id: "x", label: "X", icon: "./logo_X.svg", url: "https://x.com/compose/post" },
  { id: "threads", label: "Threads", icon: "./logo_threads.svg", url: "https://www.threads.net/" },
  { id: "facebook", label: "Facebook", icon: "./logo_Facebook.png", url: "https://www.facebook.com/" },
];

const seasonalMessages = [
  "寒い日が続きますね。暖かくしてお越しください⛄",
  "まだ寒い日が続きますね。店内を暖かくしてお待ちしております😊",
  "少しずつ春らしくなってきましたね🌸",
  "春の陽気が心地よい季節になりましたね🌷",
  "過ごしやすい季節になりました。どうぞ気軽にお立ち寄りください😊",
  "雨の日が増える季節ですね。足元に気をつけてお越しください☂️",
  "暑い日が続きますね。涼みにいらしてください☀️",
  "お盆の季節が近づいてまいりましたね😊",
  "まだ暑い日が続きますね。どうぞ涼みにいらしてください☀️",
  "少しずつ秋らしくなってきましたね🍂",
  "温かいものが恋しい季節になりましたね🍴",
  "今年も残りわずかとなりました。暖かくしてお越しください⛄",
];

const politeSeasonalMessages = [
  "寒さの厳しい季節でございます。どうぞ暖かくしてお越しくださいませ。",
  "寒い日が続いております。店内を暖かくして、皆さまのお越しをお待ちしております。",
  "春の訪れを感じる頃となりました。皆さまのお越しを心よりお待ちしております。",
  "春の陽気が心地よい季節でございます。どうぞ穏やかなひとときをお過ごしくださいませ。",
  "過ごしやすい季節となりました。皆さまのお越しを心よりお待ちしております。",
  "雨の多い季節でございます。お足元にお気をつけてお越しくださいませ。",
  "暑さが続く季節でございます。どうぞ涼みにお立ち寄りくださいませ。",
  "お盆の季節が近づいてまいりました。皆さまのお越しを心よりお待ちしております。",
  "残暑の折、どうぞ涼みにお立ち寄りくださいませ。",
  "少しずつ秋の気配を感じる頃となりました。皆さまのお越しをお待ちしております。",
  "温かいお料理が恋しい季節となりました。どうぞゆっくりとお過ごしくださいませ。",
  "本年も残りわずかとなりました。皆さまのお越しを心よりお待ちしております。",
];

const monthEmojis = ["⛄", "🍫", "🌸", "🌷", "🌿", "☂️", "☀️", "🍉", "🌕", "🍂", "🍁", "🎄"];
const state = loadState();
const today = new Date();
const MIN_EDITABLE_MONTH = new Date(today.getFullYear(), today.getMonth(), 1);
const MAX_EDITABLE_MONTH = new Date(today.getFullYear(), today.getMonth() + 3, 1);
let visibleMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
let generatedImageUrl = "";
let generatedCalendarCanvas = null;

const calendarScreen = document.querySelector("#calendar-screen");
const homeScreen = document.querySelector("#home-screen");
const postScreen = document.querySelector("#post-screen");
const settingsScreen = document.querySelector("#settings-screen");
const screenElements = [...document.querySelectorAll(".screen")];
const calendar = document.querySelector("#calendar");
const currentLabel = document.querySelector("#current-label");
const previousLabel = document.querySelector("#previous-label");
const nextLabel = document.querySelector("#next-label");
const previousMonthButton = document.querySelector("#previous-month");
const nextMonthButton = document.querySelector("#next-month");
const saveButton = document.querySelector("#save-button");
const savedMessage = document.querySelector("#saved-message");
const specialNote = document.querySelector("#special-note");
const noteCount = document.querySelector("#note-count");
const calendarPreview = document.querySelector("#calendar-preview");
const postText = document.querySelector("#post-text");
const postCount = document.querySelector("#post-count");
const copyToast = document.querySelector("#copy-toast");
const imageStylePicker = document.querySelector("#image-style-picker");
const imageStyleButton = document.querySelector("#open-image-style");
const skinOptions = document.querySelector("#skin-options");
const fontOptions = document.querySelector("#font-options");
const openSettingsButton = document.querySelector("#open-settings");
const closeSettingsButton = document.querySelector("#close-settings");
const accessCode = document.querySelector("#access-code");
const codeBoxes = [...document.querySelectorAll(".code-boxes span")];
const authorizeAiButton = document.querySelector("#authorize-ai");
const authorizationMessage = document.querySelector("#authorization-message");
const aiLocked = document.querySelector("#ai-locked");
const aiEnabled = document.querySelector("#ai-enabled");
const aiRemaining = document.querySelector("#ai-remaining");
const businessType = document.querySelector("#business-type");
const writingTone = document.querySelector("#writing-tone");
const snsActions = document.querySelector("#sns-actions");
const snsCheckboxes = [...document.querySelectorAll('input[name="post-social-network"]')];
let screenBeforeSettings = "home-screen";

const aiContextDefaults = {
  businessType: "restaurant",
  writingTone: "friendly",
};

const aiContextLabels = {
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

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { months: {}, preferences: {} };
  } catch {
    return { months: {}, preferences: {} };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAiState() {
  if (!state.ai) {
    state.ai = {
      token: "",
      remaining: 20,
      deviceId: globalThis.crypto?.randomUUID?.() || `device-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    saveState();
  }
  if (!state.ai.cache) state.ai.cache = {};
  return state.ai;
}

function getAiContext() {
  if (!state.aiContext) state.aiContext = { ...aiContextDefaults };
  if (!aiContextLabels[state.aiContext.businessType]) state.aiContext.businessType = aiContextDefaults.businessType;
  if (!writingToneLabels[state.aiContext.writingTone]) state.aiContext.writingTone = aiContextDefaults.writingTone;
  return state.aiContext;
}

function renderAiContextSettings() {
  const context = getAiContext();
  businessType.value = context.businessType;
  writingTone.value = context.writingTone;
}

function getSelectedSnsIds() {
  const preferences = getImagePreferences();
  const selected = Array.isArray(preferences.snsIds)
    ? preferences.snsIds.filter((id) => SNS_OPTIONS.some((option) => option.id === id))
    : [];
  if (!selected.length) preferences.snsIds = [...DEFAULT_SNS_IDS];
  return preferences.snsIds;
}

function renderSnsSettings() {
  const selected = new Set(getSelectedSnsIds());
  snsCheckboxes.forEach((checkbox) => {
    checkbox.checked = selected.has(checkbox.value);
  });
}

function renderSnsButtons() {
  const selected = getSelectedSnsIds()
    .map((id) => SNS_OPTIONS.find((option) => option.id === id))
    .filter(Boolean);
  snsActions.replaceChildren();
  snsActions.dataset.count = String(selected.length);
  snsActions.style.setProperty("--sns-count", String(selected.length));
  selected.forEach((service) => {
    const button = document.createElement("button");
    button.className = "sns-button";
    button.type = "button";
    button.dataset.service = service.id;
    button.innerHTML = `<img class="sns-icon" src="${service.icon}" alt="${service.label}" /><span>開く</span><svg class="external-link-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>`;
    button.addEventListener("click", () => copyAndOpen(service.id));
    snsActions.append(button);
  });
  updatePostCount();
}

async function callAiApi(body, token = "") {
  const response = await fetch("/api/ai-rewrite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "AIリライトに接続できませんでした。");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function storeAiResponse(data) {
  const ai = getAiState();
  if (data.token) ai.token = data.token;
  if (Number.isFinite(data.remaining)) ai.remaining = data.remaining;
  saveState();
  updateAiSettingsView();
}

function updateAiSettingsView() {
  const ai = getAiState();
  const isEnabled = Boolean(ai.token);
  aiLocked.hidden = isEnabled;
  aiEnabled.hidden = !isEnabled;
  aiRemaining.textContent = String(ai.remaining ?? 20);
}

function updateCodeBoxes() {
  const digits = accessCode.value.replace(/\D/g, "").slice(0, 7);
  if (accessCode.value !== digits) accessCode.value = digits;
  codeBoxes.forEach((box, index) => {
    box.classList.toggle("is-filled", index < digits.length);
    box.classList.toggle("is-active", index === digits.length && digits.length < 7);
  });
  authorizeAiButton.disabled = digits.length !== 7;
  authorizationMessage.textContent = "";
}

async function authorizeAi() {
  authorizeAiButton.disabled = true;
  authorizeAiButton.textContent = "確認しています…";
  authorizationMessage.textContent = "";
  try {
    const ai = getAiState();
    const data = await callAiApi({
      action: "authorize",
      code: accessCode.value,
      deviceId: ai.deviceId,
    });
    storeAiResponse(data);
    accessCode.value = "";
    updateCodeBoxes();
  } catch (error) {
    authorizationMessage.textContent = location.protocol === "file:"
      ? "AIの認証は公開版アプリで利用できます。"
      : error.message;
    accessCode.focus();
  } finally {
    authorizeAiButton.textContent = "確認する";
    authorizeAiButton.disabled = accessCode.value.length !== 7;
  }
}

async function refreshAiStatus() {
  const ai = getAiState();
  if (!ai.token || location.protocol === "file:") {
    updateAiSettingsView();
    return;
  }
  try {
    const data = await callAiApi({ action: "status" }, ai.token);
    storeAiResponse(data);
  } catch (error) {
    if (error.status === 401) {
      ai.token = "";
      ai.remaining = 20;
      saveState();
    }
    updateAiSettingsView();
  }
}

function createHistoryState(screenId, extra = {}) {
  return {
    screen: screenId,
    month: `${visibleMonth.getFullYear()}-${visibleMonth.getMonth() + 1}`,
    ...extra,
  };
}

function addHistoryEntry(screenId, extra = {}) {
  history.pushState(createHistoryState(screenId, extra), "");
}

function openSettings(addToHistory = true) {
  const visibleScreen = screenElements.find((screen) => !screen.hidden && screen !== settingsScreen);
  if (visibleScreen) screenBeforeSettings = visibleScreen.id;
  screenElements.forEach((screen) => { screen.hidden = screen !== settingsScreen; });
  document.body.classList.remove("post-mode");
  authorizationMessage.textContent = "";
  updateAiSettingsView();
  renderSnsSettings();
  refreshAiStatus();
  window.scrollTo({ top: 0 });
  if (addToHistory) addHistoryEntry("settings-screen", { returnScreen: screenBeforeSettings });
}

function closeSettings() {
  if (history.state?.screen === "settings-screen") {
    history.back();
    return;
  }
  const destination = document.querySelector(`#${screenBeforeSettings}`) || homeScreen;
  screenElements.forEach((screen) => { screen.hidden = screen !== destination; });
  document.body.classList.toggle("post-mode", destination === postScreen);
  window.scrollTo({ top: 0 });
}

function toggleSettings() {
  if (settingsScreen.hidden) {
    openSettings();
    return;
  }
  closeSettings();
}

function getImagePreferences() {
  if (!state.preferences) state.preferences = {};
  if (!imageSkins.some((skin) => skin.id === state.preferences.skinId)) state.preferences.skinId = DEFAULT_SKIN_ID;
  if (!imageFonts.some((font) => font.id === state.preferences.fontId)) state.preferences.fontId = DEFAULT_FONT_ID;
  return state.preferences;
}

function getSelectedSkin() {
  const { skinId } = getImagePreferences();
  return imageSkins.find((skin) => skin.id === skinId);
}

function getSelectedFont() {
  const { fontId } = getImagePreferences();
  return imageFonts.find((font) => font.id === fontId);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function nthWeekdayOfMonth(year, month, weekday, occurrence) {
  const firstWeekday = new Date(year, month, 1).getDay();
  return 1 + ((weekday - firstWeekday + 7) % 7) + (occurrence - 1) * 7;
}

function japanHolidayKeys(year) {
  if (year < 2020 || year > 2099) return new Set();

  const holidays = new Set();
  const vernalEquinox = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  const autumnEquinox = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  const add = (month, day) => holidays.add(dateKey(year, month, day));
  const addMondayHoliday = (month, occurrence) => add(month, nthWeekdayOfMonth(year, month, 1, occurrence));

  add(0, 1);
  addMondayHoliday(0, 2);
  add(1, 11);
  add(1, 23);
  add(2, vernalEquinox);
  add(3, 29);
  add(4, 3);
  add(4, 4);
  add(4, 5);
  addMondayHoliday(6, 3);
  add(7, 11);
  addMondayHoliday(8, 3);
  add(8, autumnEquinox);
  addMondayHoliday(9, 2);
  add(10, 3);
  add(10, 23);

  if (year === 2020) {
    holidays.delete(dateKey(year, 6, nthWeekdayOfMonth(year, 6, 1, 3)));
    holidays.delete(dateKey(year, 7, 11));
    holidays.delete(dateKey(year, 9, nthWeekdayOfMonth(year, 9, 1, 2)));
    add(6, 23);
    add(6, 24);
    add(7, 10);
  }

  if (year === 2021) {
    holidays.delete(dateKey(year, 6, nthWeekdayOfMonth(year, 6, 1, 3)));
    holidays.delete(dateKey(year, 7, 11));
    holidays.delete(dateKey(year, 9, nthWeekdayOfMonth(year, 9, 1, 2)));
    add(6, 22);
    add(6, 23);
    add(7, 8);
  }

  let addedCitizenHoliday = true;
  while (addedCitizenHoliday) {
    addedCitizenHoliday = false;
    const date = new Date(year, 0, 2);
    while (date.getFullYear() === year) {
      const key = dateKey(year, date.getMonth(), date.getDate());
      const previous = new Date(year, date.getMonth(), date.getDate() - 1);
      const next = new Date(year, date.getMonth(), date.getDate() + 1);
      if (!holidays.has(key) && holidays.has(dateKey(year, previous.getMonth(), previous.getDate())) && holidays.has(dateKey(year, next.getMonth(), next.getDate()))) {
        holidays.add(key);
        addedCitizenHoliday = true;
      }
      date.setDate(date.getDate() + 1);
    }
  }

  [...holidays].forEach((key) => {
    const [, month, day] = key.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDay() !== 0) return;
    do {
      date.setDate(date.getDate() + 1);
    } while (holidays.has(dateKey(year, date.getMonth(), date.getDate())));
    holidays.add(dateKey(year, date.getMonth(), date.getDate()));
  });

  return holidays;
}

function formatMonth(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function adjacentMonth(offset) {
  return new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
}

function isEditableMonth(date) {
  const month = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  return month >= MIN_EDITABLE_MONTH.getTime() && month <= MAX_EDITABLE_MONTH.getTime();
}

function updateMonthNavigation() {
  const previousMonth = adjacentMonth(-1);
  const nextMonth = adjacentMonth(1);
  const canShowPrevious = isEditableMonth(previousMonth);
  const canShowNext = isEditableMonth(nextMonth);

  previousLabel.textContent = canShowPrevious ? formatMonth(previousMonth) : "";
  nextLabel.textContent = canShowNext ? formatMonth(nextMonth) : "";
  previousLabel.hidden = !canShowPrevious;
  nextLabel.hidden = !canShowNext;
  previousMonthButton.hidden = !canShowPrevious;
  nextMonthButton.hidden = !canShowNext;
  previousMonthButton.disabled = !canShowPrevious;
  nextMonthButton.disabled = !canShowNext;
  previousLabel.disabled = !canShowPrevious;
  nextLabel.disabled = !canShowNext;

  if (canShowPrevious) previousLabel.setAttribute("aria-label", `${previousLabel.textContent}を見る`);
  else previousLabel.removeAttribute("aria-label");
  if (canShowNext) nextLabel.setAttribute("aria-label", `${nextLabel.textContent}を見る`);
  else nextLabel.removeAttribute("aria-label");
}

function getMonthState() {
  const key = monthKey(visibleMonth);
  if (!state.months[key]) {
    state.months[key] = { confirmed: false, dates: {}, note: "" };
  }
  return state.months[key];
}

function defaultStatus(year, month, day) {
  const date = new Date(year, month, day);
  const isWednesday = date.getDay() === 3;
  const isYearEndHoliday = (month === 11 && day === 31) || (month === 0 && day === 1);
  return isWednesday || isYearEndHoliday ? STATUS.CLOSED : STATUS.OPEN;
}

function getStatus(year, month, day) {
  return getMonthState().dates[dateKey(year, month, day)] || defaultStatus(year, month, day);
}

function nextStatus(current, defaultValue) {
  const order = defaultValue === STATUS.CLOSED
    ? [STATUS.CLOSED, STATUS.SHORT, STATUS.OPEN]
    : [STATUS.OPEN, STATUS.CLOSED, STATUS.SHORT];
  return order[(order.indexOf(current) + 1) % order.length];
}

function setStatus(year, month, day) {
  const key = dateKey(year, month, day);
  const defaultValue = defaultStatus(year, month, day);
  const next = nextStatus(getStatus(year, month, day), defaultValue);

  if (next === defaultValue) delete getMonthState().dates[key];
  else getMonthState().dates[key] = next;

  savedMessage.textContent = "";
  renderCalendar();
}

function renderCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const holidays = japanHolidayKeys(year);

  currentLabel.textContent = formatMonth(visibleMonth);
  updateMonthNavigation();
  calendar.replaceChildren();

  for (let i = 0; i < firstWeekday; i += 1) calendar.append(createBlankCell());

  for (let day = 1; day <= daysInMonth; day += 1) {
    const status = getStatus(year, month, day);
    const weekday = new Date(year, month, day).getDay();
    const isHoliday = holidays.has(dateKey(year, month, day));
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-cell day-cell--${status}${weekday === 0 ? " day-cell--sunday" : weekday === 6 ? " day-cell--saturday" : ""}${isHoliday ? " day-cell--holiday" : ""}`;
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", `${month + 1}月${day}日${isHoliday ? "、祝日" : ""}、${statusLabels[status]}。タップすると変更します`);
    button.innerHTML = `<span class="day-number">${day}</span><span class="day-status">${statusLabels[status]}</span>`;
    button.addEventListener("click", () => setStatus(year, month, day));
    calendar.append(button);
  }

  const trailingBlanks = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;
  for (let i = 0; i < trailingBlanks; i += 1) calendar.append(createBlankCell());

  specialNote.value = getMonthState().note || "";
  updateNoteCount();
}

function createBlankCell() {
  const blank = document.createElement("div");
  blank.className = "day-cell day-cell--blank";
  blank.setAttribute("aria-hidden", "true");
  return blank;
}

function changeMonth(offset) {
  const destination = adjacentMonth(offset);
  if (!isEditableMonth(destination)) return;
  getMonthState().note = specialNote.value.trim();
  visibleMonth = destination;
  savedMessage.textContent = "";
  renderCalendar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNoteCount() {
  noteCount.textContent = specialNote.value.length;
}

function generatePostText(rewrittenNote = null) {
  const month = visibleMonth.getMonth();
  const tone = getAiContext().writingTone;
  const note = formatNoteForTone(rewrittenNote ?? rewriteSpecialNote(specialNote.value), tone);
  const heading = tone === "friendly"
    ? `${monthEmojis[month]} ${formatMonth(visibleMonth)} 営業日のご案内 ${monthEmojis[month]}`
    : `${formatMonth(visibleMonth)} 営業日のご案内`;
  const parts = [heading];
  if (tone === "friendly") parts.push(seasonalMessages[month]);
  if (tone === "polite") parts.push(politeSeasonalMessages[month]);
  if (note) parts.push(note);
  parts.push(tone === "friendly"
    ? "営業日は画像をご確認ください🗓️"
    : tone === "polite"
      ? "営業日につきましては、画像をご確認くださいませ。"
      : "営業日は画像をご確認ください。");
  return parts.join("\n\n");
}

function formatNoteForTone(value, tone) {
  if (!value) return "";
  const withoutEmoji = tone === "friendly"
    ? value.trim()
    : value.replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\u200D\uFE0F]/gu, "").replace(/\s+/g, " ").trim();
  if (tone !== "polite") return withoutEmoji;
  return withoutEmoji
    .replace(/(\d{1,2}日)は(午前|午後)は/g, "$1の$2は")
    .replace(/営業しない(?:よ|ね|です)?[。.!！]?$/, "営業いたしません。")
    .replace(/しない(?:よ|ね)[。.!！]?$/, "いたしません。")
    .replace(/する(?:よ|ね)[。.!！]?$/, "いたします。")
    .replace(/(?:だよ|だね)[。.!！]?$/, "でございます。")
    .replace(/ご提供しています。$/, "ご提供しております。")
    .replace(/営業します。$/, "営業いたします。")
    .replace(/営業。$/, "営業いたします。")
    .replace(/です。$/, "でございます。");
}

async function rewriteNoteWithAi(note) {
  const ai = getAiState();
  if (!note || !ai.token || location.protocol === "file:") return null;
  const context = getAiContext();
  const cacheKey = `tone-v2:${context.businessType}:${context.writingTone}:${note.replace(/\s+/g, " ").trim()}`;
  if (ai.cache[cacheKey]) return ai.cache[cacheKey];

  try {
    const data = await callAiApi({
      action: "rewrite",
      note,
      businessType: context.businessType,
      writingTone: context.writingTone,
    }, ai.token);
    storeAiResponse(data);
    ai.cache[cacheKey] = data.rewritten;
    const cacheEntries = Object.entries(ai.cache);
    if (cacheEntries.length > 20) ai.cache = Object.fromEntries(cacheEntries.slice(-20));
    saveState();
    return data.rewritten;
  } catch (error) {
    if (error.data?.token) storeAiResponse(error.data);
    if (error.status === 401) {
      ai.token = "";
      ai.remaining = 20;
      saveState();
    }
    return null;
  }
}

function rewriteSpecialNote(value) {
  const typoCorrections = [
    [/冷静パスタ/g, "冷製パスタ"],
    [/お勧め/g, "オススメ"],
    [/おすすめ/g, "オススメ"],
  ];
  const corrected = typoCorrections.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
  const note = corrected.replace(/\s+/g, " ").trim().replace(/[。．]+$/g, "");
  if (!note) return "";

  // 短いメモを、投稿文として読める一文に整える。
  const seasonal = note.match(/^季節の?オススメ[。．:：、]?\s*(.+)$/i);
  if (seasonal) return `季節のオススメは${seasonal[1].replace(/[。．]+$/g, "")}です。`;

  const until = note.match(/^(.+?)(\d{1,2}月(?:\d{1,2}日)?まで)$/);
  if (until) return `${until[1].replace(/[。．、\s]+$/g, "")}は${until[2]}提供しております。`;

  const price = note.match(/^(.+?)[、,，\s]+([0-9０-９][0-9０-９,，]*円)$/);
  if (price) {
    const item = price[1].replace(/[。．、,，\s]+$/g, "");
    const amount = price[2].replace(/[０-９]/g, (character) => String("０１２３４５６７８９".indexOf(character))).replace(/，/g, ",");
    return `${item}は${amount}でご提供しています。`;
  }

  const dateOnly = note.match(/^(\d{1,2}月\d{1,2}日)(.+)$/);
  if (dateOnly) return `${dateOnly[1]}は${dateOnly[2].replace(/^[、。．\s]+/, "")}。`;

  if (!/[。！？!?]$/.test(note)) return `${note}。`;
  return note;
}

function createCalendarImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const holidays = japanHolidayKeys(year);
  const skin = getSelectedSkin();
  const font = getSelectedFont();
  const closedColor = skin.group === "monotone" ? skin.closed : skin.header;
  const shortColor = skin.group === "monotone" ? skin.short : skin.footer;
  const isDarkColor = (hex) => {
    const value = hex.replace("#", "");
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return (red * 299 + green * 587 + blue * 114) / 1000 < 150;
  };
  const canvasFont = (weight, size) => {
    const adjustedWeight = font.id === "gothic" && weight === 800 ? 400 : font.id === "mincho" && weight === 800 ? 900 : weight;
    return `${adjustedWeight} ${size}px ${font.family}, sans-serif`;
  };

  ctx.fillStyle = skin.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = skin.footer;
  ctx.fillRect(0, 1048, 1080, 32);

  ctx.fillStyle = skin.header;
  ctx.beginPath();
  ctx.moveTo(45, 0);
  ctx.lineTo(1035, 0);
  ctx.lineTo(1035, 192);
  ctx.quadraticCurveTo(1035, 220, 1007, 220);
  ctx.lineTo(73, 220);
  ctx.quadraticCurveTo(45, 220, 45, 192);
  ctx.closePath();
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = skin.headerText;
  ctx.font = canvasFont(800, 160);
  ctx.fillText(String(month + 1).padStart(2, "0"), 337, 108);

  ctx.strokeStyle = skin.headerText;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(487, 48);
  ctx.lineTo(487, 168);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.textAlign = "left";
  ctx.font = canvasFont(700, 25);
  ctx.fillText(`${year}年${month + 1}月`, 542, 50);
  ctx.font = canvasFont(700, 42);
  ctx.fillText("営業日のご案内", 542, 108);
  ctx.font = canvasFont(500, 19);
  ctx.fillText("OPENING CALENDAR", 543, 163);

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const gridX = 142;
  const columnGap = 132;
  const weekdayY = 293;
  const firstRowY = 374;
  const rowGap = 99;
  ctx.textAlign = "center";
  ctx.font = canvasFont(700, 29);
  weekdays.forEach((label, index) => {
    ctx.fillStyle = index === 0 ? skin.sunday : index === 6 ? skin.saturday : skin.ink;
    ctx.fillText(label, gridX + columnGap * index, weekdayY);
  });

  let hasShortDay = false;
  for (let day = 1; day <= daysInMonth; day += 1) {
    const position = firstWeekday + day - 1;
    const column = position % 7;
    const row = Math.floor(position / 7);
    const x = gridX + columnGap * column;
    const y = firstRowY + rowGap * row;
    const status = getStatus(year, month, day);
    const isHoliday = holidays.has(dateKey(year, month, day));
    if (status === STATUS.SHORT) hasShortDay = true;

    if (status !== STATUS.OPEN) {
      ctx.fillStyle = status === STATUS.CLOSED ? closedColor : shortColor;
      ctx.beginPath();
      ctx.arc(x, y, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    const statusColor = status === STATUS.CLOSED ? closedColor : shortColor;
    const statusTextColor = isDarkColor(statusColor) ? "#FFFFFF" : skin.ink;
    ctx.fillStyle = status === STATUS.OPEN
      ? (column === 0 || isHoliday ? skin.sunday : column === 6 ? skin.saturday : skin.ink)
      : statusTextColor;
    ctx.font = canvasFont(700, 50);
    ctx.globalAlpha = status === STATUS.CLOSED ? 0.62 : status === STATUS.SHORT ? 0.72 : 1;
    ctx.fillText(String(day), x, y + 1);
    ctx.globalAlpha = 1;
  }

  const legendY = 1007;
  const legends = [
    [skin.background, "営業日"],
    [closedColor, "お休み"],
  ];
  if (hasShortDay) legends.push([shortColor, "変則営業"]);
  const legendXPositions = hasShortDay ? [300, 520, 740] : [410, 650];
  ctx.font = canvasFont(500, 22);
  legends.forEach(([color, label], index) => {
    const x = legendXPositions[index];
    ctx.fillStyle = color;
    ctx.strokeStyle = skin.footer;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x - 38, legendY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = skin.ink;
    ctx.textAlign = "left";
    ctx.fillText(label, x - 13, legendY);
  });
  ctx.textAlign = "center";

  generatedCalendarCanvas = canvas;
  return canvas.toDataURL("image/png");
}

function dataUrlToBlob(dataUrl) {
  const [header, encoded] = dataUrl.split(",");
  const mimeType = header.match(/data:([^;]+)/)?.[1] || "application/octet-stream";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mimeType });
}

function isAppleMobileDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

async function saveImageToDevice(dataUrl, filename) {
  const blob = dataUrlToBlob(dataUrl);
  const file = typeof File === "function" ? new File([blob], filename, { type: blob.type }) : null;

  if (file && isAppleMobileDevice() && navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
}

async function downloadCalendarImage(filenamePrefix = "らくらく告知") {
  if (!generatedImageUrl || !generatedCalendarCanvas) generatedImageUrl = createCalendarImage();
  await saveImageToDevice(generatedImageUrl, `${filenamePrefix}-${monthKey(visibleMonth)}.png`);
}

async function downloadPrintImage() {
  if (!generatedImageUrl || !generatedCalendarCanvas) generatedImageUrl = createCalendarImage();

  const canvas = document.createElement("canvas");
  canvas.width = 2480;
  canvas.height = 3508;
  const context = canvas.getContext("2d");
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(generatedCalendarCanvas, 220, 734, 2040, 2040);
  await saveImageToDevice(
    canvas.toDataURL("image/jpeg", 0.94),
    `らくらく告知-印刷用-${monthKey(visibleMonth)}.jpg`,
  );
}

async function loadImageFont() {
  if (!document.fonts) return;
  try {
    const font = getSelectedFont();
    await Promise.all([400, 500, 700, 800, 900].map((weight) => document.fonts.load(`${weight} 190px ${font.family}`, "営業日のご案内0123456789")));
    await document.fonts.ready;
  } catch {
    // フォントを読み込めない環境では、端末の標準フォントで画像を作成する
  }
}

function renderStyleOptions() {
  const preferences = getImagePreferences();
  skinOptions.replaceChildren();
  fontOptions.replaceChildren();

  [...new Set(imageSkins.map((skin) => skin.group))].forEach((group) => {
    const groupElement = document.createElement("div");
    groupElement.className = "skin-option-group";
    imageSkins.filter((skin) => skin.group === group).forEach((skin) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "skin-option";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(skin.id === preferences.skinId));
      button.setAttribute("aria-label", `色の組み合わせ ${skin.header} と ${skin.footer}`);
      button.innerHTML = `<span class="skin-swatch" aria-hidden="true"><i style="background:${skin.header}"></i><i style="background:${skin.footer}"></i></span>`;
      button.addEventListener("click", () => selectImageSkin(skin.id));
      groupElement.append(button);
    });
    skinOptions.append(groupElement);
  });

  imageFonts.forEach((font) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `font-option font-option--${font.id}`;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(font.id === preferences.fontId));
    button.textContent = "あいう123";
    button.addEventListener("click", () => selectImageFont(font.id));
    fontOptions.append(button);
  });
}

async function refreshCalendarPreview() {
  await loadImageFont();
  generatedImageUrl = createCalendarImage();
  calendarPreview.src = generatedImageUrl;
  await calendarPreview.decode().catch(() => {});
}

async function selectImageSkin(skinId) {
  getImagePreferences().skinId = skinId;
  saveState();
  renderStyleOptions();
  await refreshCalendarPreview();
}

async function selectImageFont(fontId) {
  getImagePreferences().fontId = fontId;
  saveState();
  renderStyleOptions();
  await refreshCalendarPreview();
}

async function showPostScreen() {
  const note = specialNote.value.trim();
  getMonthState().note = note;
  getMonthState().confirmed = true;
  saveState();
  const originalLabel = saveButton.textContent;
  saveButton.disabled = true;
  saveButton.textContent = getAiState().token && note ? "AIが文章を整えています…" : "保存しています…";
  try {
    const [rewrittenNote] = await Promise.all([
      rewriteNoteWithAi(note),
      refreshCalendarPreview(),
    ]);
    postText.value = generatePostText(rewrittenNote);
    updatePostCount();
    calendarScreen.hidden = true;
    homeScreen.hidden = true;
    settingsScreen.hidden = true;
    postScreen.hidden = false;
    document.body.classList.add("post-mode");
    window.scrollTo({ top: 0 });
    addHistoryEntry("post-screen");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = originalLabel;
  }
}

function showCalendarScreen(addToHistory = true) {
  postScreen.hidden = true;
  homeScreen.hidden = true;
  settingsScreen.hidden = true;
  calendarScreen.hidden = false;
  document.body.classList.remove("post-mode");
  copyToast.hidden = true;
  window.scrollTo({ top: 0 });
  if (addToHistory) addHistoryEntry("calendar-screen");
}

function showHomeScreen(addToHistory = true) {
  calendarScreen.hidden = true;
  postScreen.hidden = true;
  settingsScreen.hidden = true;
  homeScreen.hidden = false;
  document.body.classList.remove("post-mode");
  copyToast.hidden = true;
  window.scrollTo({ top: 0 });
  if (addToHistory) addHistoryEntry("home-screen");
}

function openCalendar(month, addToHistory = true) {
  if (!isEditableMonth(month)) return;
  visibleMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  homeScreen.hidden = true;
  postScreen.hidden = true;
  settingsScreen.hidden = true;
  calendarScreen.hidden = false;
  document.body.classList.remove("post-mode");
  renderCalendar();
  window.scrollTo({ top: 0 });
  if (addToHistory) addHistoryEntry("calendar-screen");
}

function restoreHistoryScreen(historyState) {
  const destination = historyState?.screen || "home-screen";
  if (historyState?.month) {
    const [year, month] = historyState.month.split("-").map(Number);
    const restoredMonth = new Date(year, month - 1, 1);
    if (isEditableMonth(restoredMonth)) visibleMonth = restoredMonth;
  }

  if (destination === "settings-screen") {
    screenBeforeSettings = historyState.returnScreen || "home-screen";
    openSettings(false);
  } else if (destination === "calendar-screen") {
    showCalendarScreen(false);
    renderCalendar();
  } else if (destination === "post-screen") {
    screenElements.forEach((screen) => { screen.hidden = screen !== postScreen; });
    document.body.classList.add("post-mode");
    window.scrollTo({ top: 0 });
  } else {
    showHomeScreen(false);
  }
}

function updatePostCount() {
  postCount.textContent = postText.value.length;
  const isOverLimit = postText.value.length > MAX_POST_LENGTH;
  snsActions.querySelectorAll(".sns-button").forEach((button) => {
    button.disabled = isOverLimit;
    button.setAttribute("aria-disabled", String(isOverLimit));
    button.title = isOverLimit ? `${MAX_POST_LENGTH}文字以内に整えると投稿できます` : "";
  });
}

let copyToastTimer;

async function copyPostText(showToast = true) {
  try {
    await navigator.clipboard.writeText(postText.value);
  } catch {
    postText.focus();
    postText.select();
    document.execCommand("copy");
  }
  if (showToast) {
    clearTimeout(copyToastTimer);
    copyToast.hidden = false;
    copyToastTimer = window.setTimeout(() => {
      copyToast.hidden = true;
    }, 1200);
  }
}

async function copyAndOpen(service) {
  if (postText.value.length > MAX_POST_LENGTH) return;
  await copyPostText(false);
  const option = SNS_OPTIONS.find((item) => item.id === service);
  if (!option) return;
  const url = service === "x"
    ? `${option.url}?text=${encodeURIComponent(postText.value)}`
    : option.url;
  window.open(url, "_blank", "noopener,noreferrer");
}

previousMonthButton.addEventListener("click", () => changeMonth(-1));
previousLabel.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));
nextLabel.addEventListener("click", () => changeMonth(1));
specialNote.addEventListener("input", updateNoteCount);
postText.addEventListener("input", updatePostCount);
saveButton.addEventListener("click", showPostScreen);
document.querySelector("#download-image").addEventListener("click", () => downloadCalendarImage("らくらく告知-SNS用"));
document.querySelector("#download-print-image").addEventListener("click", downloadPrintImage);
document.querySelector("#back-to-calendar").addEventListener("click", showCalendarScreen);
document.querySelectorAll(".home-link").forEach((button) => button.addEventListener("click", showHomeScreen));
document.querySelector("#copy-post-text").addEventListener("click", copyPostText);
document.querySelector("#open-next-month").addEventListener("click", () => openCalendar(new Date(today.getFullYear(), today.getMonth() + 1, 1)));
document.querySelector("#open-current-month").addEventListener("click", () => openCalendar(new Date(today.getFullYear(), today.getMonth(), 1)));
openSettingsButton.addEventListener("click", toggleSettings);
closeSettingsButton.addEventListener("click", closeSettings);
accessCode.addEventListener("input", updateCodeBoxes);
accessCode.addEventListener("focus", updateCodeBoxes);
accessCode.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && accessCode.value.length === 7) authorizeAi();
});
document.querySelector("#code-entry").addEventListener("click", () => accessCode.focus());
authorizeAiButton.addEventListener("click", authorizeAi);
businessType.addEventListener("change", () => {
  getAiContext().businessType = businessType.value;
  saveState();
});
writingTone.addEventListener("change", () => {
  getAiContext().writingTone = writingTone.value;
  saveState();
});
snsCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selected = snsCheckboxes.filter((item) => item.checked).map((item) => item.value);
    if (!selected.length) {
      checkbox.checked = true;
      return;
    }
    getImagePreferences().snsIds = selected;
    saveState();
    renderSnsButtons();
  });
});
imageStyleButton.addEventListener("click", () => {
  const willOpen = imageStylePicker.hidden;
  imageStylePicker.hidden = !willOpen;
  imageStyleButton.setAttribute("aria-expanded", String(willOpen));
});
window.addEventListener("popstate", (event) => restoreHistoryScreen(event.state));

renderStyleOptions();
renderAiContextSettings();
renderSnsSettings();
renderSnsButtons();
updateCodeBoxes();
updateAiSettingsView();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

renderCalendar();
history.replaceState(createHistoryState("home-screen"), "");
