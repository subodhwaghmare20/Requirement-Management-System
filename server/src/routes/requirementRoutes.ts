import { Router } from 'express';
import { RequirementController } from '../controllers/requirementController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

// Apply click route (Accessible by authenticated or public users)
router.post('/:id/apply-click', (req, res, next) => {
  if ((req.headers.authorization && req.headers.authorization.startsWith('Bearer')) || (req.cookies && req.cookies.token)) {
    return authenticateUser(req as any, res, () => RequirementController.recordApplyClick(req as any, res, next));
  }
  return RequirementController.recordApplyClick(req as any, res, next);
});

router.use(authenticateUser);

// Stats routes
router.get(
  '/trainer/stats',
  requireRole('TRAINER', 'HR', 'ADMIN'),
  RequirementController.getTrainerStats
);

router.get(
  '/hr/stats',
  requireRole('HR', 'ADMIN'),
  RequirementController.getHRStats
);

// Read routes
router.get('/', RequirementController.getRequirements);
router.get('/:id', RequirementController.getRequirementById);

// Posting & Management routes (TRAINER, HR, ADMIN)
router.post(
  '/',
  requireRole('TRAINER', 'HR', 'ADMIN'),
  RequirementController.createRequirement
);

router.put(
  '/:id',
  requireRole('TRAINER', 'HR', 'ADMIN'),
  RequirementController.updateRequirement
);

router.patch(
  '/:id/publish',
  requireRole('TRAINER', 'HR', 'ADMIN'),
  RequirementController.publishRequirement
);

router.patch(
  '/:id/close',
  requireRole('TRAINER', 'HR', 'ADMIN'),
  RequirementController.closeRequirement
);

router.delete(
  '/:id',
  requireRole('TRAINER', 'HR', 'ADMIN'),
  RequirementController.deleteRequirement
);

export default router;
