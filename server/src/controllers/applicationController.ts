import { Response, NextFunction } from 'express';
import { ApplicationService } from '../services/applicationService';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

export class ApplicationController {
  public static createApplication = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const { requirementId, resumeUrl } = req.body;
      if (!requirementId) {
        throw new AppError('requirementId is required', 400);
      }

      const application = await ApplicationService.createApplication(
        req.user,
        requirementId,
        resumeUrl
      );
      return successResponse(
        res,
        application,
        'Application Submitted Successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  public static getMyApplications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const applications = await ApplicationService.getMyApplications(
        req.user._id.toString()
      );
      return successResponse(
        res,
        applications,
        'Application history retrieved successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };

  public static getRequirementApplications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const data = await ApplicationService.getRequirementApplications(
        req.params.requirementId,
        req.user
      );
      return successResponse(
        res,
        data,
        'Candidate applications retrieved successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };

  public static getApplicationById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const application = await ApplicationService.getApplicationById(
        req.params.id,
        req.user
      );
      return successResponse(
        res,
        application,
        'Application details retrieved',
        200
      );
    } catch (error) {
      next(error);
    }
  };

  public static updateApplicationStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const { status, remarks } = req.body;
      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const application = await ApplicationService.updateApplicationStatus(
        req.params.id,
        status,
        remarks || '',
        req.user
      );
      return successResponse(
        res,
        application,
        'Application status updated successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };

  public static withdrawApplication = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const application = await ApplicationService.withdrawApplication(
        req.params.id,
        req.user._id.toString()
      );
      return successResponse(
        res,
        application,
        'Application withdrawn successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };
}
