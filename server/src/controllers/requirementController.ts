import { Response, NextFunction } from 'express';
import { RequirementService } from '../services/requirementService';
import { createRequirementSchema, updateRequirementSchema } from '../validators/requirementValidator';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

export class RequirementController {
  public static getTrainerStats = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const stats = await RequirementService.getTrainerStats(req.user);
      return successResponse(res, stats, 'Trainer requirement statistics retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  public static getHRStats = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const stats = await RequirementService.getHRStats();
      return successResponse(res, stats, 'HR portal statistics retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  public static createRequirement = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const validated = createRequirementSchema.parse(req.body);
      const requirement = await RequirementService.createRequirement(
        validated,
        req.user
      );
      return successResponse(res, requirement, 'Job requirement created successfully', 201);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };

  public static getRequirements = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const options = {
        status: req.query.status as string,
        companyId: req.query.companyId as string,
        categoryId: req.query.categoryId as string,
        search: req.query.search as string,
        sourcePlatform: req.query.sourcePlatform as string,
        jobType: req.query.jobType as string,
        workMode: req.query.workMode as string,
        experience: req.query.experience as string,
        location: req.query.location as string,
        minSalary: req.query.minSalary ? parseFloat(req.query.minSalary as string) : undefined,
        maxSalary: req.query.maxSalary ? parseFloat(req.query.maxSalary as string) : undefined,
        createdBy: req.query.createdBy as string,
        sort: req.query.sort as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
      };

      const result = await RequirementService.getRequirements(options, req.user);
      return successResponse(res, result, 'Requirements retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static getRequirementById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requirement = await RequirementService.getRequirementById(req.params.id);
      return successResponse(res, requirement, 'Requirement details retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  public static recordApplyClick = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress || '';
      const result = await RequirementService.recordApplyClick(
        req.params.id,
        req.user,
        ipAddress
      );
      return successResponse(res, result, 'External click recorded successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static updateRequirement = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const validated = updateRequirementSchema.parse(req.body);
      const requirement = await RequirementService.updateRequirement(
        req.params.id,
        validated,
        req.user
      );
      return successResponse(res, requirement, 'Requirement updated successfully', 200);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };

  public static publishRequirement = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const requirement = await RequirementService.publishRequirement(
        req.params.id,
        req.user
      );
      return successResponse(res, requirement, 'Requirement published successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static closeRequirement = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const requirement = await RequirementService.closeRequirement(
        req.params.id,
        req.user
      );
      return successResponse(res, requirement, 'Requirement closed successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static deleteRequirement = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const result = await RequirementService.deleteRequirement(
        req.params.id,
        req.user
      );
      return successResponse(res, result, 'Requirement deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
