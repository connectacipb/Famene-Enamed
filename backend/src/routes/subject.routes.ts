import { Router } from 'express';
import {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from '../controllers/subject.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Subject routes
router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

// Question routes (nested under subjects)
router.post('/:id/questions', createQuestion);
router.put('/:subjectId/questions/:questionId', updateQuestion);
router.delete('/:subjectId/questions/:questionId', deleteQuestion);

export default router;
