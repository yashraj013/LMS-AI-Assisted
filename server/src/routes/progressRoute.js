import { Router } from 'express';
import {
  getProgressStats,
  getUserModuleProgress,
  getUserProgress,
  markComplete,
  updateProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:userId', protect, getUserProgress);
router.get('/:userId/module/:moduleId', protect, getUserModuleProgress);
router.get('/:userId/stats', protect, getProgressStats);

router.post('/mark-complete', protect, markComplete);
router.put('/:progressId', protect, updateProgress);

export default router;