import { Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class AdminController {
  public static getUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const options = {
        role: req.query.role as string,
        search: req.query.search as string,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 15,
      };

      const data = await AdminService.getUsers(options);
      return successResponse(res, data, 'Users retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static createUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await AdminService.createUser(req.body);
      return successResponse(res, user, 'User account created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public static toggleUserActive = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await AdminService.toggleUserActive(req.params.id);
      return successResponse(res, user, 'User active status updated', 200);
    } catch (error) {
      next(error);
    }
  };

  public static updateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await AdminService.updateUser(req.params.id, req.body);
      return successResponse(res, user, 'User profile updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static getAdminDashboardStats = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const stats = await AdminService.getAdminDashboardStats();
      return successResponse(res, stats, 'Admin dashboard stats retrieved', 200);
    } catch (error) {
      next(error);
    }
  };
}
