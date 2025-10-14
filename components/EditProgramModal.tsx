import React, { useState, useEffect, useRef } from 'react';
import type { Program } from '../types';

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Program) => void;
  program: Program | null;
}

const EditProgramModal: React.FC<EditProgramModalProps> = ({ isOpen, onClose, onSave, program }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (program) {
      setName(program.name);
      setDescription(program.description);
      setUrl(program.url);
      setIcon(program.icon);
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
      onSave({ ...program, name, description, url, icon });
    }
  };

  if (!isOpen) return null;

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
        className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <header className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 id="edit-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Edytuj aplikację
            </h2>
        </header>
        
        <main className="p-6 space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nazwa</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
            </div>
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
                <input id="url" type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Opis</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
            </div>
             <div>
                <label htmlFor="icon-svg" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kod SVG ikony</label>
                <textarea id="icon-svg" placeholder='<svg ...>...</svg>' value={icon} onChange={e => setIcon(e.target.value)} rows={4} className="w-full font-mono text-sm bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
            </div>
        </main>
        
        <footer className="p-6 flex justify-end space-x-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
            <button
                onClick={onClose}
                className="bg-slate-200 text-slate-800 font-semibold py-2 px-5 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-slate-500 transition-all duration-300"
            >
                Anuluj
            </button>
            <button
                onClick={handleSave}
                className="bg-cyan-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all duration-300"
            >
                Zapisz zmiany
            </button>
        </footer>
      </div>
    </div>
  );
};

export default EditProgramModal;