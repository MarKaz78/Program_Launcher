import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage: React.FC = () => {
    const { login, session } = useAuth();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (session) {
            window.location.hash = '/admin';
        }
    }, [session]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await login(email, password);

        if (error) {
            setError(error.message || t('unexpectedError'));
        } else {
            // The useEffect hook will handle redirection
            window.location.hash = '/admin';
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
             <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
             <div className="absolute top-0 left-0 -z-10 h-1/3 w-full bg-[radial-gradient(circle_farthest-side_at_50%_0,rgba(0,163,255,0.2),rgba(0,163,255,0))]"></div>
            
             <div className="w-full max-w-md p-8 space-y-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-2xl">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                        {t('adminPanelLoginTitle')}
                    </h2>
                     <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        {t('loginToManage')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">{t('emailLabel')}</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/70 placeholder-slate-500 text-slate-900 dark:text-white rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder={t('emailLabel')}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">{t('passwordLabel')}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/70 placeholder-slate-500 text-slate-900 dark:text-white rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder={t('passwordLabel')}
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
                    <div>
                        <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-wait">
                            {loading ? t('loggingIn') : t('login')}
                        </button>
                    </div>
                </form>
                 <p className="mt-4 text-center text-sm">
                    <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '/'; }} className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                        {t('backToHome')}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;