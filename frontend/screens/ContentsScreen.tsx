import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen, Edit3 } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { getProfile } from '../services/user.service';

// Interface Subject
interface Subject {
    id: string;
    title: string;
    description?: string;
    code: string;
    icon: string;
    color: string;
    status: 'ACTIVE' | 'DRAFT';
    questionCount: number;
}

// Mapeamento de cores para classes TailwindCSS
const colorMap: Record<string, { gradient: string; shadow: string; hover: string }> = {
    blue: { gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20', hover: 'group-hover:text-blue-400' },
    purple: { gradient: 'from-purple-500 to-purple-400', shadow: 'shadow-purple-500/20', hover: 'group-hover:text-purple-400' },
    emerald: { gradient: 'from-emerald-500 to-emerald-400', shadow: 'shadow-emerald-500/20', hover: 'group-hover:text-emerald-400' },
    orange: { gradient: 'from-orange-500 to-orange-400', shadow: 'shadow-orange-500/20', hover: 'group-hover:text-orange-400' },
    pink: { gradient: 'from-pink-500 to-pink-400', shadow: 'shadow-pink-500/20', hover: 'group-hover:text-pink-400' },
    indigo: { gradient: 'from-indigo-500 to-indigo-400', shadow: 'shadow-indigo-500/20', hover: 'group-hover:text-indigo-400' },
    red: { gradient: 'from-red-500 to-red-400', shadow: 'shadow-red-500/20', hover: 'group-hover:text-red-400' },
    amber: { gradient: 'from-amber-500 to-amber-400', shadow: 'shadow-amber-500/20', hover: 'group-hover:text-amber-400' },
    teal: { gradient: 'from-teal-500 to-teal-400', shadow: 'shadow-teal-500/20', hover: 'group-hover:text-teal-400' },
};

// Mapeamento de ícones para componentes
const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
    book: BookOpen,
    // Adicione mais ícones conforme necessário
};

// Mock data para desenvolvimento (será substituído por API)
const mockSubjects: Subject[] = [
    {
        id: '1',
        title: 'Anatomia Humana',
        description: 'Estudo detalhado da estrutura do corpo humano e seus sistemas',
        code: 'MED101',
        icon: 'book',
        color: 'blue',
        status: 'ACTIVE',
        questionCount: 145,
    },
    {
        id: '2',
        title: 'Fisiologia',
        description: 'Funcionamento dos sistemas do corpo humano',
        code: 'MED102',
        icon: 'book',
        color: 'purple',
        status: 'ACTIVE',
        questionCount: 89,
    },
    {
        id: '3',
        title: 'Bioquímica',
        description: 'Processos químicos e reações nos organismos vivos',
        code: 'MED103',
        icon: 'book',
        color: 'emerald',
        status: 'ACTIVE',
        questionCount: 67,
    },
    {
        id: '4',
        title: 'Patologia',
        description: 'Estudo das doenças e suas causas',
        code: 'MED201',
        icon: 'book',
        color: 'orange',
        status: 'DRAFT',
        questionCount: 32,
    },
    {
        id: '5',
        title: 'Farmacologia',
        description: 'Estudo dos medicamentos e seus efeitos no organismo',
        code: 'MED202',
        icon: 'book',
        color: 'pink',
        status: 'ACTIVE',
        questionCount: 112,
    },
    {
        id: '6',
        title: 'Microbiologia',
        description: 'Estudo de microrganismos: bactérias, vírus, fungos e parasitas',
        code: 'MED203',
        icon: 'book',
        color: 'indigo',
        status: 'ACTIVE',
        questionCount: 78,
    },
];

// Componente SubjectCard
interface SubjectCardProps {
    subject: Subject;
    onEdit: (subject: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onEdit }) => {
    const colors = colorMap[subject.color] || colorMap.blue;
    const IconComponent = iconMap[subject.icon] || BookOpen;

    return (
        <div className="group bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 cursor-pointer">
            {/* Header com ícone e badge de status */}
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} ${colors.shadow} shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <IconComponent size={28} className="text-white" />
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${subject.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                    {subject.status === 'ACTIVE' ? 'Ativo' : 'Rascunho'}
                </span>
            </div>

            {/* Título e descrição */}
            <h3 className={`text-lg font-bold text-secondary dark:text-white mb-2 transition-colors ${colors.hover}`}>
                {subject.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                {subject.description || 'Sem descrição disponível'}
            </p>

            {/* Footer com contador e botão */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <BookOpen size={16} />
                        <span className="text-sm font-medium">{subject.questionCount} questões</span>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(subject);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-200"
                >
                    <Edit3 size={14} />
                    Editar Conteúdo
                </button>
            </div>
        </div>
    );
};

// Loading Skeleton para cards
const SubjectCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
    </div>
);

const ContentsScreen: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obter perfil do usuário para verificar role
                const userProfile = await getProfile();
                setUserRole(userProfile?.role || null);

                // TODO: Substituir pelo serviço real quando disponível
                // const subjectsData = await getSubjects();
                // setSubjects(subjectsData);

                // Mock delay para simular carregamento
                await new Promise(resolve => setTimeout(resolve, 800));
                setSubjects(mockSubjects);
            } catch (error) {
                console.error('Erro ao carregar conteúdos:', error);
                toast.error('Erro ao carregar conteúdos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtro de busca local
    const filteredSubjects = subjects.filter(subject => {
        const query = searchQuery.toLowerCase();
        return (
            subject.title.toLowerCase().includes(query) ||
            subject.description?.toLowerCase().includes(query) ||
            subject.code.toLowerCase().includes(query)
        );
    });

    // Handler para editar (placeholder)
    const handleEdit = (subject: Subject) => {
        // TODO: Implementar modal de edição em prompt futuro
        toast.success(`Editar: ${subject.title}`);
        console.log('Editar subject:', subject);
    };

    // Handler para novo assunto (placeholder)
    const handleNewSubject = () => {
        // TODO: Implementar modal de criação em prompt futuro
        toast.success('Criar novo assunto');
        console.log('Criar novo assunto');
    };

    // Verificar se usuário pode criar/editar conteúdos (ADMIN ou LEADER/professor)
    const canManageContents = userRole === 'ADMIN' || userRole === 'LEADER';

    // Loading State
    if (loading) {
        return (
            <div className="min-h-full bg-background-light dark:bg-background-dark relative">
                <div className="absolute inset-0 z-0 bg-network-pattern opacity-[0.03] pointer-events-none"></div>

                {/* Header Skeleton */}
                <header className="h-20 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-surface-light/80 dark:bg-surface-dark/80 glass-effect z-20">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </header>

                <div className="p-4 md:p-8 relative z-10">
                    {/* Search and Button Skeleton */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
                        <Skeleton className="h-11 w-full sm:w-80 rounded-xl" />
                        <Skeleton className="h-11 w-40 rounded-xl" />
                    </div>

                    {/* Cards Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SubjectCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-background-light dark:bg-background-dark relative">
            <div className="absolute inset-0 z-0 bg-network-pattern opacity-[0.03] pointer-events-none"></div>

            {/* Header */}
            <header className="h-20 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-surface-light/80 dark:bg-surface-dark/80 glass-effect z-20">
                <div>
                    <h1 className="text-2xl font-display font-bold text-secondary dark:text-white">
                        Gerenciar Conteúdos
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Organize assuntos e questões para estudos
                    </p>
                </div>
            </header>

            <div className="p-4 md:p-8 relative z-10">
                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
                    {/* Campo de busca */}
                    <div className="relative w-full sm:w-80">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar assunto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>

                    {/* Botão Novo Assunto (apenas para professores/admin) */}
                    {canManageContents && (
                        <button
                            onClick={handleNewSubject}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            <Plus size={20} />
                            Novo Assunto
                        </button>
                    )}
                </div>

                {/* Grid de Cards */}
                {filteredSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                        {filteredSubjects.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center mb-6">
                            <BookOpen size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                            {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum assunto cadastrado'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                            {searchQuery
                                ? `Não encontramos assuntos correspondentes a "${searchQuery}"`
                                : 'Comece criando seu primeiro assunto para organizar questões e conteúdos de estudo.'
                            }
                        </p>
                        {canManageContents && !searchQuery && (
                            <button
                                onClick={handleNewSubject}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <Plus size={20} />
                                Criar Primeiro Assunto
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentsScreen;
