import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Bone,
    Heart,
    Microscope,
    Brain,
    FlaskConical,
    Pill,
    Plus,
    Search,
    FileEdit,
    ShieldX,
    HelpCircle,
    Trash2,
    Pencil,
    X,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as subjectService from '../services/subject.service';
import type { Subject as ApiSubject } from '../services/subject.service';

// Icon mapping for subjects
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    Bone,
    Heart,
    Microscope,
    Brain,
    FlaskConical,
    Pill
};

// Style configurations for subjects
const styleConfigs: Record<string, { gradientFrom: string; gradientTo: string; shadowColor: string; iconBgColor: string }> = {
    blue: { gradientFrom: 'from-blue-500', gradientTo: 'to-cyan-400', shadowColor: 'shadow-blue-500/20', iconBgColor: 'text-primary' },
    rose: { gradientFrom: 'from-rose-500', gradientTo: 'to-rose-400', shadowColor: 'shadow-rose-500/20', iconBgColor: 'text-rose-400' },
    emerald: { gradientFrom: 'from-emerald-500', gradientTo: 'to-emerald-400', shadowColor: 'shadow-emerald-500/20', iconBgColor: 'text-emerald-400' },
    purple: { gradientFrom: 'from-purple-500', gradientTo: 'to-purple-400', shadowColor: 'shadow-purple-500/20', iconBgColor: 'text-purple-400' },
    orange: { gradientFrom: 'from-orange-500', gradientTo: 'to-orange-400', shadowColor: 'shadow-orange-500/20', iconBgColor: 'text-orange-400' },
    indigo: { gradientFrom: 'from-indigo-500', gradientTo: 'to-indigo-400', shadowColor: 'shadow-indigo-500/20', iconBgColor: 'text-indigo-400' }
};

// Available styles for creating new subjects
const availableStyles = [
    { icon: 'Bone', color: 'blue', label: 'Anatomia' },
    { icon: 'Heart', color: 'rose', label: 'Fisiologia' },
    { icon: 'Microscope', color: 'emerald', label: 'Histologia' },
    { icon: 'Brain', color: 'purple', label: 'Neurologia' },
    { icon: 'FlaskConical', color: 'orange', label: 'Bioquímica' },
    { icon: 'Pill', color: 'indigo', label: 'Farmacologia' }
];

// Delete Confirmation Modal
const DeleteConfirmModal = ({
    isOpen,
    subjectName,
    onConfirm,
    onCancel,
    isLoading
}: {
    isOpen: boolean;
    subjectName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}) => {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-md w-full p-6">
                <button onClick={onCancel} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-rose-500" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-secondary dark:text-white mb-2">
                        Excluir Conteúdo?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                        Tem certeza que deseja excluir <strong>"{subjectName}"</strong>? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button onClick={onCancel} disabled={isLoading} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold">
                            Cancelar
                        </button>
                        <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Edit Modal
const EditModal = ({
    isOpen,
    subject,
    onSave,
    onCancel,
    isLoading
}: {
    isOpen: boolean;
    subject: ApiSubject | null;
    onSave: (id: string, name: string, description: string, status: 'active' | 'draft') => void;
    onCancel: () => void;
    isLoading: boolean;
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'active' | 'draft'>('active');

    useEffect(() => {
        if (subject) {
            setName(subject.name);
            setDescription(subject.description);
            setStatus(subject.status);
        }
    }, [subject]);

    if (!isOpen || !subject) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && description.trim()) {
            onSave(subject.id, name.trim(), description.trim(), status);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-lg w-full p-6">
                <button onClick={onCancel} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Pencil size={18} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-secondary dark:text-white">Editar Conteúdo</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white resize-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setStatus('active')} className={`flex-1 py-3 rounded-xl border font-bold ${status === 'active' ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>Ativo</button>
                            <button type="button" onClick={() => setStatus('draft')} className={`flex-1 py-3 rounded-xl border font-bold ${status === 'draft' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>Rascunho</button>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onCancel} disabled={isLoading} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// Create Subject Modal
const CreateSubjectModal = ({
    isOpen,
    onSave,
    onCancel,
    isLoading
}: {
    isOpen: boolean;
    onSave: (name: string, description: string, status: 'active' | 'draft', icon: string, color: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'active' | 'draft'>('draft');
    const [selectedStyle, setSelectedStyle] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setStatus('draft');
            setSelectedStyle(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && description.trim()) {
            const style = availableStyles[selectedStyle];
            onSave(name.trim(), description.trim(), status, style.icon, style.color);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 overflow-y-auto max-h-[90vh]">
                    <button onClick={onCancel} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 z-10">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${styleConfigs[availableStyles[selectedStyle].color].gradientFrom} ${styleConfigs[availableStyles[selectedStyle].color].gradientTo} text-white flex items-center justify-center`}>
                            <Plus size={18} />
                        </div>
                        <h3 className="text-xl font-display font-bold text-secondary dark:text-white">Novo Conteúdo</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white" placeholder="Ex: Anatomia Humana" required autoFocus />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white resize-none" placeholder="Descreva o conteúdo..." required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ícone e Cor</label>
                            <div className="grid grid-cols-6 gap-2">
                                {availableStyles.map((style, index) => {
                                    const IconComponent = iconMap[style.icon];
                                    const config = styleConfigs[style.color];
                                    return (
                                        <button key={index} type="button" onClick={() => setSelectedStyle(index)} className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedStyle === index ? `bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} text-white shadow-lg scale-110` : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`} title={style.label}>
                                            <IconComponent size={20} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStatus('active')} className={`flex-1 py-3 rounded-xl border font-bold ${status === 'active' ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>Ativo</button>
                                <button type="button" onClick={() => setStatus('draft')} className={`flex-1 py-3 rounded-xl border font-bold ${status === 'draft' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>Rascunho</button>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onCancel} disabled={isLoading} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold">Cancelar</button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                                Criar Conteúdo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

const ContentManagementScreen = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isTeacher, setIsTeacher] = useState<boolean | null>(null);
    const [subjects, setSubjects] = useState<ApiSubject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; subject: ApiSubject | null }>({ isOpen: false, subject: null });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; subject: ApiSubject | null }>({ isOpen: false, subject: null });
    const [createModal, setCreateModal] = useState(false);

    // Check if user is a teacher and fetch subjects
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setIsTeacher(user.role === 'TEACHER' || user.role === 'ADMIN');
            } catch {
                setIsTeacher(false);
            }
        } else {
            setIsTeacher(false);
        }
    }, []);

    // Fetch subjects from API
    useEffect(() => {
        if (isTeacher === true) {
            fetchSubjects();
        } else if (isTeacher === false) {
            setIsLoading(false);
        }
    }, [isTeacher]);

    const fetchSubjects = async () => {
        try {
            setIsLoading(true);
            const data = await subjectService.getSubjects();
            setSubjects(data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            toast.error('Erro ao carregar conteúdos');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (subject: ApiSubject) => {
        setEditModal({ isOpen: true, subject });
    };

    const handleSaveEdit = async (id: string, name: string, description: string, status: 'active' | 'draft') => {
        try {
            setIsActionLoading(true);
            await subjectService.updateSubject(id, { name, description, status });
            await fetchSubjects();
            setEditModal({ isOpen: false, subject: null });
            toast.success('Conteúdo atualizado!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao atualizar');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteClick = (subject: ApiSubject) => {
        setDeleteModal({ isOpen: true, subject });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.subject) return;
        try {
            setIsActionLoading(true);
            await subjectService.deleteSubject(deleteModal.subject.id);
            await fetchSubjects();
            toast.success(`"${deleteModal.subject.name}" foi excluído!`);
            setDeleteModal({ isOpen: false, subject: null });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao excluir');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleCreateSubject = async (name: string, description: string, status: 'active' | 'draft', icon: string, color: string) => {
        try {
            setIsActionLoading(true);
            await subjectService.createSubject({ name, description, icon, color, status });
            await fetchSubjects();
            setCreateModal(false);
            toast.success(`"${name}" foi criado!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao criar');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Access denied screen
    if (isTeacher === false) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-6">
                    <ShieldX size={40} className="text-rose-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2">Acesso Negado</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">Esta área é restrita para professores.</p>
            </div>
        );
    }

    // Loading state
    if (isLoading || isTeacher === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto pb-20 md:pb-0">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-secondary dark:text-white mb-2">
                        Gerenciar Conteúdos
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Organize os assuntos e questões para os alunos.
                    </p>
                </div>
            </header>

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                        placeholder="Buscar por assunto..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => setCreateModal(true)} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} />
                    Novo Assunto
                </button>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {filteredSubjects.map((subject) => {
                    const IconComponent = iconMap[subject.icon] || Bone;
                    const config = styleConfigs[subject.color] || styleConfigs.blue;

                    return (
                        <div key={subject.id} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
                            {/* Header with Icon */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} text-white flex items-center justify-center shadow-lg ${config.shadowColor}`}>
                                    <IconComponent size={24} />
                                </div>
                                <button onClick={() => handleDeleteClick(subject)} className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" title="Excluir">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            {/* Clickable Name/Description */}
                            <div className="cursor-pointer" onClick={() => navigate(`/contents/${subject.id}`)}>
                                <h3 className={`text-xl font-display font-bold text-secondary dark:text-white mb-1 hover:text-primary transition-colors`}>
                                    {subject.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                    {subject.description}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 dark:bg-background-dark/50 rounded-xl border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2">
                                        <HelpCircle size={18} className={config.iconBgColor} />
                                        <span className="text-sm font-bold text-secondary dark:text-white">
                                            {subject.questionsCount} <span className="font-normal text-gray-500">Questões</span>
                                        </span>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${subject.status === 'active' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                                        {subject.status === 'active' ? 'Ativo' : 'Rascunho'}
                                    </span>
                                </div>
                                <button onClick={() => handleEdit(subject)} className="w-full py-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:text-secondary text-primary font-bold transition-all flex items-center justify-center gap-2">
                                    <FileEdit size={16} />
                                    Editar Conteúdo
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredSubjects.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">
                        {searchTerm ? 'Nenhum assunto encontrado' : 'Nenhum conteúdo cadastrado'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'Tente ajustar sua busca.' : 'Crie seu primeiro assunto.'}
                    </p>
                </div>
            )}

            {/* Modals */}
            <DeleteConfirmModal isOpen={deleteModal.isOpen} subjectName={deleteModal.subject?.name || ''} onConfirm={handleConfirmDelete} onCancel={() => setDeleteModal({ isOpen: false, subject: null })} isLoading={isActionLoading} />
            <EditModal isOpen={editModal.isOpen} subject={editModal.subject} onSave={handleSaveEdit} onCancel={() => setEditModal({ isOpen: false, subject: null })} isLoading={isActionLoading} />
            <CreateSubjectModal isOpen={createModal} onSave={handleCreateSubject} onCancel={() => setCreateModal(false)} isLoading={isActionLoading} />
        </div>
    );
};

export default ContentManagementScreen;
