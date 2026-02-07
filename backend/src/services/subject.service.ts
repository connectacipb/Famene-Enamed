import { Prisma, Subject, SubjectStatus } from '@prisma/client';
import prisma from '../utils/prisma';

interface CreateSubjectDTO {
    title: string;
    description?: string;
    code: string;
    icon: string;
    color: string;
    status?: SubjectStatus;
}

interface UpdateSubjectDTO {
    title?: string;
    description?: string;
    code?: string;
    icon?: string;
    color?: string;
    status?: SubjectStatus;
}

export const getAll = async (search?: string, status?: SubjectStatus) => {
    const where: Prisma.SubjectWhereInput = {};

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
        ];
    }

    return prisma.subject.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { questions: true },
            },
        },
    });
};

export const getById = async (id: string) => {
    const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                }
            },
            _count: {
                select: { questions: true }
            }
        }
    });

    if (!subject) {
        throw new Error('Subject not found');
    }

    return subject;
};

export const create = async (data: CreateSubjectDTO, userId: string) => {
    return prisma.subject.create({
        data: {
            ...data,
            createdById: userId,
        },
    });
};

export const update = async (id: string, data: UpdateSubjectDTO) => {
    const subject = await prisma.subject.findUnique({
        where: { id },
    });

    if (!subject) {
        throw new Error('Subject not found');
    }

    return prisma.subject.update({
        where: { id },
        data,
    });
};

export const deleteSubject = async (id: string) => {
    const subject = await prisma.subject.findUnique({
        where: { id },
    });

    if (!subject) {
        throw new Error('Subject not found');
    }

    return prisma.subject.delete({
        where: { id },
    });
};

export const getByUser = async (userId: string) => {
    return prisma.subject.findMany({
        where: { createdById: userId },
        orderBy: { createdAt: 'desc' },
    });
};
