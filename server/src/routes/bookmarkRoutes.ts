import { Router } from 'express';
import { BookmarkController } from '../controllers/bookmarkController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.get('/', requireRole('STUDENT'), BookmarkController.getBookmarks);
router.post(
  '/:requirementId',
  requireRole('STUDENT'),
  BookmarkController.addBookmark
);
router.delete(
  '/:requirementId',
  requireRole('STUDENT'),
  BookmarkController.removeBookmark
);

export default router;
