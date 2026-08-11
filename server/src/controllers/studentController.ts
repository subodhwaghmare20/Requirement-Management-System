import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { StudentService } from '../services/studentService';
import { updateStudentProfileSchema } from '../validators/studentValidator';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/appError';

export class StudentController {
  public static getProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const result = await StudentService.getProfileByUserId(
        req.user._id.toString()
      );
      return successResponse(
        res,
        result,
        'Student profile retrieved successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };

  public static updateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const validated = updateStudentProfileSchema.parse(req.body);
      const result = await StudentService.updateProfile(
        req.user._id.toString(),
        validated
      );
      return successResponse(
        res,
        result,
        'Student profile updated successfully',
        200
      );
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };

  public static uploadResume = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      if (!req.file) {
        throw new AppError('No resume file uploaded', 400);
      }
      const result = await StudentService.updateResume(
        req.user._id.toString(),
        req.file
      );
      return successResponse(
        res,
        result,
        'Resume uploaded successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };
}
