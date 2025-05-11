import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import * as eventController from '../controllers/eventController.js';

const router = express.Router();

// Public routes
router.get('/', eventController.getEvents);
router.get('/count', eventController.getEventCount);
router.get('/:id', eventController.getEventById);

// Protected routes (require authentication)
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);

// User interest routes
router.post('/:id/interest', authMiddleware, eventController.expressInterest);
router.delete('/:id/interest', authMiddleware, eventController.removeInterest);

// Admin/organizer routes
router.get('/:id/interested-users', authMiddleware, eventController.getInterestedUsers);
router.post('/:id/send-invitations', authMiddleware, eventController.sendInvitations);

// Analytics routes
router.get('/hits/count', authMiddleware, adminOnly, eventController.getEventHitsCount);

export default router; 