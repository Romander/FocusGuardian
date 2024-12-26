import i18n, { use } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Transform Chrome extension format to i18next format
const transformResources = (resource: Record<string, { message: string }>) => {
  const transformed: Record<string, string> = {};
  Object.keys(resource).forEach((key) => {
    transformed[key] = resource[key].message;
  });
  return transformed;
};

// Initialize with empty resources first
void use(initReactI18next).use(LanguageDetector).init({
  resources: {},
  lng: "en",
  fallbackLng: "en",
});

// Dynamically import all locale files
const localeContext = import.meta.glob('../public/_locales/*/messages.json', { eager: true });

// Process and add resources
const resources = Object.entries(localeContext).reduce((acc, [path, module]) => {
  // Extract language code from path, preserving full code like zh_CN
  const langCode = path.match(/_locales\/([^/]+)\/messages\.json/)?.[1] || '';
  const messages = (module as { default: Record<string, { message: string }> }).default;
  
  if (messages) {
    return {
      ...acc,
      [langCode]: {
        translation: transformResources(messages),
      },
    };
  }
  return acc;
}, {} as Record<string, { translation: Record<string, string> }>);

// Add resources to i18n
Object.keys(resources).forEach((lng) => {
  i18n.addResourceBundle(lng, 'translation', resources[lng].translation);
});

export default i18n;
