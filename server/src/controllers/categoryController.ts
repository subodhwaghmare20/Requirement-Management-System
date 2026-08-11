import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';
import { successResponse } from '../utils/response';

export class CategoryController {
  public static getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await CategoryService.getAllCategories(includeInactive);
      return successResponse(res, categories, 'Categories retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await CategoryService.createCategory(req.body);
      return successResponse(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public static updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      return successResponse(res, category, 'Category updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public static toggleCategoryActive = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await CategoryService.toggleCategoryActive(req.params.id);
      return successResponse(res, category, 'Category status toggled', 200);
    } catch (error) {
      next(error);
    }
  };
}
