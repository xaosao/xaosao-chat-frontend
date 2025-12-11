import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import en from "./locales/en.json";
import lo from "./locales/lo.json";
import th from "./locales/th.json";
import zh from "./locales/zh.json";
import vi from "./locales/vi.json";
import ko from "./locales/ko.json";

// Get initial language from localStorage (shared with xaosao-client)
const getInitialLanguage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("i18nextLng") || "en";
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    lo: { translation: lo },
    th: { translation: th },
    zh: { translation: zh },
    vi: { translation: vi },
    ko: { translation: ko },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Listen for storage events to sync language changes from parent window (xaosao-client)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "i18nextLng" && event.newValue) {
      i18n.changeLanguage(event.newValue);
    }
  });

  // Also listen for custom message from parent iframe
  window.addEventListener("message", (event) => {
    if (event.data?.type === "LANGUAGE_CHANGE" && event.data?.language) {
      i18n.changeLanguage(event.data.language);
      localStorage.setItem("i18nextLng", event.data.language);
    }
  });
}

export default i18n;