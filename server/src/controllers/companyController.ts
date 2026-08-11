import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/companyService';
import { createCompanySchema, updateCompanySchema } from '../validators/companyValidator';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

export class CompanyController {
  public static createCompany = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const validated = createCompanySchema.parse(req.body);
      const company = await CompanyService.createCompany(validated, req.user);
      return successResponse(res, company, 'Company created successfully', 201);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };

  public static getCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const options = {
        search: req.query.search as string,
        industry: req.query.industry as string,
        location: req.query.location as string,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await CompanyService.getCompanies(options);
      return successResponse(res, result, 'Companies retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static getCompanyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const company = await CompanyService.getCompanyById(req.params.id);
      return successResponse(res, company, 'Company details retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  public static updateCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validated = updateCompanySchema.parse(req.body);
      const company = await CompanyService.updateCompany(req.params.id, validated);
      return successResponse(res, company, 'Company updated successfully', 200);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const msg = error.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(msg, 400));
      }
      next(error);
    }
  };

  public static toggleCompanyActive = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const company = await CompanyService.toggleCompanyActive(req.params.id);
      return successResponse(res, company, 'Company status toggled', 200);
    } catch (error) {
      next(error);
    }
  };
}
