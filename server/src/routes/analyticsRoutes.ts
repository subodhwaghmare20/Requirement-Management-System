import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);
router.use(requireRole('HR', 'ADMIN'));

router.get('/', AnalyticsController.getAnalytics);

export default router;
