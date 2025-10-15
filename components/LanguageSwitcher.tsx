import React from 'react';
import { useLanguage, Locale } from '../contexts/LanguageContext';

const locales: Locale[] = ['pl', 'en', 'es'];

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale, t } = useLanguage();

    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];

    const handleLanguageChange = () => {
        setLocale(nextLocale);
    };

    return (
        <button
            onClick={handleLanguageChange}
            className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 flex items-center justify-center w-10 h-10 font-bold text-sm"
            aria-label={t('changeLanguage')}
        >
            {nextLocale.toUpperCase()}
        </button>
    );
};

export default LanguageSwitcher;
