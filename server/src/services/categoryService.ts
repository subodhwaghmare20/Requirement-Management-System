import { Category } from '../models/Category';
import { AppError } from '../utils/appError';

export class CategoryService {
  public static async getAllCategories(includeInactive: boolean = false) {
    const filter = includeInactive ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });
    return categories;
  }

  public static async createCategory(data: { name: string; description?: string }) {
    if (!data.name || data.name.trim() === '') {
      throw new AppError('Category name is required', 400);
    }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({
      $or: [{ name: new RegExp(`^${data.name.trim()}$`, 'i') }, { slug }],
    });

    if (existing) {
      throw new AppError('Category with this name already exists', 400);
    }

    const category = await Category.create({
      name: data.name.trim(),
      slug,
      description: data.description || '',
      isActive: true,
    });

    return category;
  }

  public static async updateCategory(id: string, data: { name?: string; description?: string }) {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (data.name && data.name.trim() !== '') {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await Category.findOne({
        _id: { $ne: id },
        $or: [{ name: new RegExp(`^${data.name.trim()}$`, 'i') }, { slug }],
      });

      if (existing) {
        throw new AppError('Another category with this name already exists', 400);
      }

      category.name = data.name.trim();
      category.slug = slug;
    }

    if (data.description !== undefined) {
      category.description = data.description;
    }

    await category.save();
    return category;
  }

  public static async toggleCategoryActive(id: string) {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    category.isActive = !category.isActive;
    await category.save();
    return category;
  }
}
