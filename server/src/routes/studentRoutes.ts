import { Router } from 'express';
import multer from 'multer';
import { StudentController } from '../controllers/studentController';
import { authenticateUser, requireRole } from '../middleware/auth';
import { AppError } from '../utils/appError';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only PDF, DOC, and DOCX documents are allowed', 400));
    }
  },
});

const router = Router();

// Apply student authentication & role authorization middleware
router.use(authenticateUser);
router.use(requireRole('STUDENT'));

router.get('/me', StudentController.getProfile);
router.put('/me', StudentController.updateProfile);
router.post('/me/resume', upload.single('resume'), StudentController.uploadResume);

export default router;
