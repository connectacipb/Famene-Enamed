import api from './api';

export interface Subject {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    status: 'active' | 'draft';
    questionsCount: number;
    createdById: string;
    createdBy: {
        id: string;
        name: string;
        avatarColor?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    subjectId: string;
    createdById: string;
    createdBy: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SubjectWithQuestions extends Omit<Subject, 'questionsCount'> {
    questions: Question[];
}

export interface CreateSubjectData {
    name: string;
    description: string;
    icon?: string;
    color?: string;
    status?: 'active' | 'draft';
}

export interface CreateQuestionData {
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

// Subject CRUD
export const getSubjects = async (): Promise<Subject[]> => {
    const response = await api.get('/subjects');
    return response.data;
};

export const getSubjectById = async (id: string): Promise<SubjectWithQuestions> => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
};

export const createSubject = async (data: CreateSubjectData): Promise<Subject> => {
    const response = await api.post('/subjects', data);
    return response.data;
};

export const updateSubject = async (id: string, data: Partial<CreateSubjectData>): Promise<Subject> => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
};

export const deleteSubject = async (id: string): Promise<void> => {
    await api.delete(`/subjects/${id}`);
};

// Question CRUD
export const createQuestion = async (subjectId: string, data: CreateQuestionData): Promise<Question> => {
    const response = await api.post(`/subjects/${subjectId}/questions`, data);
    return response.data;
};

export const updateQuestion = async (
    subjectId: string,
    questionId: string,
    data: Partial<CreateQuestionData>
): Promise<Question> => {
    const response = await api.put(`/subjects/${subjectId}/questions/${questionId}`, data);
    return response.data;
};

export const deleteQuestion = async (subjectId: string, questionId: string): Promise<void> => {
    await api.delete(`/subjects/${subjectId}/questions/${questionId}`);
};
