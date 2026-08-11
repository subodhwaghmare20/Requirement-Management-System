import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

export class NotificationController {
  public static getUserNotifications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const data = await NotificationService.getUserNotifications(
        req.user._id.toString()
      );
      return successResponse(
        res,
        data,
        'Notifications retrieved successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };

  public static markAsRead = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const notification = await NotificationService.markAsRead(
        req.params.id,
        req.user._id.toString()
      );
      return successResponse(
        res,
        notification,
        'Notification marked as read',
        200
      );
    } catch (error) {
      next(error);
    }
  };

  public static markAllAsRead = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const result = await NotificationService.markAllAsRead(
        req.user._id.toString()
      );
      return successResponse(res, result, 'All notifications marked as read', 200);
    } catch (error) {
      next(error);
    }
  };

  public static deleteNotification = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const result = await NotificationService.deleteNotification(
        req.params.id,
        req.user._id.toString()
      );
      return successResponse(res, result, 'Notification deleted', 200);
    } catch (error) {
      next(error);
    }
  };
}
