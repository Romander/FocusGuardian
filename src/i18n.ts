import i18n, { use } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "../public/_locales/en/messages.json";
import hiIN from "../public/_locales/hi-IN/messages.json";
import ru from "../public/_locales/ru/messages.json";
import tr from "../public/_locales/tr/messages.json";

// Transform Chrome extension format to i18next format
const transformResources = (resource: Record<string, { message: string }>) => {
  const transformed: Record<string, string> = {};
  Object.keys(resource).forEach((key) => {
    transformed[key] = resource[key].message;
  });
  return transformed;
};

const resources = {
  en: {
    translation: transformResources(en),
  },
  ru: {
    translation: transformResources(ru),
  },
  tr: {
    translation: transformResources(tr),
  },
  "hi-IN": {
    translation: transformResources(hiIN),
  },
};

void use(initReactI18next).use(LanguageDetector).init({
  resources,
  lng: "en",
});

export default i18n;
