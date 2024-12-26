export const LANGUAGES = ["en", "ru", "tr", "hi", "de", "fr", "zh_CN"] as const;
export type LangType = (typeof LANGUAGES)[number];
