import React, { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isConfirming: boolean;
  intent?: 'danger' | 'primary';
  confirmText?: string;
  cancelText?: string;
}

const Spinner: React.FC<{className?: string}> = ({className}) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    isConfirming, 
    intent = 'danger', 
    confirmText,
    cancelText = 'Anuluj'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
  
  if (!isOpen) return null;

  const confirmButtonClasses = intent === 'danger'
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500';

  const defaultConfirmText = intent === 'danger' ? 'Usuń' : 'Potwierdź';
  const processingText = intent === 'danger' ? 'Usuwanie...' : 'Przetwarzanie...';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8"
      >
        <h2 id="confirmation-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>

        <div className="mt-4 text-slate-600 dark:text-slate-400">
            <p>{message}</p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-4">
            <button
                onClick={onClose}
                disabled={isConfirming}
                className="bg-slate-200 text-slate-800 font-semibold py-2 px-5 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-slate-500 transition-all duration-300 disabled:opacity-50"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                disabled={isConfirming}
                className={`flex items-center justify-center text-white font-semibold py-2 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait ${confirmButtonClasses}`}
            >
                {isConfirming ? <Spinner className="w-5 h-5 mr-2" /> : null}
                {isConfirming ? processingText : (confirmText || defaultConfirmText)}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;