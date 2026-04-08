import express from 'express';
import {
  createItem,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ── Public Routes ─────────────────────────────
router.get('/:id', getItemById); // Anyone can view an item (useful for QR scan)

// ── Protected Routes ──────────────────────────
router.use(protect); // All routes below require JWT

router.route('/')
  .get(getMyItems)   // GET  /api/items         → get logged-in user's items
  .post(upload.single('image'), createItem); // POST /api/items → create item + upload image + generate QR

router.route('/:id')
  .put(updateItem)    // PUT    /api/items/:id  → update (owner only)
  .delete(deleteItem); // DELETE /api/items/:id → delete (owner only)

export default router;
