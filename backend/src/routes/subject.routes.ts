import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as controller from '../controllers/subject.controller';

const router = Router();

router.use(authenticate);

router.get('/', controller.getAllSubjects);
router.get('/:id', controller.getSubjectById);
router.post('/', controller.createSubject);
router.put('/:id', controller.updateSubject);
router.delete('/:id', controller.deleteSubject);

export default router;
