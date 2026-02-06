import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calculator,
    BookOpen,
    Microscope,
    BookText,
    FlaskConical,
    Globe,
    Plus,
    Search,
    MoreVertical,
    FileEdit,
    ShieldX,
    HelpCircle,
    Trash2,
    Pencil,
    X,
    AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Type for subject
interface Subject {
    id: number;
    name: string;
    description: string;
    questionsCount: number;
    status: 'active' | 'draft';
    icon: React.ComponentType<{ size?: number }>;
    gradientFrom: string;
    gradientTo: string;
    shadowColor: string;
    iconBgColor: string;
}

// Initial mock data for subject cards
const initialMockSubjects: Subject[] = [
    {
        id: 1,
        name: 'Matemática Básica',
        description: 'Álgebra, aritmética e fundamentos matemáticos para iniciantes.',
        questionsCount: 45,
        status: 'active',
        icon: Calculator,
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-cyan-400',
        shadowColor: 'shadow-blue-500/20',
        iconBgColor: 'text-primary'
    },
    {
        id: 2,
        name: 'História do Brasil',
        description: 'Do período colonial à república contemporânea.',
        questionsCount: 32,
        status: 'active',
        icon: BookOpen,
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-purple-400',
        shadowColor: 'shadow-purple-500/20',
        iconBgColor: 'text-purple-400'
    },
    {
        id: 3,
        name: 'Biologia Celular',
        description: 'Estrutura e funcionamento das células, DNA e genética.',
        questionsCount: 50,
        status: 'draft',
        icon: Microscope,
        gradientFrom: 'from-emerald-500',
        gradientTo: 'to-emerald-400',
        shadowColor: 'shadow-emerald-500/20',
        iconBgColor: 'text-emerald-400'
    },
    {
        id: 4,
        name: 'Literatura Portuguesa',
        description: 'Romantismo, Realismo e Modernismo na literatura.',
        questionsCount: 28,
        status: 'active',
        icon: BookText,
        gradientFrom: 'from-orange-500',
        gradientTo: 'to-orange-400',
        shadowColor: 'shadow-orange-500/20',
        iconBgColor: 'text-orange-400'
    },
    {
        id: 5,
        name: 'Química Orgânica',
        description: 'Introdução às cadeias carbônicas e reações.',
        questionsCount: 15,
        status: 'draft',
        icon: FlaskConical,
        gradientFrom: 'from-pink-500',
        gradientTo: 'to-pink-400',
        shadowColor: 'shadow-pink-500/20',
        iconBgColor: 'text-pink-400'
    },
    {
        id: 6,
        name: 'Geografia Política',
        description: 'Geopolítica mundial, conflitos e fronteiras.',
        questionsCount: 30,
        status: 'active',
        icon: Globe,
        gradientFrom: 'from-indigo-500',
        gradientTo: 'to-indigo-400',
        shadowColor: 'shadow-indigo-500/20',
        iconBgColor: 'text-indigo-400'
    }
];

// Dropdown Menu Component
const DropdownMenu = ({
    isOpen,
    onClose,
    onEdit,
    onDelete
}: {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <button
                onClick={onEdit}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
            >
                <Pencil size={16} className="text-primary" />
                Editar
            </button>
            <button
                onClick={onDelete}
                className="w-full px-4 py-3 text-left text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
            >
                <Trash2 size={16} />
                Excluir
            </button>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({
    isOpen,
    subjectName,
    onConfirm,
    onCancel
}: {
    isOpen: boolean;
    subjectName: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in duration-200">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={28} className="text-rose-500" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold text-secondary dark:text-white text-center mb-2">
                    Excluir Conteúdo?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                    Tem certeza que deseja excluir <strong className="text-secondary dark:text-white">"{subjectName}"</strong>?
                    Esta ação não pode ser desfeita e todas as questões associadas serão removidas.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors shadow-lg shadow-rose-500/30"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit Modal Component
const EditModal = ({
    isOpen,
    subject,
    onSave,
    onCancel
}: {
    isOpen: boolean;
    subject: Subject | null;
    onSave: (id: number, name: string, description: string, status: 'active' | 'draft') => void;
    onCancel: () => void;
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 fade-in duration-200">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.gradientFrom} ${subject.gradientTo} text-white flex items-center justify-center`}>
                        <Pencil size={18} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-secondary dark:text-white">
                        Editar Conteúdo
                    </h3>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Nome do Assunto
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white focus:border-primary focus:ring-primary transition-all"
                            placeholder="Ex: Matemática Básica"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Descrição
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white focus:border-primary focus:ring-primary transition-all resize-none"
                            placeholder="Descreva o conteúdo..."
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Status
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStatus('active')}
                                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${status === 'active'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                Ativo
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus('draft')}
                                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${status === 'draft'
                                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                Rascunho
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold transition-colors shadow-lg shadow-primary/30"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContentManagementScreen = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isTeacher, setIsTeacher] = useState<boolean | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>(initialMockSubjects);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; subject: Subject | null }>({
        isOpen: false,
        subject: null
    });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; subject: Subject | null }>({
        isOpen: false,
        subject: null
    });

    // Check if user is a teacher
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'TEACHER') {
                    setIsTeacher(true);
                } else {
                    setIsTeacher(false);
                }
            } catch {
                setIsTeacher(false);
            }
        } else {
            setIsTeacher(false);
        }
    }, []);

    // Filter subjects based on search term
    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle edit
    const handleEdit = (subject: Subject) => {
        setOpenMenuId(null);
        setEditModal({ isOpen: true, subject });
    };

    // Handle save edit
    const handleSaveEdit = (id: number, name: string, description: string, status: 'active' | 'draft') => {
        setSubjects(prev => prev.map(s =>
            s.id === id ? { ...s, name, description, status } : s
        ));
        setEditModal({ isOpen: false, subject: null });
        toast.success('Conteúdo atualizado com sucesso!');
    };

    // Handle delete click
    const handleDeleteClick = (subject: Subject) => {
        setOpenMenuId(null);
        setDeleteModal({ isOpen: true, subject });
    };

    // Handle confirm delete
    const handleConfirmDelete = () => {
        if (deleteModal.subject) {
            setSubjects(prev => prev.filter(s => s.id !== deleteModal.subject!.id));
            toast.success(`"${deleteModal.subject.name}" foi excluído com sucesso!`);
        }
        setDeleteModal({ isOpen: false, subject: null });
    };

    // Show access denied screen for non-teachers
    if (isTeacher === false) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-6">
                    <ShieldX size={40} className="text-rose-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2">
                    Acesso Restrito
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Esta área é exclusiva para professores. Apenas usuários com conta de professor podem gerenciar conteúdos.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    // Loading state
    if (isTeacher === null) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-gray-400">Carregando...</div>
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Buscar por assunto ou código..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                    <Plus size={20} />
                    Novo Assunto
                </button>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {filteredSubjects.map((subject) => {
                    const IconComponent = subject.icon;

                    return (
                        <div
                            key={subject.id}
                            className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 transition-all group relative overflow-hidden flex flex-col"
                        >
                            {/* Header with Icon and Menu */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.gradientFrom} ${subject.gradientTo} text-white flex items-center justify-center shadow-lg ${subject.shadowColor}`}>
                                    <IconComponent size={24} />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === subject.id ? null : subject.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    <DropdownMenu
                                        isOpen={openMenuId === subject.id}
                                        onClose={() => setOpenMenuId(null)}
                                        onEdit={() => handleEdit(subject)}
                                        onDelete={() => handleDeleteClick(subject)}
                                    />
                                </div>
                            </div>

                            {/* Subject Name */}
                            <h3 className={`text-xl font-display font-bold text-secondary dark:text-white mb-1 group-hover:${subject.iconBgColor} transition-colors`}>
                                {subject.name}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                {subject.description}
                            </p>

                            {/* Footer */}
                            <div className="mt-auto">
                                {/* Stats Bar */}
                                <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 dark:bg-background-dark/50 rounded-xl border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2">
                                        <HelpCircle size={18} className={subject.iconBgColor} />
                                        <span className="text-sm font-bold text-secondary dark:text-white">
                                            {subject.questionsCount} <span className="font-normal text-gray-500">Questões</span>
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${subject.status === 'active'
                                        ? 'text-green-500 bg-green-500/10'
                                        : 'text-yellow-500 bg-yellow-500/10'
                                        }`}>
                                        {subject.status === 'active' ? 'Ativo' : 'Rascunho'}
                                    </span>
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEdit(subject)}
                                    className="w-full py-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:text-secondary text-primary font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <FileEdit size={16} />
                                    Editar Conteúdo
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredSubjects.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">
                        Nenhum assunto encontrado
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Tente ajustar sua busca ou crie um novo assunto.
                    </p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                subjectName={deleteModal.subject?.name || ''}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, subject: null })}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={editModal.isOpen}
                subject={editModal.subject}
                onSave={handleSaveEdit}
                onCancel={() => setEditModal({ isOpen: false, subject: null })}
            />
        </div>
    );
};

export default ContentManagementScreen;
