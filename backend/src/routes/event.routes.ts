import { Router } from 'express';
import { getEvents, createEvent, getEventById, updateEvent, deleteEvent, joinEvent, leaveEvent } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getEvents);
router.post('/', createEvent);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.post('/:id/join', joinEvent);
router.delete('/:id/join', leaveEvent);

export default router;
