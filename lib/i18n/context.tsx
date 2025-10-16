'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupportedLanguage, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './config';
import enCommon from '@/locales/en/common.json';
import enHome from '@/locales/en/home.json';
import enAuth from '@/locales/en/auth.json';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, any>>({
    ...enCommon,
    ...enHome,
    ...enAuth,
  });

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    if (savedLang && ['en', 'de', 'ru'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    // Load translations when language changes
    const loadTranslations = async () => {
      try {
        const [common, home, auth] = await Promise.all([
          import(`@/locales/${language}/common.json`),
          import(`@/locales/${language}/home.json`),
          import(`@/locales/${language}/auth.json`),
        ]);

        setTranslations({
          ...common.default,
          ...home.default,
          ...auth.default,
        });
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        setTranslations({
          ...enCommon,
          ...enHome,
          ...enAuth,
        });
      }
    };

    loadTranslations();
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Replace parameters if provided
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
