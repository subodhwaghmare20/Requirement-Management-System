import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class AnalyticsController {
  public static getAnalytics = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const options = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        categoryId: req.query.categoryId as string,
        sourcePlatform: req.query.sourcePlatform as string,
        location: req.query.location as string,
      };

      const data = await AnalyticsService.getAnalyticsData(options);
      return successResponse(res, data, 'Analytics data retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
