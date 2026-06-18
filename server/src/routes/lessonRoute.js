import { Router } from 'express';
import {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessonContent,
  getLessons,
  updateLesson,
} from '../controllers/lessonController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getLessons);
router.get('/:id', getLessonById);
router.get('/:id/content', getLessonContent);

router.post('/', protect, adminOnly, createLesson);
router.put('/:id', protect, adminOnly, updateLesson);
router.delete('/:id', protect, adminOnly, deleteLesson);

export default router;