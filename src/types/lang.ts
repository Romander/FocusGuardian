export const LANGUAGES = ["en", "ru", "tr", "hi-IN"] as const;
export type LangType = (typeof LANGUAGES)[number];
