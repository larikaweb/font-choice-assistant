import type { PreviewLanguage, PreviewText } from "./types.js";

const RU_PREVIEW_TEXT: PreviewText = {
  heading: "Консультация по проекту",
  body: "Помогаем выбрать понятную визуальную систему: спокойную, читаемую и точную.",
  button: "Оставить заявку",
  caption: "Проверка плотности, ритма и читаемости текста.",
  quote: "Шрифт должен поддерживать смысл, а не просто украшать страницу.",
  label: "Стоимость · Документы · Программа",
  cyrillicWords: [
    "Образование",
    "Консультация",
    "Документы",
    "Стоимость",
    "Архитектура",
    "Заявка",
    "Психология",
    "Программа"
  ],
  cyrillicLetters: ["Ж", "Д", "У", "Щ", "Я", "ф"],
  cyrillicCombinations: ["ст", "ск", "пр", "ия", "нт", "ция"],
};

const EN_PREVIEW_TEXT: PreviewText = {
  heading: "Design consultation",
  body: "A readable typographic system should support the message before it decorates it.",
  button: "Start a project",
  caption: "Checking density, rhythm, and reading comfort.",
  quote: "A font should clarify the tone and role of the text.",
  label: "Price · Documents · Program",
  cyrillicWords: [],
  cyrillicLetters: [],
  cyrillicCombinations: [],
};

export function buildPreviewText(language: PreviewLanguage = "auto"): PreviewText {
  if (language === "en") return EN_PREVIEW_TEXT;
  return RU_PREVIEW_TEXT;
}
