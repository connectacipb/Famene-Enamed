import api from './api';

export interface Subject {
    id: string;
    title: string;
    description?: string;
    code: string;
    icon: string;
    color: string;
    status: 'ACTIVE' | 'DRAFT';
    questionCount: number;
    createdBy?: { id: string; name: string };
}

export interface CreateSubjectDTO {
    title: string;
    description?: string;
    code: string;
    icon: string;
    color: string;
    status?: 'ACTIVE' | 'DRAFT';
}

export const getSubjects = async (search?: string): Promise<Subject[]> => {
    const params = search ? { search } : {};
    const { data } = await api.get('/subjects', { params });
    return data;
};

export const getSubjectById = async (id: string): Promise<Subject> => {
    const { data } = await api.get(`/subjects/${id}`);
    return data;
};

export const createSubject = async (dto: CreateSubjectDTO): Promise<Subject> => {
    const { data } = await api.post('/subjects', dto);
    return data;
};

export const updateSubject = async (id: string, dto: Partial<CreateSubjectDTO>): Promise<Subject> => {
    const { data } = await api.put(`/subjects/${id}`, dto);
    return data;
};

export const deleteSubject = async (id: string): Promise<void> => {
    await api.delete(`/subjects/${id}`);
};
