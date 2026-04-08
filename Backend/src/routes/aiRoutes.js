import express from 'express';
import { generateDescription, generateMessage, suggestReply } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for finders to get help writing a message
router.post('/generate-message', generateMessage);

// Protected routes for owners (AI assistance)
router.post('/generate-description', protect, generateDescription);
router.post('/suggest-reply', protect, suggestReply);

export default router;
