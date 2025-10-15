import React, { useState, useEffect } from 'react';
import ProgramTile from '../components/ProgramTile';
import NewsletterSignup from '../components/NewsletterSignup';
import ThemeToggle from '../components/ThemeToggle';
import InfoModal from '../components/InfoModal';
import { supabase } from '../lib/supabase';
import type { Program } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);


const HomePage: React.FC = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!supabase) {
        setError(t('noSupabaseConfig'));
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        setError(t('errorLoadingApps', { message: error.message }));
        console.error('Error fetching programs:', error);
      } else {
        setPrograms(data || []);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, [t]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 -z-10 h-1/3 w-full bg-[radial-gradient(circle_farthest-side_at_50%_0,rgba(0,163,255,0.2),rgba(0,163,255,0))]"></div>
      
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
          aria-label={t('pageInfo')}
        >
          <InfoIcon className="w-6 h-6" />
        </button>
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-16 sm:py-24">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 py-2">
            {t('chooseApp')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            {t('homeDescription')}
          </p>
        </header>

        {loading ? (
          <div className="text-center text-slate-500 dark:text-slate-400">{t('loadingApps')}</div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <ProgramTile key={program.id} program={program} />
            ))}
          </div>
        )}

        <div className="mt-20 sm:mt-24">
            <NewsletterSignup />
        </div>
      </main>
      
      <footer className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm space-x-4">
        <span>
            {t('createdBy')}{' '}
            <a 
            href="https://www.linkedin.com/company/bim-partner/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 hover:scale-110 inline-block transition-all duration-300 ease-in-out"
            >
            BIM PARTNER
            </a>
            . {t('allRightsReserved')}.
        </span>
        <span>|</span>
        <a href="#/login" onClick={(e) => { e.preventDefault(); window.location.hash = '/login'; }} className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
            {t('adminPanel')}
        </a>
      </footer>

      {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} />}
    </div>
  );
};

export default HomePage;