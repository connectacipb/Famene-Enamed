import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { QuestionDifficulty } from '@prisma/client';

// Get all subjects with question count
export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: {
                    select: { id: true, name: true, avatarColor: true }
                },
                _count: {
                    select: { questions: true }
                }
            }
        });

        const formattedSubjects = subjects.map(subject => ({
            ...subject,
            questionsCount: subject._count.questions,
            _count: undefined
        }));

        res.json(formattedSubjects);
import * as subjectService from '../services/subject.service';
import { SubjectStatus, Role } from '@prisma/client';

export const getAllSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query;
        const userRole = req.user?.role;

        let statusFilter: SubjectStatus | undefined;

        // ADMIN/LEADER see all (undefined filter), MEMBER sees only ACTIVE
        if (userRole !== Role.ADMIN && userRole !== Role.LEADER) {
            statusFilter = SubjectStatus.ACTIVE;
        }

        const subjects = await subjectService.getAll(search as string, statusFilter);
        res.status(200).json(subjects);
    } catch (error) {
        next(error);
    }
};

// Get subject by ID with its questions
export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const subject = await prisma.subject.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { id: true, name: true, avatarColor: true }
                },
                questions: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        createdBy: {
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        });

        if (!subject) {
            return res.status(404).json({ message: 'Assunto não encontrado.' });
        }

        res.json(subject);
export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const subject = await subjectService.getById(id);
        res.status(200).json(subject);
    } catch (error) {
        next(error);
    }
};

// Create a new subject (teacher only)
export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, icon, color, status } = req.body;
        const userId = (req as any).user?.userId;
        const userRole = (req as any).user?.role;

        // Only teachers can create subjects
        if (userRole !== 'TEACHER' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Apenas professores podem criar assuntos.' });
        }

        if (!name || !description) {
            return res.status(400).json({ message: 'Nome e descrição são obrigatórios.' });
        }

        const subject = await prisma.subject.create({
            data: {
                name,
                description,
                icon: icon || 'Bone',
                color: color || 'blue',
                status: status || 'draft',
                createdById: userId
            },
            include: {
                createdBy: {
                    select: { id: true, name: true, avatarColor: true }
                }
            }
        });

        res.status(201).json(subject);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Já existe um assunto com esse nome.' });
        }
export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = req.user?.role;

        if (userRole !== Role.ADMIN && userRole !== Role.LEADER) {
            return res.status(403).json({ message: 'Insufficient permissions. Requires ADMIN or LEADER role.' });
        }

        const { title, description, code, icon, color, status } = req.body;
        const userId = req.user!.userId;

        const newSubject = await subjectService.create({
            title,
            description,
            code,
            icon,
            color,
            status
        }, userId);

        res.status(201).json(newSubject);
    } catch (error) {
        next(error);
    }
};

// Update subject
export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, description, icon, color, status } = req.body;
        const userId = (req as any).user?.userId;
        const userRole = (req as any).user?.role;

        const subject = await prisma.subject.findUnique({
            where: { id }
        });

        if (!subject) {
            return res.status(404).json({ message: 'Assunto não encontrado.' });
        }

        // Only creator or admin can update
        if (subject.createdById !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Você não tem permissão para editar este assunto.' });
        }

        const updatedSubject = await prisma.subject.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(icon && { icon }),
                ...(color && { color }),
                ...(status && { status })
            },
            include: {
                createdBy: {
                    select: { id: true, name: true, avatarColor: true }
                },
                _count: {
                    select: { questions: true }
                }
            }
        });

        res.json({
            ...updatedSubject,
            questionsCount: updatedSubject._count.questions,
            _count: undefined
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Já existe um assunto com esse nome.' });
        }
export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description, code, icon, color, status } = req.body;
        const userId = req.user!.userId;
        const userRole = req.user?.role;

        // Check permissions: Creator or ADMIN (Strictly ADMIN per prompt, but typically Leader too, adhering to strict prompt "Creator or ADMIN")
        // First, we need to know who created it.
        const existingSubject = await subjectService.getById(id);

        if (existingSubject.createdById !== userId && userRole !== Role.ADMIN) {
            return res.status(403).json({ message: 'Insufficient permissions. Only Creator or ADMIN can update.' });
        }

        const updatedSubject = await subjectService.update(id, {
            title,
            description,
            code,
            icon,
            color,
            status
        });

        res.status(200).json(updatedSubject);
    } catch (error) {
        next(error);
    }
};

// Delete subject
export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        const userRole = (req as any).user?.role;

        const subject = await prisma.subject.findUnique({
            where: { id }
        });

        if (!subject) {
            return res.status(404).json({ message: 'Assunto não encontrado.' });
        }

        // Only creator or admin can delete
        if (subject.createdById !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Você não tem permissão para excluir este assunto.' });
        }

        // Questions are cascaded automatically via Prisma
        await prisma.subject.delete({
            where: { id }
        });

        res.json({ message: 'Assunto excluído com sucesso.' });
    } catch (error) {
        next(error);
    }
};

// Create a question for a subject
export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: subjectId } = req.params;
        const { question, options, correctAnswer, difficulty } = req.body;
        const userId = (req as any).user?.userId;
        const userRole = (req as any).user?.role;

        // Only teachers can create questions
        if (userRole !== 'TEACHER' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Apenas professores podem criar questões.' });
        }

        // Validate subject exists
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        });

        if (!subject) {
            return res.status(404).json({ message: 'Assunto não encontrado.' });
        }

        // Validate required fields
        if (!question || !options || options.length < 2 || options.length > 6 || correctAnswer === undefined) {
            return res.status(400).json({
                message: 'Questão, entre 2 e 6 opções e resposta correta são obrigatórios.'
            });
        }

        if (correctAnswer < 0 || correctAnswer >= options.length) {
            return res.status(400).json({ message: `Resposta correta deve ser entre 0 e ${options.length - 1}.` });
        }

        // Validate difficulty
        const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
        const diff = difficulty?.toUpperCase() || 'MEDIUM';
        if (!validDifficulties.includes(diff)) {
            return res.status(400).json({ message: 'Dificuldade inválida.' });
        }

        const newQuestion = await prisma.question.create({
            data: {
                question,
                options,
                correctAnswer,
                difficulty: diff as QuestionDifficulty,
                subjectId,
                createdById: userId
            },
            include: {
                createdBy: {
                    select: { id: true, name: true }
                }
            }
        });

        res.status(201).json(newQuestion);
    } catch (error) {
        next(error);
    }
};

// Update a question
export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subjectId, questionId } = req.params;
        const { question, options, correctAnswer, difficulty } = req.body;
        const userId = (req as any).user?.userId;
        const userRole = (req as any).user?.role;

        const existingQuestion = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!existingQuestion || existingQuestion.subjectId !== subjectId) {
            return res.status(404).json({ message: 'Questão não encontrada.' });
        }

        // Only creator or admin can update
        if (existingQuestion.createdById !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Você não tem permissão para editar esta questão.' });
        }

        // Validate options if provided
        if (options && (options.length < 2 || options.length > 6)) {
            return res.status(400).json({ message: 'Deve haver entre 2 e 6 opções.' });
        }

        // Validate correctAnswer if provided
        const maxAnswer = options ? options.length - 1 : 4;
        if (correctAnswer !== undefined && (correctAnswer < 0 || correctAnswer > maxAnswer)) {
            return res.status(400).json({ message: `Resposta correta deve ser entre 0 e ${maxAnswer}.` });
        }

        // Validate difficulty if provided
        let diff = undefined;
        if (difficulty) {
            const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
            diff = difficulty.toUpperCase();
            if (!validDifficulties.includes(diff)) {
                return res.status(400).json({ message: 'Dificuldade inválida.' });
            }
        }

        const updatedQuestion = await prisma.question.update({
            where: { id: questionId },
            data: {
                ...(question && { question }),
                ...(options && { options }),
                ...(correctAnswer !== undefined && { correctAnswer }),
                ...(diff && { difficulty: diff as QuestionDifficulty })
            },
            include: {
                createdBy: {
                    select: { id: true, name: true }
                }
            }
        });

        res.json(updatedQuestion);
    } catch (error) {
        next(error);
    }
};

// Delete a question
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subjectId, questionId } = req.params;
        const userId = (req as any).user?.userId;
        const userRole = (req as any).user?.role;

        const question = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!question || question.subjectId !== subjectId) {
            return res.status(404).json({ message: 'Questão não encontrada.' });
        }

        // Only creator or admin can delete
        if (question.createdById !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Você não tem permissão para excluir esta questão.' });
        }

        await prisma.question.delete({
            where: { id: questionId }
        });

        res.json({ message: 'Questão excluída com sucesso.' });
export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const userRole = req.user?.role;

        const existingSubject = await subjectService.getById(id);

        if (existingSubject.createdById !== userId && userRole !== Role.ADMIN) {
            return res.status(403).json({ message: 'Insufficient permissions. Only Creator or ADMIN can delete.' });
        }

        await subjectService.deleteSubject(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
