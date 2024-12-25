import i18n, { use } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import hiIN from "./locales/hi-IN/translation.json";
import ru from "./locales/ru/translation.json";
import tr from "./locales/tr/translation.json";

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
  tr: {
    translation: tr,
  },
  "hi-IN": {
    translation: hiIN,
  },
};

void use(initReactI18next).use(LanguageDetector).init({
  resources,
  lng: "en",
});

export default i18n;
