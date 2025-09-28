import React, { useState } from 'react';
import { EmailIcon } from '../constants';
import { supabase } from '../lib/supabase';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const isSupabaseConfigured = !!supabase;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setStatus('error');
      setMessage('Funkcja zapisu jest obecnie niedostępna.');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Proszę podać prawidłowy adres e-mail.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      setStatus('error');
      if (error.code === '23505') { // Unique constraint violation
        setMessage('Ten adres e-mail jest już zapisany.');
      } else {
        setMessage('Wystąpił błąd. Spróbuj ponownie później.');
      }
      console.error('Supabase error:', error);
    } else {
      setStatus('success');
      setMessage('Dziękujemy! Zostałeś zapisany na listę mailingową.');
      setEmail('');
    }
  };
  
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Bądź na bieżąco!</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        Zapisz się, aby otrzymywać informacje o aktualizacjach, nowych programach i ciekawych funkcjach.
      </p>
      
      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EmailIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isSupabaseConfigured ? "Twój adres e-mail" : "Funkcja niedostępna"}
              required
              aria-label="Adres e-mail"
              disabled={!isSupabaseConfigured}
              className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'submitting' || !isSupabaseConfigured}
            className="flex-shrink-0 bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Zapisywanie...' : 'Zapisz się'}
          </button>
        </form>
      ) : null}

      {message && (
        <p className={`mt-4 text-sm font-medium ${status === 'success' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {message}
        </p>
      )}

      {!isSupabaseConfigured && status !== 'error' && (
         <p className="mt-4 text-sm text-amber-600 dark:text-amber-500">
           Zapis na newsletter jest chwilowo niedostępny z powodu braku konfiguracji.
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;