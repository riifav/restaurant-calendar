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
];

const imageFonts = [
  { id: "rounded", name: "丸ゴシック", family: '"M PLUS Rounded 1c"' },
  { id: "gothic", name: "さわらびゴシック", family: '"Sawarabi Gothic"' },
  { id: "mincho", name: "明朝体", family: '"Zen Old Mincho"' },
];

const DEFAULT_SKIN_ID = "coral-lemon";
const DEFAULT_FONT_ID = "rounded";

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

const monthEmojis = ["⛄", "🍫", "🌸", "🌷", "🌿", "☂️", "☀️", "🍉", "🌕", "🍂", "🍁", "🎄"];
const state = loadState();
const today = new Date();
let visibleMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
let generatedImageUrl = "";

const calendarScreen = document.querySelector("#calendar-screen");
const homeScreen = document.querySelector("#home-screen");
const postScreen = document.querySelector("#post-screen");
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
const copyMessage = document.querySelector("#copy-message");
const imageStylePicker = document.querySelector("#image-style-picker");
const imageStyleButton = document.querySelector("#open-image-style");
const skinOptions = document.querySelector("#skin-options");
const fontOptions = document.querySelector("#font-options");

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

  previousLabel.textContent = formatMonth(adjacentMonth(-1));
  currentLabel.textContent = formatMonth(visibleMonth);
  nextLabel.textContent = formatMonth(adjacentMonth(1));
  previousLabel.setAttribute("aria-label", `${previousLabel.textContent}を見る`);
  nextLabel.setAttribute("aria-label", `${nextLabel.textContent}を見る`);
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
  getMonthState().note = specialNote.value.trim();
  visibleMonth = adjacentMonth(offset);
  savedMessage.textContent = "";
  renderCalendar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNoteCount() {
  noteCount.textContent = specialNote.value.length;
}

function generatePostText() {
  const month = visibleMonth.getMonth();
  const note = specialNote.value.replace(/\s+/g, " ").trim();
  const heading = `${monthEmojis[month]} ${formatMonth(visibleMonth)} 営業日のご案内 ${monthEmojis[month]}`;
  const parts = [heading, seasonalMessages[month]];
  if (note) parts.push(note);
  parts.push("営業日は画像をご確認ください🗓️");
  return parts.join("\n\n").slice(0, MAX_POST_LENGTH);
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
  ctx.roundRect(56, 54, 968, 292, 30);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = skin.headerText;
  ctx.font = canvasFont(800, 190);
  ctx.fillText(String(month + 1).padStart(2, "0"), 208, 204);
  ctx.textAlign = "left";
  ctx.font = canvasFont(700, 31);
  ctx.fillText(`${year}年${month + 1}月`, 385, 141);
  ctx.font = canvasFont(800, 50);
  ctx.fillText("営業日のご案内", 385, 211);
  ctx.font = canvasFont(500, 24);
  ctx.fillText("OPENING CALENDAR", 387, 270);

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const gridX = 150;
  const columnGap = 130;
  const weekdayY = 424;
  const firstRowY = 490;
  const rowGap = 84;
  ctx.textAlign = "center";
  ctx.font = canvasFont(700, 22);
  weekdays.forEach((label, index) => {
    ctx.fillStyle = index === 0 ? skin.sunday : index === 6 ? skin.saturday : skin.ink;
    ctx.fillText(label, gridX + columnGap * index, weekdayY);
  });

  for (let day = 1; day <= daysInMonth; day += 1) {
    const position = firstWeekday + day - 1;
    const column = position % 7;
    const row = Math.floor(position / 7);
    const x = gridX + columnGap * column;
    const y = firstRowY + rowGap * row;
    const status = getStatus(year, month, day);
    const isHoliday = holidays.has(dateKey(year, month, day));

    if (status !== STATUS.OPEN) {
      ctx.fillStyle = status === STATUS.CLOSED ? skin.closed : skin.short;
      ctx.beginPath();
      ctx.arc(x, y, 39, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = column === 0 || isHoliday ? skin.sunday : column === 6 ? skin.saturday : skin.ink;
    ctx.font = canvasFont(700, 42);
    ctx.fillText(String(day), x, y + 1);
  }

  const legendY = 1025;
  const legends = [
    [skin.background, "営業日"],
    [skin.closed, "お休み"],
    [skin.short, "変則営業"],
  ];
  ctx.font = canvasFont(500, 21);
  legends.forEach(([color, label], index) => {
    const x = 350 + index * 190;
    ctx.fillStyle = color;
    ctx.strokeStyle = skin.footer;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x - 43, legendY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = skin.ink;
    ctx.textAlign = "left";
    ctx.fillText(label, x - 18, legendY);
  });
  ctx.textAlign = "center";

  return canvas.toDataURL("image/png");
}

function downloadCalendarImage(filenamePrefix = "営業日カレンダー") {
  if (!generatedImageUrl) generatedImageUrl = createCalendarImage();
  const link = document.createElement("a");
  link.href = generatedImageUrl;
  link.download = `${filenamePrefix}-${monthKey(visibleMonth)}.png`;
  document.body.append(link);
  link.click();
  link.remove();
}

async function downloadPrintImage() {
  if (!generatedImageUrl) generatedImageUrl = createCalendarImage();
  const image = new Image();
  image.src = generatedImageUrl;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 2480;
  canvas.height = 3508;
  const context = canvas.getContext("2d");
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 220, 734, 2040, 2040);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/jpeg", 0.94);
  link.download = `営業日カレンダー-印刷用-${monthKey(visibleMonth)}.jpg`;
  document.body.append(link);
  link.click();
  link.remove();
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
  getMonthState().note = specialNote.value.trim();
  getMonthState().confirmed = true;
  saveState();
  await refreshCalendarPreview();
  postText.value = generatePostText();
  updatePostCount();
  calendarScreen.hidden = true;
  homeScreen.hidden = true;
  postScreen.hidden = false;
  document.body.classList.add("post-mode");
  window.scrollTo({ top: 0 });
}

function showCalendarScreen() {
  postScreen.hidden = true;
  homeScreen.hidden = true;
  calendarScreen.hidden = false;
  document.body.classList.remove("post-mode");
  copyMessage.textContent = "";
  window.scrollTo({ top: 0 });
}

function openCalendar(month) {
  visibleMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  homeScreen.hidden = true;
  postScreen.hidden = true;
  calendarScreen.hidden = false;
  document.body.classList.remove("post-mode");
  renderCalendar();
  window.scrollTo({ top: 0 });
}

function updatePostCount() {
  postCount.textContent = postText.value.length;
}

async function copyPostText() {
  try {
    await navigator.clipboard.writeText(postText.value);
  } catch {
    postText.focus();
    postText.select();
    document.execCommand("copy");
  }
  copyMessage.textContent = "文章をコピーしました。保存した画像を選んで投稿してください。";
}

async function copyAndOpen(service) {
  await copyPostText();
  const url = service === "instagram"
    ? "https://www.instagram.com/"
    : `https://x.com/compose/post?text=${encodeURIComponent(postText.value)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

previousMonthButton.addEventListener("click", () => changeMonth(-1));
previousLabel.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));
nextLabel.addEventListener("click", () => changeMonth(1));
specialNote.addEventListener("input", updateNoteCount);
postText.addEventListener("input", updatePostCount);
saveButton.addEventListener("click", showPostScreen);
document.querySelector("#download-image").addEventListener("click", () => downloadCalendarImage("営業日カレンダー-SNS用"));
document.querySelector("#download-print-image").addEventListener("click", downloadPrintImage);
document.querySelector("#back-to-calendar").addEventListener("click", showCalendarScreen);
document.querySelector("#open-instagram").addEventListener("click", () => copyAndOpen("instagram"));
document.querySelector("#open-x").addEventListener("click", () => copyAndOpen("x"));
document.querySelector("#copy-post-text").addEventListener("click", copyPostText);
document.querySelector("#open-next-month").addEventListener("click", () => openCalendar(new Date(today.getFullYear(), today.getMonth() + 1, 1)));
document.querySelector("#open-current-month").addEventListener("click", () => openCalendar(new Date(today.getFullYear(), today.getMonth(), 1)));
imageStyleButton.addEventListener("click", () => {
  const willOpen = imageStylePicker.hidden;
  imageStylePicker.hidden = !willOpen;
  imageStyleButton.setAttribute("aria-expanded", String(willOpen));
});

renderStyleOptions();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

renderCalendar();
