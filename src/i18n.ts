import i18n, { use } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Function to load messages using chrome.i18n
const loadChromeI18nMessages = () => {
  const resources: { [key: string]: { translation: { [key: string]: string } } } = {};
  const uiLanguage = chrome.i18n.getUILanguage();

  // Use chrome.i18n.getMessage to get messages
  const getMessage = (key: string) => chrome.i18n.getMessage(key);

  // Assuming you have a list of keys you want to load
  const keys = ["welcome", "goodbye"]; // Example keys
  const messages = keys.reduce((acc, key) => {
    acc[key] = getMessage(key);
    return acc;
  }, {} as { [key: string]: string });

  resources[uiLanguage] = { translation: messages };

  return resources;
};

  const resources = loadChromeI18nMessages();
  void use(initReactI18next).use(LanguageDetector).init({
    resources,
    lng: chrome.i18n.getUILanguage(),
  });

export default i18n;
