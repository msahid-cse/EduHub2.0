const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (require authentication)
router.post('/', authenticateToken, eventController.createEvent);
router.put('/:id', authenticateToken, eventController.updateEvent);
router.delete('/:id', authenticateToken, eventController.deleteEvent);

// User interest routes
router.post('/:id/interest', authenticateToken, eventController.expressInterest);
router.delete('/:id/interest', authenticateToken, eventController.removeInterest);

// Admin/organizer routes
router.get('/:id/interested-users', authenticateToken, eventController.getInterestedUsers);
router.post('/:id/send-invitations', authenticateToken, eventController.sendInvitations);

// Analytics routes
router.get('/hits/count', authenticateToken, isAdmin, eventController.getEventHitsCount);

module.exports = router; 