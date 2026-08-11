import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);
router.use(requireRole('ADMIN'));

router.get('/stats', AdminController.getAdminDashboardStats);
router.get('/users', AdminController.getUsers);
router.post('/users', AdminController.createUser);
router.patch('/users/:id/toggle-active', AdminController.toggleUserActive);
router.put('/users/:id', AdminController.updateUser);

export default router;
