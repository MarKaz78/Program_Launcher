import React, { useState, useEffect, useRef } from 'react';
import type { Program, LocalizedString } from '../types';
import { useLanguage, Locale } from '../contexts/LanguageContext';

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Program) => void;
  program: Program | null;
}

const initialLocalizedString: LocalizedString = { pl: '', en: '', es: '' };

const EditProgramModal: React.FC<EditProgramModalProps> = ({ isOpen, onClose, onSave, program }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const [name, setName] = useState<LocalizedString>(initialLocalizedString);
  const [description, setDescription] = useState<LocalizedString>(initialLocalizedString);
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<Locale>('pl');

  useEffect(() => {
    if (program) {
      setName(program.name || initialLocalizedString);
      setDescription(program.description || initialLocalizedString);
      setUrl(program.url);
      setIcon(program.icon);
      setIsNew(program.is_new || false);
      setActiveTab('pl'); // Reset to first tab on open
    }
  }, [program, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleSave = () => {
    if (program) {
      onSave({ ...program, name, description, url, icon, is_new: isNew });
    }
  };

  if (!isOpen) return null;

  const TabButton: React.FC<{ locale: Locale; children: React.ReactNode }> = ({ locale, children }) => (
    <button
      onClick={() => setActiveTab(locale)}
      className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
        activeTab === locale
          ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400'
          : 'bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <header className="p-6 border-b border-slate-200 dark:border-slate-700/50">
            <h2 id="edit-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {t('editAppTitle')}
            </h2>
        </header>
        
        <main className="p-6 space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-700/50 -mx-6 px-4">
              <nav className="flex space-x-2" aria-label="Tabs">
                <TabButton locale="pl">Polski</TabButton>
                <TabButton locale="en">English</TabButton>
                <TabButton locale="es">Español</TabButton>
              </nav>
            </div>
            
            <div className="pt-4">
              {(['pl', 'en', 'es'] as const).map(locale => (
                <div key={locale} className={activeTab === locale ? 'block' : 'hidden'}>
                  <div className="space-y-4">
                    <div>
                        <label htmlFor={`name-${locale}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t(`appName${locale.toUpperCase()}` as any)}</label>
                        <input id={`name-${locale}`} type="text" value={name[locale]} onChange={e => setName(s => ({...s, [locale]: e.target.value}))} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                    </div>
                    <div>
                        <label htmlFor={`description-${locale}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t(`appDescription${locale.toUpperCase()}` as any)}</label>
                        <textarea id={`description-${locale}`} value={description[locale]} onChange={e => setDescription(s => ({...s, [locale]: e.target.value}))} rows={3} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 space-y-4">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('url')}</label>
                    <input id="url" type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                </div>
                 <div>
                    <label htmlFor="icon-svg" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('appIconSVG')}</label>
                    <textarea id="icon-svg" placeholder='<svg ...>...</svg>' value={icon} onChange={e => setIcon(e.target.value)} rows={4} className="w-full font-mono text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                </div>
                <div className="flex items-center">
                    <input
                        id="is-new-edit"
                        type="checkbox"
                        checked={isNew}
                        onChange={e => setIsNew(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                    />
                    <label htmlFor="is-new-edit" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('markAsNew')}
                    </label>
                </div>
            </div>
        </main>
        
        <footer className="p-6 flex justify-end space-x-4 bg-slate-200/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700/50 rounded-b-2xl">
            <button
                onClick={onClose}
                className="bg-white text-slate-800 font-semibold py-2 px-5 rounded-lg hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-slate-500 transition-all duration-300"
            >
                {t('cancel')}
            </button>
            <button
                onClick={handleSave}
                className="bg-cyan-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300"
            >
                {t('saveChanges')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default EditProgramModal;