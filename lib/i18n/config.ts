export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', flag: 'EN' },
  de: { code: 'de', name: 'Deutsch', flag: 'DE' },
  ru: { code: 'ru', name: 'Русский', flag: 'RU' },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const LANGUAGE_STORAGE_KEY = 'studiwelt_language';
