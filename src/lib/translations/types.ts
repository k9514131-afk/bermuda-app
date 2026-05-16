/**
 * @fileOverview Definition of supported languages and translation structures.
 * Future support for 12 languages planned. Currently focused on Arabic ('ar').
 */

export type Language = 'ar' | 'en' | 'fr' | 'es' | 'it' | 'de' | 'zh' | 'ko' | 'ja' | 'af' | 'nl' | 'ru' | 'tr';

export interface Translations {
  [key: string]: {
    [lang in Language]?: string;
  };
}

export const languageNames: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  de: 'Deutsch',
  zh: '中文',
  ko: '한국어',
  ja: '日本語',
  af: 'Afrikaans',
  nl: 'Nederlands',
  ru: 'Русский',
  tr: 'Türkçe'
};
