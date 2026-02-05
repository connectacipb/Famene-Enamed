import { Request, Response, NextFunction } from 'express';
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

export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const subject = await subjectService.getById(id);
        res.status(200).json(subject);
    } catch (error) {
        next(error);
    }
};

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
