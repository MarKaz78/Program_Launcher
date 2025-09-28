import React from 'react';
import ProgramTile from './components/ProgramTile';
import NewsletterSignup from './components/NewsletterSignup';
import ThemeToggle from './components/ThemeToggle';
import { PROGRAMS } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 -z-10 h-1/3 w-full bg-[radial-gradient(circle_farthest-side_at_50%_0,rgba(0,163,255,0.2),rgba(0,163,255,0))]"></div>
      
      <ThemeToggle />

      <main className="container mx-auto px-4 py-16 sm:py-24">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 py-2">
            Wybierz Aplikację
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Kliknij na kafelek, aby otworzyć wybraną aplikację w nowej karcie przeglądarki.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program) => (
            <ProgramTile key={program.id} program={program} />
          ))}
        </div>

        <div className="mt-20 sm:mt-24">
            <NewsletterSignup />
        </div>
      </main>
      
      <footer className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
        Stworzone przez{' '}
        <a 
          href="https://www.linkedin.com/company/bim-partner/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 hover:scale-110 inline-block transition-all duration-300 ease-in-out"
        >
          BIM PARTNER
        </a>
        . Wszelkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default App;