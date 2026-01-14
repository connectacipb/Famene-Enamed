import { Router } from 'express';
import { getEvents, createEvent, getEventById, deleteEvent, joinEvent, leaveEvent } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getEvents);
router.post('/', createEvent);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);
router.post('/:id/join', joinEvent);
router.delete('/:id/join', leaveEvent);

export default router;
