import { Response, NextFunction } from 'express';
import { BookmarkService } from '../services/bookmarkService';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

export class BookmarkController {
  public static addBookmark = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const bookmark = await BookmarkService.addBookmark(
        req.user._id.toString(),
        req.params.requirementId
      );
      return successResponse(res, bookmark, 'Job saved to bookmarks', 201);
    } catch (error) {
      next(error);
    }
  };

  public static removeBookmark = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const result = await BookmarkService.removeBookmark(
        req.user._id.toString(),
        req.params.requirementId
      );
      return successResponse(res, result, 'Job removed from bookmarks', 200);
    } catch (error) {
      next(error);
    }
  };

  public static getBookmarks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const bookmarks = await BookmarkService.getBookmarks(
        req.user._id.toString()
      );
      return successResponse(
        res,
        bookmarks,
        'Saved jobs retrieved successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  };
}
