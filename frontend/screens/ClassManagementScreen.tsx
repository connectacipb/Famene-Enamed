import React, { useState } from 'react';
import {
    Share2,
    Code,
    Network,
    PlusCircle,
    Trophy,
    AlertTriangle,
    Users,
    Star,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical
} from 'lucide-react';

// Mock data for classes
const mockClasses = [
    {
        id: 1,
        name: 'Engenharia de Software 2024.1',
        students: 42,
        avgPoints: 1250,
        progress: 75,
        status: 'active',
        icon: Code,
        color: 'primary'
    },
    {
        id: 2,
        name: 'Arquitetura de Sistemas 2023.2',
        students: 38,
        avgPoints: 980,
        progress: 60,
        status: 'active',
        icon: Network,
        color: 'orange'
    }
];

// Mock data for highlighted students
const topStudents = [
    { id: 1, name: 'Lucas Oliveira', points: 2450, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFKTZDd5Vbvq64yDqbRoAxuw-52We4dTzl9oxJ2oA5eFhB07gXcC2COYKyIN29twRHaInH-xU9tnaua17z8PabTX7VWNlAoQs-qreZqHTI13-7jMDsfqAZy3Izow82NlxJ8ntyMhZ9iWIR_XnWkEVK4WBqMkw0c-OOlXT9KZjDl3pm6E-m5gMk9O6SsTmL5C0hdw2qnYBb5ia5vukB4apgp_Ie9_7KJibL9S2-yAWp4ifR5wyGSZJeXDLG6mmJIn8l96ZI_BDg3PJn' },
    { id: 2, name: 'Ana Costa', points: 2210, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjPhORLUnq6tDebCA-E2p2CDrC_sQvi8VYFPkJ4AAE923JSN3Nrq15gRvvPkTDpF16iE3vfl3QWfCcs1ImVikerK9HpXcPCyqMrxcmHK89_qo8gVFUJTD60wfJS_s5z7At3_a32Q1dp17mPRu0BlWCXhy1rfofouN8ndjISjBngER_rQmepNB1BXtEwyzdh8N2Ae86NJDts8ez0KeHq1ucXrpSqNkF4enbhDTlKGAwxNVigd51RSLis2nJTvFiQEIPQnbiY5C54lKs' },
    { id: 3, name: 'Gabriel Lima', points: 1980, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2u09AzPcY-1atHzTtJOnFYx54peQOVml3GT6xpJ16i_PYeBFTG1hX0PHf43pum5WGTlVu9VuKY25-5ISSIpPTqSNhAD4b6NV6KUNPnTq7wgxsXOnpbBiTscgtDD79eNyOIhipNQNAOCygvmiLB5UMY_-yOsfpY-bkVdWYZa3raNl9u-crXGsDceVLAOk0hcPUp-mX_Ir-YxmXZzHluJtX1DziZpP2I3rqPGZNInSsDKk3cWiuC_uL66a8hFxSy15jNijg5Jx8oa7X' }
];

// Mock data for students needing help
const studentsNeedingHelp = [
    { id: 4, name: 'Julia Santos', status: 'Inativa 5 dias', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXfhAdnQSpAwclxuvN5dJYzPbYCvr-elZ73B2omcBBn3ekKCyhVUiDcMg468PRWi2C4qsg4FFAZfBZhlQStxzXhG7fklfuBO-CHT0-xZ8yvi2DbHz5Mgo95bMzdfWtmGlWbXlFEkRSfguYnGJyH2EbLeAb5oWANDqyKbZZPMhIAMbg2zOLqlXgnLO0Y_0XjODp9gJxbqc3BblX5E6nwWLofZcDooIFuRn2WWxmXjxoEwRIPdvsMfkJgDPS46zrMI6dAxViBi2gk89t' },
    { id: 5, name: 'Bruno Reis', status: 'Abaixo da média', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7v5TL2VMAk6fnXrxZ7QYkA8ieeUWxBLFfp6u36Vrk6nq3x8jwBkAioannjqRCAI1qeQpa4tvh6zoXZStmBRbiuJsRNnfCEFFZuoMK8D-7Q9PrrpvfBOQpvXOKdO8QuNOX7vT7jFwn4AYOH2dwwftYDkKlgvq_en2TjFbDFRpL5G33J30lVN5BjRPOmc1Ja6hFXwGLFAF-Z7JM3L_SYpWv3G5wmlet-iFSADMs37bHR4SwcEnNeX_TEs8S3TI_UfSSex3LHmpc8egE' }
];

// Mock data for student list
const allStudents = [
    { id: 1, name: 'Lucas Oliveira', email: 'lucas.o@email.com', class: 'Software Eng.', points: 2450, progress: 92, lastActivity: 'Há 15 min', isTop: true, isAtRisk: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcBrdze3LQ6a1jmV6kK5KWbxX5rJAbIpH9F4pc8zSMkJsryX4a1nQPQE1ZqVt0DNRPhydX3wkzxpTyzJmg8jVcRTUy0U630jcQCamRfL_i04Pkt1yqVSoWydBLmVqCEKYDfn4_xOLHiE_dtU2WncqEdiyUpSKCS16mWJaimRFHhFwb3LF_2aERLeNXr2ngUfYKrSnvs7hzmtKs1BBVOuqwUrnnJRJcSkLalqvxAI-AzSUffDb4hhx1W7noKH0oFwrp8sHMkljZ1nqP' },
    { id: 2, name: 'Ana Costa', email: 'ana.c@email.com', class: 'Software Eng.', points: 2210, progress: 85, lastActivity: 'Há 2 horas', isTop: true, isAtRisk: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMGxGVy3UNa_JUvCOuQjS28S_PJOOsmY2MUcXctiHKBq09lDsdzo7bXF-azScId1kxdliqLGCZZSOwzMs2RsAoTCguAw3VOYu92TPgias8iAtDEAXGwMcJRSMjia3hVtCcAOLNS-KiUIvnf2Yg7ixI4v2t6TP1Gic1tAJ-xIaB8Z-hjWaiXG29RO7NLcR8JQXstOdzkd9z-KKOmCrsOjcYb7IyEMkdVe6GVlJPBzpePz4uBwSEfrYREaiKzWBv66OJEKD02CRJhek_' },
    { id: 4, name: 'Julia Santos', email: 'j.santos@email.com', class: 'Systems Arch.', points: 450, progress: 28, lastActivity: 'Inativa há 5 dias', isTop: false, isAtRisk: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTWNApzswv9yGMXgaeZdAdpnXKzaWAxqKukIdisp3FXZ7kQnpg9woS6ZR9MD37hTLcASFTSa-SHQuKOPRRHtA5_zCyPscVzumHdk1y7v2Tz8FxxWyOiJ-i70XmKaE5OOPNwxnFmJCWu_NRJeFjQ4D40pY-X6HH5W3BTp4HZrb4MIJQvSsmzCUK1OgZ0G-KDOar-Ek4eM5qWa3WFJl2CyvMwyrfr9PI2zpo5xFCToDQBdWItb6QFY485kYPPnPWM3ZAe_d1_IZ5ukOz' },
    { id: 5, name: 'Bruno Reis', email: 'bruno.r@email.com', class: 'Systems Arch.', points: 1120, progress: 55, lastActivity: 'Há 1 dia', isTop: false, isAtRisk: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdZe4fwfGWw_WaEIfSYFVOTZpOB8u24dmhT9Bp-9WXOQ3kTj_BX_lCRv7j0w54SBK8rD8z3JuojwAEGE1qi1-yqnsTTEp08LHugjUmxHGu0eJSgK5fAzDjTh-vl8IuJ9a72Uf7-pKukR6mHfyfKWtPOxSh0n8E4OdldRzQvA8ArCjWtnAflPzH6-64Y8-uWESPJGls5qW4op0s2etgOQo2UDNeHKKpokuSGqdqThyNlu5z4jL1IL16hFJTjSsw8d7NyXYEVsSWBI92' }
];

const ClassManagementScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto pb-20 md:pb-0">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-secondary dark:text-white mb-2">
                        Gerenciamento de Turmas
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Acompanhe o desempenho, engajamento e a evolução gamificada de cada um dos seus alunos.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm">
                        <Share2 size={18} />
                        Exportar Relatório
                    </button>
                </div>
            </header>

            {/* Class Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockClasses.map((classItem) => {
                    const IconComponent = classItem.icon;
                    const colorClasses = classItem.color === 'primary'
                        ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                        : 'bg-orange-50 dark:bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white';
                    const progressColor = classItem.color === 'primary' ? 'bg-primary' : 'bg-orange-500';
                    const textColor = classItem.color === 'primary' ? 'text-primary' : 'text-orange-500';

                    return (
                        <div
                            key={classItem.id}
                            className="bg-white dark:bg-surface-dark p-6 rounded-xl flex flex-col group hover:shadow-lg border border-gray-100 dark:border-gray-800 transition-all cursor-pointer shadow-md"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${colorClasses}`}>
                                    <IconComponent size={24} />
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20">
                                    Ativa
                                </span>
                            </div>
                            <h3 className={`text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:${textColor} transition-colors`}>
                                {classItem.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">
                                <Users size={14} /> {classItem.students} Alunos
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <Star size={14} /> Média {classItem.avgPoints.toLocaleString()} pts
                            </div>
                            <div className="mt-auto">
                                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
                                    <span className="text-gray-400 dark:text-gray-500">Progresso Geral</span>
                                    <span className={textColor}>{classItem.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                                        style={{ width: `${classItem.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Class Card */}
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all cursor-pointer group">
                    <PlusCircle size={40} className="mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-bold">Nova Turma</p>
                </div>
            </section>

            {/* Highlights Section */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Top Students */}
                <div className="bg-secondary/5 dark:bg-secondary/10 border border-secondary/10 dark:border-secondary/20 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center shadow-sm">
                            <Trophy size={14} />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Alunos em Destaque</h4>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {topStudents.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center gap-3 bg-white dark:bg-surface-dark p-2.5 pr-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/30 transition-colors"
                            >
                                <img
                                    alt={student.name}
                                    className="w-9 h-9 rounded-full border-2 border-primary/10"
                                    src={student.avatar}
                                />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-800 dark:text-white">{student.name}</p>
                                    <p className="text-primary font-extrabold">{student.points.toLocaleString()} pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Students Needing Help */}
                <div className="bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-sm">
                            <AlertTriangle size={14} />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white uppercase text-xs tracking-widest">Precisam de Ajuda</h4>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {studentsNeedingHelp.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center gap-3 bg-white dark:bg-surface-dark p-2.5 pr-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:border-rose-200 dark:hover:border-rose-500/30 transition-colors"
                            >
                                <img
                                    alt={student.name}
                                    className="w-9 h-9 rounded-full border-2 border-rose-100 dark:border-rose-500/20"
                                    src={student.avatar}
                                />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-800 dark:text-white">{student.name}</p>
                                    <p className="text-rose-600 dark:text-rose-400 font-extrabold">{student.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Student Tracking Table */}
            <section className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden flex-1 flex flex-col min-h-0 shadow-md border border-gray-100 dark:border-gray-800">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Acompanhamento de Alunos</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-surface-dark rounded-xl pl-10 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-slate-800 dark:text-gray-100"
                                placeholder="Buscar aluno..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-2 rounded-xl bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-white dark:hover:bg-surface-dark transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm z-10 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Aluno</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hidden lg:table-cell">Turma</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Connecta Points</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hidden md:table-cell">Progresso de Conteúdo</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hidden sm:table-cell">Última Atividade</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {allStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    className={`hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors group ${student.isAtRisk ? 'bg-rose-50/30 dark:bg-rose-500/5 hover:bg-rose-50/50 dark:hover:bg-rose-500/10' : ''
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                alt={student.name}
                                                className={`w-10 h-10 rounded-full border ${student.isAtRisk
                                                        ? 'border-rose-200 dark:border-rose-500/30 ring-4 ring-rose-100/30 dark:ring-rose-500/10'
                                                        : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                                src={student.avatar}
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{student.name}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">{student.class}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-black text-base ${student.isAtRisk ? 'text-gray-400 dark:text-gray-500' : 'text-primary'}`}>
                                                {student.points.toLocaleString()}
                                            </span>
                                            <Star
                                                size={14}
                                                className={`${student.isTop ? 'text-amber-400 fill-amber-400' : student.isAtRisk ? 'text-gray-300 dark:text-gray-600' : 'text-amber-400 fill-amber-400'}`}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 min-w-[200px] hidden md:table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex-1 h-1.5 ${student.isAtRisk ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'} rounded-full overflow-hidden`}>
                                                <div
                                                    className={`h-full ${student.isAtRisk ? 'bg-rose-500' : 'bg-primary'} rounded-full`}
                                                    style={{ width: `${student.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-bold ${student.isAtRisk ? 'text-rose-600 dark:text-rose-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {student.progress}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-medium hidden sm:table-cell ${student.isAtRisk
                                            ? 'text-rose-500 dark:text-rose-400 font-bold'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {student.lastActivity}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className={`p-1 transition-colors ${student.isAtRisk
                                                ? 'text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400'
                                                : 'text-gray-300 dark:text-gray-600 hover:text-primary dark:hover:text-primary'
                                            }`}>
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500 dark:text-gray-400 font-bold">
                    <p className="uppercase tracking-tight">Exibindo 1-10 de 80 alunos</p>
                    <div className="flex items-center gap-1.5">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            <ChevronLeft size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white font-black shadow-sm shadow-primary/30">1</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors">2</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 transition-colors">3</button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClassManagementScreen;
