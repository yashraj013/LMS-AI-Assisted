import { Router } from 'express';
import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
  getModuleLessons,
} from '../controllers/moduleController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getModules);
router.get('/:id', getModuleById);
router.get('/:id/lessons', getModuleLessons);

router.post('/', protect, adminOnly, createModule);
router.put('/:id', protect, adminOnly, updateModule);
router.delete('/:id', protect, adminOnly, deleteModule);

export default router;