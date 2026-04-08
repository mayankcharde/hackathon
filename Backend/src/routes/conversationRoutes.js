import express from 'express';
import {
  startConversation,
  getMyConversations,
  getConversationMessages,
} from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect); // All conversation routes require authentication

router.route('/')
  .post(upload.single('proofImage'), startConversation) // Start/Get conversation with optional proof upload
  .get(getMyConversations); // List conversations (Owner/Founder)

router.get('/:id/messages', getConversationMessages); // Get message history

export default router;
