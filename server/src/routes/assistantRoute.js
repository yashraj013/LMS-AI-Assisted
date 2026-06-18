import { Router } from 'express';
import { askQuestion, getChatHistory } from '../controllers/assistantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/ask', protect, askQuestion);
router.get('/history', protect, getChatHistory);
router.get('/history/:lessonId', protect, getChatHistory);

export default router;