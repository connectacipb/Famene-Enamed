import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Plus,
    Search,
    HelpCircle,
    Trash2,
    Pencil,
    X,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp,
    Bone,
    Heart,
    Microscope,
    Brain,
    FlaskConical,
    Pill,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as subjectService from '../services/subject.service';
import type { Question as ApiQuestion, SubjectWithQuestions } from '../services/subject.service';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = { Bone, Heart, Microscope, Brain, FlaskConical, Pill };

// Style configurations
const styleConfigs: Record<string, { gradientFrom: string; gradientTo: string }> = {
    blue: { gradientFrom: 'from-blue-500', gradientTo: 'to-cyan-400' },
    rose: { gradientFrom: 'from-rose-500', gradientTo: 'to-rose-400' },
    emerald: { gradientFrom: 'from-emerald-500', gradientTo: 'to-emerald-400' },
    purple: { gradientFrom: 'from-purple-500', gradientTo: 'to-purple-400' },
    orange: { gradientFrom: 'from-orange-500', gradientTo: 'to-orange-400' },
    indigo: { gradientFrom: 'from-indigo-500', gradientTo: 'to-indigo-400' }
};

// Difficulty badge colors
const difficultyColors = {
    EASY: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
    MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
    HARD: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
};

const difficultyLabels = { EASY: 'Fácil', MEDIUM: 'Médio', HARD: 'Difícil' };

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, isLoading }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void; isLoading: boolean }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-md w-full p-6">
                <button onClick={onCancel} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-rose-500" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-secondary dark:text-white mb-2">Excluir Questão?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Esta ação não pode ser desfeita.</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={onCancel} disabled={isLoading} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold">Cancelar</button>
                        <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Create Question Modal
const CreateQuestionModal = ({ isOpen, onSave, onCancel, isLoading }: { isOpen: boolean; onSave: (data: subjectService.CreateQuestionData) => void; onCancel: () => void; isLoading: boolean }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

    const MIN_OPTIONS = 2;
    const MAX_OPTIONS = 6;

    useEffect(() => {
        if (isOpen) { setQuestion(''); setOptions(['', '', '', '', '']); setCorrectAnswer(0); setDifficulty('MEDIUM'); }
    }, [isOpen]);

    if (!isOpen) return null;

    const addOption = () => {
        if (options.length < MAX_OPTIONS) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > MIN_OPTIONS) {
            const newOpts = options.filter((_, i) => i !== index);
            setOptions(newOpts);
            // Adjust correctAnswer if needed
            if (correctAnswer >= newOpts.length) {
                setCorrectAnswer(newOpts.length - 1);
            } else if (correctAnswer > index) {
                setCorrectAnswer(correctAnswer - 1);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim() && options.every(o => o.trim())) {
            onSave({ question: question.trim(), options: options.map(o => o.trim()), correctAnswer, difficulty });
        } else {
            toast.error('Preencha todos os campos');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 max-h-[90vh] overflow-y-auto">
                    <button onClick={onCancel} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 z-10">
                        <X size={20} />
                    </button>
                    <h3 className="text-xl font-display font-bold text-secondary dark:text-white mb-6">Nova Questão</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pergunta</label>
                            <textarea
                                value={question}
                                onChange={(e) => {
                                    setQuestion(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white resize-none min-h-[60px] overflow-hidden"
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Alternativas ({options.length})</label>
                                <div className="flex items-center gap-1">
                                    <button type="button" onClick={() => removeOption(options.length - 1)} disabled={options.length <= MIN_OPTIONS} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${options.length <= MIN_OPTIONS ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-500 hover:bg-rose-200'}`} title="Remover alternativa">
                                        −
                                    </button>
                                    <button type="button" onClick={addOption} disabled={options.length >= MAX_OPTIONS} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${options.length >= MAX_OPTIONS ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-green-100 dark:bg-green-500/20 text-green-500 hover:bg-green-200'}`} title="Adicionar alternativa">
                                        +
                                    </button>
                                </div>
                            </div>
                            {options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2 mb-2">
                                    <button type="button" onClick={() => setCorrectAnswer(i)} className={`w-8 h-8 rounded-lg font-bold text-sm shrink-0 ${correctAnswer === i ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                        {String.fromCharCode(65 + i)}
                                    </button>
                                    <input type="text" value={opt} onChange={(e) => { const newOpts = [...options]; newOpts[i] = e.target.value; setOptions(newOpts); }} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-darker text-secondary dark:text-white" placeholder={`Alternativa ${String.fromCharCode(65 + i)}`} required />
                                    {options.length > MIN_OPTIONS && (
                                        <button type="button" onClick={() => removeOption(i)} className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" title="Remover">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <p className="text-xs text-gray-500 mt-1">Clique na letra para marcar como correta • Min: {MIN_OPTIONS}, Max: {MAX_OPTIONS}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Dificuldade</label>
                            <div className="flex gap-2">
                                {(['EASY', 'MEDIUM', 'HARD'] as const).map((d) => (
                                    <button key={d} type="button" onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-xl font-bold text-sm ${difficulty === d ? difficultyColors[d] + ' border-2 border-current' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                        {difficultyLabels[d]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onCancel} disabled={isLoading} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold">Cancelar</button>
                            <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                                Criar Questão
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Question Card Component
const QuestionCard = ({ question, index, onDelete, onEdit }: { question: ApiQuestion; index: number; onDelete: () => void; onEdit: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const createdDate = new Date(question.createdAt).toLocaleDateString('pt-BR');

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-4 cursor-pointer flex items-start gap-4" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{index + 1}</div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary dark:text-white">{question.question}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${difficultyColors[question.difficulty]}`}>{difficultyLabels[question.difficulty]}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} />{createdDate}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10"><Pencil size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"><Trash2 size={18} /></button>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </div>
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 mt-4">Alternativas:</p>
                    <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                            <div key={optIndex} className={`flex items-center gap-3 p-3 rounded-xl ${optIndex === question.correctAnswer ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30' : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-700'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${optIndex === question.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{String.fromCharCode(65 + optIndex)}</div>
                                <span className={`flex-1 ${optIndex === question.correctAnswer ? 'text-green-700 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>{option}</span>
                                {optIndex === question.correctAnswer && <CheckCircle2 size={20} className="text-green-500" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ContentDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [subject, setSubject] = useState<SubjectWithQuestions | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; questionId: string | null }>({ isOpen: false, questionId: null });
    const [createModal, setCreateModal] = useState(false);

    useEffect(() => {
        if (id) fetchSubject();
    }, [id]);

    const fetchSubject = async () => {
        try {
            setIsLoading(true);
            const data = await subjectService.getSubjectById(id!);
            setSubject(data);
        } catch (error) {
            console.error('Error fetching subject:', error);
            toast.error('Erro ao carregar assunto');
            navigate('/contents');
        } finally {
            setIsLoading(false);
        }
    };

    const questions = subject?.questions || [];
    const filteredQuestions = questions.filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleDeleteClick = (questionId: string) => setDeleteModal({ isOpen: true, questionId });

    const handleConfirmDelete = async () => {
        if (!deleteModal.questionId || !subject) return;
        try {
            setIsActionLoading(true);
            await subjectService.deleteQuestion(subject.id, deleteModal.questionId);
            await fetchSubject();
            toast.success('Questão excluída!');
            setDeleteModal({ isOpen: false, questionId: null });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao excluir');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleCreateQuestion = async (data: subjectService.CreateQuestionData) => {
        if (!subject) return;
        try {
            setIsActionLoading(true);
            await subjectService.createQuestion(subject.id, data);
            await fetchSubject();
            setCreateModal(false);
            toast.success('Questão criada!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao criar');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleEditQuestion = (questionId: string) => {
        toast('Edição de questão em desenvolvimento', { icon: '🔧' });
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    }

    if (!subject) return null;

    const IconComponent = iconMap[subject.icon] || Bone;
    const config = styleConfigs[subject.color] || styleConfigs.blue;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto pb-20 md:pb-0">
            {/* Header */}
            <header className="flex flex-col gap-4">
                <button onClick={() => navigate('/contents')} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors w-fit">
                    <ArrowLeft size={20} />
                    <span className="font-medium">Voltar para Conteúdos</span>
                </button>
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} text-white flex items-center justify-center shadow-lg`}>
                        <IconComponent size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-secondary dark:text-white">{subject.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{questions.length} questões cadastradas</p>
                    </div>
                </div>
            </header>

            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-sm focus:border-primary dark:text-white shadow-sm" placeholder="Buscar questão..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => setCreateModal(true)} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                    <Plus size={20} />
                    Nova Questão
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-4 border border-green-100 dark:border-green-500/20">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{questions.filter(q => q.difficulty === 'EASY').length}</p>
                    <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">Fáceis</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-xl p-4 border border-yellow-100 dark:border-yellow-500/20">
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{questions.filter(q => q.difficulty === 'MEDIUM').length}</p>
                    <p className="text-sm text-yellow-600/70 dark:text-yellow-400/70 font-medium">Médias</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-500/10 rounded-xl p-4 border border-rose-100 dark:border-rose-500/20">
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{questions.filter(q => q.difficulty === 'HARD').length}</p>
                    <p className="text-sm text-rose-600/70 dark:text-rose-400/70 font-medium">Difíceis</p>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                    <QuestionCard key={question.id} question={question} index={index} onDelete={() => handleDeleteClick(question.id)} onEdit={() => handleEditQuestion(question.id)} />
                ))}
            </div>

            {/* Empty State */}
            {filteredQuestions.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">{searchTerm ? 'Nenhuma questão encontrada' : 'Nenhuma questão cadastrada'}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{searchTerm ? 'Tente ajustar sua busca.' : 'Adicione a primeira questão.'}</p>
                </div>
            )}

            {/* Modals */}
            <DeleteConfirmModal isOpen={deleteModal.isOpen} onConfirm={handleConfirmDelete} onCancel={() => setDeleteModal({ isOpen: false, questionId: null })} isLoading={isActionLoading} />
            <CreateQuestionModal isOpen={createModal} onSave={handleCreateQuestion} onCancel={() => setCreateModal(false)} isLoading={isActionLoading} />
        </div>
    );
};

export default ContentDetailScreen;
