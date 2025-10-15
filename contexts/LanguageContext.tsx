import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { translations } from '../lib/translations';

export type Locale = 'pl' | 'en' | 'es';

type Translations = typeof translations.pl;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLocale = (): Locale => {
    if (typeof window !== 'undefined') {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (['pl', 'en', 'es'].includes(savedLocale)) {
            return savedLocale;
        }
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'pl' || browserLang === 'es') {
            return browserLang;
        }
    }
    return 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: keyof Translations, replacements?: { [key: string]: string | number }): string => {
    let translation = translations[locale][key] || translations['en'][key];
    if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
            translation = translation.replace(`{{${key}}}`, String(value));
        });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
