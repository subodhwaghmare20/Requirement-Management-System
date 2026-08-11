import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', CategoryController.getCategories);

// Admin Category Management Routes
router.post(
  '/',
  authenticateUser,
  requireRole('ADMIN'),
  CategoryController.createCategory
);

router.put(
  '/:id',
  authenticateUser,
  requireRole('ADMIN'),
  CategoryController.updateCategory
);

router.patch(
  '/:id/toggle-active',
  authenticateUser,
  requireRole('ADMIN'),
  CategoryController.toggleCategoryActive
);

export default router;
