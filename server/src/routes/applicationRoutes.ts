import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);

// HR / Trainer candidate applications review routes
router.get(
  '/requirement/:requirementId',
  requireRole('HR', 'ADMIN', 'TRAINER'),
  ApplicationController.getRequirementApplications
);

router.patch(
  '/:id/status',
  requireRole('HR', 'ADMIN', 'TRAINER'),
  ApplicationController.updateApplicationStatus
);

// Student application routes
router.post('/', requireRole('STUDENT'), ApplicationController.createApplication);
router.get('/my', requireRole('STUDENT'), ApplicationController.getMyApplications);
router.get('/:id', ApplicationController.getApplicationById);
router.patch(
  '/:id/withdraw',
  requireRole('STUDENT'),
  ApplicationController.withdrawApplication
);

export default router;
