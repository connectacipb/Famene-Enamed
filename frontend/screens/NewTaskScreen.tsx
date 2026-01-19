import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Calendar, User, AlignLeft, Folder, ArrowLeft, Check, Clock, Zap, BarChart3, AlertCircle, X, MoreVertical, ChevronDown, ChevronUp, Tag, Paperclip, CheckSquare, Users, Image } from 'lucide-react';
import { createTask, getTask, updateTask } from '../services/task.service';
import { useProjects } from '../hooks/useProjects';
import { getAllUsers } from '../services/user.service';
import { getProjectDetails } from '../services/project.service';
import { useAuth } from '../hooks/useAuth';
import MemberSelect from '../components/MemberSelect';

const NewTaskScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { user } = useAuth();
  const { projects, loading: loadingProjects } = useProjects();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [taskLevel, setTaskLevel] = useState<'basic' | 'medium' | 'large'>('medium');
  const [points, setPoints] = useState(150);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(location.state?.projectId || '');
  const [assignedToId, setAssignedToId] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mobile collapsible sections
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  // Check if mobile viewport
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchContextData = async () => {
      setLoadingUsers(true);
      try {
        if (projectId) {
            const projectData = await getProjectDetails(projectId);
            if (projectData.members) {
                 setUsers(projectData.members.map((m: any) => m.user || m));
            } else {
                 const allUsers = await getAllUsers();
                 setUsers(allUsers);
            }
        } else {
            const data = await getAllUsers();
            setUsers(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch context data", err);
        try {
            const data = await getAllUsers();
            setUsers(data || []);
        } catch(e) { console.error(e) }
      } finally {
        setLoadingUsers(false);
      }
    };
    
    if (projectId || !projectId) {
        fetchContextData();
    }
  }, [projectId]);

  useEffect(() => {
    if (isEditing && id) {
      const fetchTask = async () => {
        try {
          const task = await getTask(id);
          setTitle(task.title);
          setDescription(task.description || '');
          setProjectId(task.projectId);
          setAssignedToId(task.assignedToId || '');
          if (task.difficulty === 1) setTaskLevel('basic');
          else if (task.difficulty === 2) setTaskLevel('medium');
          else setTaskLevel('large');

          if (task.estimatedTimeMinutes) {
            setEstimatedTime((task.estimatedTimeMinutes / 60).toString());
          }
          if (task.dueDate) {
            setDeadline(task.dueDate.split('T')[0]);
          }
        } catch (err) {
          console.error(err);
          setError("Erro ao carregar dados da tarefa.");
        }
      };
      fetchTask();
    }
  }, [id, isEditing]);

  useEffect(() => {
    switch (taskLevel) {
      case 'basic': setPoints(50); break;
      case 'medium': setPoints(100); break;
      case 'large': setPoints(200); break;
    }
  }, [taskLevel]);

  const mapLevelToDifficulty = (level: string) => {
    switch (level) {
      case 'basic': return 1;
      case 'medium': return 2;
      case 'large': return 3;
      default: return 2;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (submitting) return;
    setSubmitting(true);

    if (!title || !projectId) {
      setError("Título e Projeto são obrigatórios.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        title,
        description,
        projectId,
        assignedToId: assignedToId || undefined,
        difficulty: mapLevelToDifficulty(taskLevel),
        estimatedTimeMinutes: estimatedTime ? parseInt(estimatedTime) * 60 : undefined,
        dueDate: deadline ? new Date(deadline).toISOString() : undefined,
        isExternalDemand: false
      };

      if (isEditing && id) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }

      navigate(-1);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao salvar tarefa. Verifique os dados.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newValue = description.substring(0, start) + "\t" + description.substring(end);
      setDescription(newValue);
      
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);
    }
  };

  // Get selected project name
  const selectedProject = projects.find((p: any) => p.id === projectId);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-background-dark border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h1 className="text-lg font-bold text-white flex-1 text-center">
            {isEditing ? 'Editar Tarefa' : title || 'Nova Tarefa'}
          </h1>
          <button className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Cover Image Placeholder */}
          <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Image size={24} className="text-white/50" />
              </div>
            </div>
            <button className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-sm text-white/80 border border-white/20">
              <Image size={14} /> Capa
            </button>
          </div>

          {/* Title Input */}
          <div className="px-4 py-4 border-b border-gray-800">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex-shrink-0 mt-1" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da tarefa..."
                className="flex-1 bg-transparent text-xl font-semibold text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Project Selection */}
          {!location.state?.projectId && (
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Folder size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {selectedProject?.title || 'Selecionar Projeto'}
                  </p>
                  <p className="text-gray-500 text-xs">Produção</p>
                </div>
              </div>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-transparent text-primary text-sm font-medium cursor-pointer focus:outline-none"
              >
                <option value="" className="bg-gray-900">Mover</option>
                {projects.map((project: any) => (
                  <option key={project.id} value={project.id} className="bg-gray-900">
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Actions Section */}
          <div className="border-b border-gray-800">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="w-full px-4 py-3 flex items-center justify-between text-gray-400"
            >
              <span className="text-sm font-medium">Ações rápidas</span>
              {showQuickActions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showQuickActions && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-medium text-sm"
                >
                  <CheckSquare size={18} /> Adicionar descrição
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium text-sm">
                  <Paperclip size={18} /> Adicionar anexo
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium text-sm">
                  <Users size={18} /> Membros
                </button>
              </div>
            )}
          </div>

          {/* Description (Collapsible) */}
          {showDescription && (
            <div className="px-4 py-4 border-b border-gray-800">
              <div className="flex items-start gap-3">
                <AlignLeft size={20} className="text-gray-500 flex-shrink-0 mt-1" />
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Adicionar descrição..."
                  className="flex-1 bg-gray-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Fields List */}
          <div className="divide-y divide-gray-800">
            {/* Etiquetas/Tags */}
            <div className="px-4 py-4 flex items-center gap-4">
              <Tag size={20} className="text-gray-500" />
              <span className="text-gray-400 text-sm flex-1">Etiquetas</span>
            </div>

            {/* Responsável/Assignee */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-4 mb-2">
                <User size={20} className="text-gray-500" />
                <span className="text-gray-400 text-sm flex-1">Responsável</span>
              </div>
              <div className="ml-9">
                <MemberSelect
                  members={users}
                  selectedId={assignedToId}
                  onChange={setAssignedToId}
                  loading={loadingUsers}
                  placeholder="Atribuir a..."
                  allowUnassigned={true}
                  unassignedLabel="Sem responsável"
                />
              </div>
            </div>

            {/* Data de início */}
            <div className="px-4 py-4 flex items-center gap-4">
              <Clock size={20} className="text-gray-500" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm block mb-1">Data de início</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Data de entrega */}
            <div className="px-4 py-4 flex items-center gap-4">
              <Calendar size={20} className="text-gray-500" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm block mb-1">Data de entrega</span>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-transparent text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Tempo Estimado */}
            <div className="px-4 py-4 flex items-center gap-4">
              <Clock size={20} className="text-gray-500" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm block mb-1">Tempo estimado (horas)</span>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="Ex: 4"
                  className="bg-transparent text-white text-sm focus:outline-none placeholder-gray-600"
                />
              </div>
            </div>

            {/* Nível da Tarefa */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-4 mb-3">
                <BarChart3 size={20} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Nível da Tarefa</span>
              </div>
              <div className="grid grid-cols-3 gap-2 ml-9">
                {[
                  { id: 'basic', label: 'Básica', pts: 50, color: 'emerald' },
                  { id: 'medium', label: 'Média', pts: 100, color: 'amber' },
                  { id: 'large', label: 'Grande', pts: 200, color: 'red' }
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setTaskLevel(level.id as any)}
                    className={`py-2.5 px-2 rounded-xl text-center transition-all ${
                      taskLevel === level.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-xs font-medium mb-0.5">{level.label}</div>
                    <div className="text-xs opacity-80">{level.pts} 🪙</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Anexos */}
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Paperclip size={20} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Anexos</span>
              </div>
              <button className="text-primary">
                <span className="text-xl">+</span>
              </button>
            </div>

            {/* Checklists */}
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckSquare size={20} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Checklists</span>
              </div>
              <button className="text-primary">
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-4 my-4 p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background-dark border-t border-gray-800 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-gray-400 text-sm">Adicionar comentário</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || !title || !projectId}
            className="p-3 bg-primary rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Clock size={20} className="animate-spin" /> : <Check size={20} />}
          </button>
        </div>
      </div>
    );
  }

  // Desktop Layout (Original)
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary mb-6 transition-colors text-sm font-bold"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-display font-extrabold text-secondary dark:text-white mb-2">
              {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Defina as atividades e metas para sua equipe. Tarefas bem definidas geram mais engajamento.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">

              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span> Título da Tarefa
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-secondary dark:text-white placeholder-gray-400"
                  placeholder="Ex: Implementar autenticação via Google"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <AlignLeft size={16} className="text-primary" /> Descrição e Requisitos
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-secondary dark:text-white placeholder-gray-400 resize-none"
                  placeholder="Descreva o que precisa ser feito, critérios de aceitação e recursos necessários..."
                />
              </div>

              {/* Project Select - Only if not pre-selected via context */}
              {!location.state?.projectId && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Folder size={16} className="text-primary" /> Projeto
                    </label>
                    {loadingProjects ? (
                      <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ) : (
                      <select
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-secondary dark:text-white cursor-pointer appearance-none"
                      >
                        <option value="" disabled>Selecione um projeto</option>
                        {projects.map((project: any) => (
                          <option key={project.id} value={project.id}>{project.title}</option>
                        ))}
                      </select>
                    )}
                  </div>
              )}

              {/* Assignee Select */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User size={16} className="text-primary" /> Responsável
                </label>
                <MemberSelect
                  members={users}
                  selectedId={assignedToId}
                  onChange={setAssignedToId}
                  loading={loadingUsers}
                  placeholder="Atribuir a..."
                  allowUnassigned={true}
                  unassignedLabel="Sem responsável"
                />
              </div>

              {/* Task Level & Points */}
              <div className="bg-sky-50 dark:bg-sky-900/10 rounded-xl p-4 border border-sky-100 dark:border-sky-900/30">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <BarChart3 size={16} className="text-primary" /> Nível da Tarefa
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    { id: 'basic', label: 'Básica', pts: 50 },
                    { id: 'medium', label: 'Média', pts: 100 },
                    { id: 'large', label: 'Grande', pts: 200 }
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setTaskLevel(level.id as any)}
                      className={`relative overflow-hidden py-3 px-2 rounded-lg border-2 transition-all text-center ${taskLevel === level.id
                        ? 'border-primary bg-white dark:bg-surface-dark shadow-md'
                        : 'border-transparent bg-white/50 dark:bg-white/5 text-gray-500 hover:bg-white hover:shadow-sm'
                        }`}
                    >
                      <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">{level.label}</div>
                      <div className={`text-lg font-black ${taskLevel === level.id ? 'text-primary' : 'text-gray-400'}`}>
                        {level.pts} 🪙
                      </div>
                      {taskLevel === level.id && (
                        <div className="absolute top-0 right-0 p-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> Tempo Estimado (horas)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-secondary dark:text-white placeholder-gray-400"
                    placeholder="Ex: 4"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-primary" /> Prazo de Entrega
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-secondary dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Clock size={20} className="animate-spin" /> : <Check size={20} />}
                {submitting ? 'Salvando...' : (isEditing ? 'Salvar' : 'Criar')}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="hidden lg:block w-80 space-y-6">
          <div className="bg-sky-50 dark:bg-sky-900/10 rounded-2xl p-6 border border-sky-100 dark:border-sky-900/30">
            <h3 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 mb-3">
              <AlertCircle size={18} /> Permissões
            </h3>
            <p className="text-sm text-sky-700 dark:text-sky-400 leading-relaxed mb-4">
              Todos os membros do projeto podem criar e editar tarefas. Colabore com sua equipe!
            </p>
            <div className="h-px bg-sky-200 dark:bg-sky-800 my-4"></div>
            <p className="text-xs text-sky-600 dark:text-sky-500 font-semibold">
              Dica: Divida tarefas grandes (Nível 3) em tarefas menores para facilitar o acompanhamento no Kanban.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskScreen;