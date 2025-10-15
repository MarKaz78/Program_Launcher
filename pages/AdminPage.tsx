import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ICON_MAP } from '../constants';
import type { Program, LocalizedString } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import EditProgramModal from '../components/EditProgramModal';
import { useLanguage } from '../contexts/LanguageContext';

interface Subscriber {
    id: number;
    email: string;
    created_at: string;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.884v.916m7.5 0h-7.5" />
    </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const initialLocalizedString: LocalizedString = { pl: '', en: '', es: '' };

const AdminPage: React.FC = () => {
    const { session, logout } = useAuth();
    const { t, locale } = useLanguage();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    
    const [loading, setLoading] = useState({ subscribers: true, programs: true });
    const [error, setError] = useState({ subscribers: '', programs: '' });
    
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // New Program Form State
    const [newProgramName, setNewProgramName] = useState<LocalizedString>(initialLocalizedString);
    const [newProgramDesc, setNewProgramDesc] = useState<LocalizedString>(initialLocalizedString);
    const [newProgramUrl, setNewProgramUrl] = useState('');
    const [newProgramIcon, setNewProgramIcon] = useState('');
    const [newProgramIsNew, setNewProgramIsNew] = useState(false);
    const [isAddingProgram, setIsAddingProgram] = useState(false);

    // Delete Confirmation Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number; type: 'subscriber' | 'program'; name: string } | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    // Edit Program State
    const [programToEdit, setProgramToEdit] = useState<Program | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<Program | null>(null);
    const [isConfirmingSave, setIsConfirmingSave] = useState(false);


    useEffect(() => {
        if (!session) {
            window.location.hash = '/login';
        } else {
            fetchSubscribers();
            fetchPrograms();
        }
    }, [session]);

    const fetchSubscribers = async () => {
        if (!supabase) {
            setError(prev => ({ ...prev, subscribers: t('noSupabaseConfig') }));
            setLoading(prev => ({...prev, subscribers: false}));
            return;
        }
        setLoading(prev => ({...prev, subscribers: true}));
        const { data, error } = await supabase
            .from('subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError(prev => ({ ...prev, subscribers: error.message }));
        } else {
            setSubscribers(data || []);
        }
        setLoading(prev => ({...prev, subscribers: false}));
    };

    const fetchPrograms = async () => {
        if (!supabase) {
            setError(prev => ({ ...prev, programs: t('noSupabaseConfig') }));
            setLoading(prev => ({...prev, programs: false}));
            return;
        }
        setLoading(prev => ({...prev, programs: true}));
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError(prev => ({ ...prev, programs: error.message }));
        } else {
            setPrograms(data || []);
        }
        setLoading(prev => ({...prev, programs: false}));
    };

    const openDeleteModal = (id: number, type: 'subscriber' | 'program', name: string) => {
        setItemToDelete({ id, type, name });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete || !supabase) return;

        setIsConfirmingDelete(true);
        
        const fromTable = itemToDelete.type === 'program' ? 'programs' : 'subscribers';
        const { error } = await supabase.from(fromTable).delete().eq('id', itemToDelete.id);

        if (error) {
            alert(t('errorOccurred') + `: ${error.message}`);
        } else {
            if (itemToDelete.type === 'program') {
                setPrograms(programs.filter(p => p.id !== itemToDelete.id));
            } else {
                setSubscribers(subscribers.filter(sub => sub.id !== itemToDelete.id));
            }
        }
        
        setIsConfirmingDelete(false);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };
    
    const handleAddProgram = async (e: FormEvent) => {
        e.preventDefault();
        if (!supabase || !newProgramName.pl || !newProgramName.en || !newProgramName.es || !newProgramDesc.pl || !newProgramDesc.en || !newProgramDesc.es || !newProgramUrl || !newProgramIcon) {
            alert(t('fillAllFields'));
            return;
        }
        setIsAddingProgram(true);
        const { data, error } = await supabase.from('programs').insert([
            { name: newProgramName, description: newProgramDesc, url: newProgramUrl, icon: newProgramIcon, is_new: newProgramIsNew }
        ]).select();

        if (error) {
            alert(t('errorAdding', { message: error.message }));
        } else {
            if (data && data.length > 0) {
              setPrograms(currentPrograms => [data[0], ...currentPrograms]);
            }
            setNewProgramName(initialLocalizedString);
            setNewProgramDesc(initialLocalizedString);
            setNewProgramUrl('');
            setNewProgramIcon('');
            setNewProgramIsNew(false);
        }
        setIsAddingProgram(false);
    };

    const handleEditClick = (program: Program) => {
        setProgramToEdit(program);
        setIsEditModalOpen(true);
    };

    const handleSaveProgram = (updatedProgram: Program) => {
        setPendingUpdate(updatedProgram);
        setIsEditModalOpen(false);
        setIsSaveConfirmModalOpen(true);
    };

    const handleConfirmSave = async () => {
        if (!pendingUpdate || !supabase) return;
        setIsConfirmingSave(true);

        const { id, created_at, ...updateData } = pendingUpdate;

        const { data, error } = await supabase
            .from('programs')
            .update(updateData)
            .eq('id', pendingUpdate.id)
            .select();

        if (error) {
            console.error("Update error:", error);
            alert(t('errorOccurred') + `: ${error.message}`);
        } else {
            if (data && data.length > 0) {
                setPrograms(currentPrograms => 
                    currentPrograms.map(p => (p.id === data[0].id ? data[0] : p))
                );
            } else {
                console.warn("Update operation did not return data. This could be an RLS issue. Refetching the whole list.");
                await fetchPrograms();
            }
        }
        
        setIsConfirmingSave(false);
        setIsSaveConfirmModalOpen(false);
        setPendingUpdate(null);
        setProgramToEdit(null);
    };


    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        window.location.hash = '/login';
        setIsLoggingOut(false);
    };

    if (!session) return null;

    return (
        <>
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white font-sans transition-colors duration-300">
                <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                
                <div className="container mx-auto px-4 py-16">
                    <header className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-200">{t('adminPanelHeader')}</h1>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">{t('loggedInAs', { email: session.user.email || '' })}</p>
                        </div>
                        <button onClick={handleLogout} disabled={isLoggingOut} className="bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-red-500 transition-all duration-300 disabled:opacity-50">
                            {isLoggingOut ? t('loggingOut') : t('logout')}
                        </button>
                    </header>

                    {/* Program Management */}
                    <section className="mb-12">
                        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-lg">
                            <div className="p-6 border-b border-slate-200/80 dark:border-slate-700/50">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t('appManagement')}</h2>
                            </div>
                            {/* Add Program Form */}
                            <form onSubmit={handleAddProgram} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input type="text" placeholder={t('appNamePL')} value={newProgramName.pl} onChange={e => setNewProgramName(s => ({...s, pl: e.target.value}))} required className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                    <input type="text" placeholder={t('appNameEN')} value={newProgramName.en} onChange={e => setNewProgramName(s => ({...s, en: e.target.value}))} required className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                    <input type="text" placeholder={t('appNameES')} value={newProgramName.es} onChange={e => setNewProgramName(s => ({...s, es: e.target.value}))} required className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <textarea placeholder={t('appDescriptionPL')} value={newProgramDesc.pl} onChange={e => setNewProgramDesc(s => ({...s, pl: e.target.value}))} required rows={2} className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                    <textarea placeholder={t('appDescriptionEN')} value={newProgramDesc.en} onChange={e => setNewProgramDesc(s => ({...s, en: e.target.value}))} required rows={2} className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                    <textarea placeholder={t('appDescriptionES')} value={newProgramDesc.es} onChange={e => setNewProgramDesc(s => ({...s, es: e.target.value}))} required rows={2} className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                </div>
                                <input type="text" placeholder={t('appURL')} value={newProgramUrl} onChange={e => setNewProgramUrl(e.target.value)} required className="w-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                <textarea placeholder={t('appIconSVG')} value={newProgramIcon} onChange={e => setNewProgramIcon(e.target.value)} required rows={3} className="w-full font-mono text-sm bg-slate-100/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                                
                                <div className="flex items-center">
                                    <input
                                        id="is-new-add"
                                        type="checkbox"
                                        checked={newProgramIsNew}
                                        onChange={e => setNewProgramIsNew(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                                    />
                                    <label htmlFor="is-new-add" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {t('markAsNew')}
                                    </label>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" disabled={isAddingProgram} className="bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all disabled:opacity-50">
                                        {isAddingProgram ? t('adding') : t('addApp')}
                                    </button>
                                </div>
                            </form>

                            {/* Program List */}
                            <div className="overflow-x-auto">
                            {loading.programs ? <p className="p-6 text-center">{t('loadingAppsAdmin')}</p> : error.programs ? <p className="p-6 text-center text-red-500">{error.programs}</p> :
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-100/70 dark:bg-slate-900/50 dark:text-slate-300">
                                        <tr>
                                            <th className="px-6 py-3">{t('icon')}</th>
                                            <th className="px-6 py-3">{t('name')}</th>
                                            <th className="px-6 py-3">{t('url')}</th>
                                            <th className="px-6 py-3 text-right">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programs.map(p => {
                                            const displayName = p.name?.[locale] || p.name?.en || '';
                                            const isPredefinedIcon = ICON_MAP.hasOwnProperty(p.icon);
                                            const IconComponent = isPredefinedIcon ? ICON_MAP[p.icon] : null;
                                            return (
                                            <tr key={p.id} className="border-b border-slate-200/80 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                                <td className="px-6 py-4">
                                                    <div className="w-6 h-6 text-cyan-500">
                                                        {IconComponent ? (
                                                            <IconComponent className="w-full h-full" />
                                                        ) : (
                                                            <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{__html: p.icon}} />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{displayName}</td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 truncate max-w-xs"><a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.url}</a></td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button 
                                                        onClick={() => handleEditClick(p)}
                                                        className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                        aria-label={t('editApp', {name: displayName})}
                                                    >
                                                        <EditIcon className="w-5 h-5"/>
                                                    </button>
                                                    <button 
                                                        onClick={() => openDeleteModal(p.id, 'program', displayName)}
                                                        className="p-2 rounded-md text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                        aria-label={t('deleteApp', {name: displayName})}
                                                    >
                                                        <TrashIcon className="w-5 h-5"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                                }
                            </div>
                        </div>
                    </section>

                    {/* Subscriber Management */}
                    <section>
                        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 flex justify-between items-center border-b border-slate-200/80 dark:border-slate-700/50">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t('subscribersList', {count: subscribers.length})}</h2>
                                <button onClick={fetchSubscribers} className="text-cyan-500 hover:text-cyan-600" title={t('refresh')}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${loading.subscribers ? 'animate-spin' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l-3.182-3.182m0 0a8.25 8.25 0 0111.664 0l3.182 3.182" /></svg></button>
                            </div>
                            {loading.subscribers ? <p className="p-6 text-center">{t('loadingSubscribers')}</p> : error.subscribers ? <p className="p-6 text-center text-red-500">{error.subscribers}</p> :
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-100/70 dark:bg-slate-900/50 dark:text-slate-300">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Email</th>
                                                <th scope="col" className="px-6 py-3">{t('dateSubscribed')}</th>
                                                <th scope="col" className="px-6 py-3 text-right">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscribers.map(sub => (
                                                <tr key={sub.id} className="border-b border-slate-200/80 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{sub.email}</td>
                                                    <td className="px-6 py-4">{new Date(sub.created_at).toLocaleString('pl-PL')}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => openDeleteModal(sub.id, 'subscriber', sub.email)}
                                                            className="p-2 rounded-md text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                            aria-label={t('deleteSubscriber', {email: sub.email})}
                                                        >
                                                            <TrashIcon className="w-5 h-5"/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {subscribers.length === 0 && (
                                                <tr><td colSpan={3} className="text-center py-8">{t('noSubscribers')}</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </section>
                    <p className="mt-8 text-center text-sm">
                        <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '/'; }} className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                            {t('backToHome')}
                        </a>
                    </p>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isConfirming={isConfirmingDelete}
                title={t('deleteConfirmationTitle')}
                message={itemToDelete?.type === 'program' 
                    ? t('deleteConfirmationMessageApp', {name: itemToDelete?.name || ''}) 
                    : t('deleteConfirmationMessageSubscriber', {name: itemToDelete?.name || ''})
                }
                intent="danger"
            />

            {programToEdit && (
                <EditProgramModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    program={programToEdit}
                    onSave={handleSaveProgram}
                />
            )}

            <ConfirmationModal
                isOpen={isSaveConfirmModalOpen}
                onClose={() => setIsSaveConfirmModalOpen(false)}
                onConfirm={handleConfirmSave}
                isConfirming={isConfirmingSave}
                title={t('saveConfirmationTitle')}
                message={t('saveConfirmationMessage', {name: pendingUpdate?.name[locale] || pendingUpdate?.name.en || ''})}
                intent="primary"
                confirmText={t('save')}
            />
        </>
    );
};

export default AdminPage;