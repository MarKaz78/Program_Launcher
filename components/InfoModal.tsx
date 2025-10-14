import React, { useEffect, useRef } from 'react';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Zamknij"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h2 id="info-modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          O aplikacji
        </h2>

        <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-400">
            <p>
                Witaj w Program Launcher! Jest to centralne miejsce do uruchamiania moich autorskich aplikacji webowych.
            </p>
            <div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Użyte technologie:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>React & TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>Supabase (dla Newslettera)</li>
                </ul>
            </div>
            <p>
                Stworzone przez <a href="https://www.linkedin.com/company/bim-partner/" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">BIM PARTNER</a>.
            </p>
        </div>
        
        <div className="mt-6 flex justify-end">
            <button
                onClick={onClose}
                className="bg-cyan-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all duration-300"
            >
                Rozumiem
            </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;