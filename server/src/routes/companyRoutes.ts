import { Router } from 'express';
import { CompanyController } from '../controllers/companyController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', CompanyController.getCompanies);
router.get('/:id', CompanyController.getCompanyById);

router.use(authenticateUser);

router.post(
  '/',
  requireRole('HR', 'ADMIN', 'TRAINER'),
  CompanyController.createCompany
);

router.put(
  '/:id',
  requireRole('HR', 'ADMIN'),
  CompanyController.updateCompany
);

router.patch(
  '/:id/toggle-active',
  requireRole('HR', 'ADMIN'),
  CompanyController.toggleCompanyActive
);

export default router;
