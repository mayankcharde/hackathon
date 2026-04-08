import express from 'express';
import { sendMessage, getMyMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All message routes now require authentication (Owner or Founder)

router.post('/', sendMessage);
router.get('/', getMyMessages);

export default router;
