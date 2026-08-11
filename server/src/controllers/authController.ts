import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema, updatePasswordSchema } from '../validators/authValidator';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

export class AuthController {
  private static setAuthCookie(res: Response, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  public static register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register(validated);
      AuthController.setAuthCookie(res, result.token);
      return successResponse(res, result, 'Student registered successfully', 201);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };

  public static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated);
      AuthController.setAuthCookie(res, result.token);
      return successResponse(res, result, 'Login successful', 200);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };

  public static logout = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const isProduction = process.env.NODE_ENV === 'production';
      res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
      });
      return successResponse(res, null, 'Logged out successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static getMe = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized access', 401);
      }
      const result = await AuthService.getCurrentUser(req.user._id.toString());
      return successResponse(res, result, 'User details retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  public static updatePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized access', 401);
      }
      const validated = updatePasswordSchema.parse(req.body);
      const result = await AuthService.updatePassword(
        req.user._id.toString(),
        validated.currentPassword,
        validated.newPassword
      );
      return successResponse(res, result, 'Password updated successfully', 200);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };
}
