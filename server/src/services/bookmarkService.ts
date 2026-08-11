import { Bookmark } from '../models/Bookmark';
import { Requirement } from '../models/Requirement';
import { RequirementService } from './requirementService';
import { AppError } from '../utils/appError';

export class BookmarkService {
  public static async addBookmark(studentId: string, requirementId: string) {
    const requirement = await Requirement.findById(requirementId);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    try {
      const bookmark = await Bookmark.create({
        studentId,
        requirementId,
      });
      return bookmark;
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate bookmark - return existing
        const existing = await Bookmark.findOne({ studentId, requirementId });
        return existing;
      }
      throw error;
    }
  }

  public static async removeBookmark(studentId: string, requirementId: string) {
    const result = await Bookmark.findOneAndDelete({
      studentId,
      requirementId,
    });

    if (!result) {
      throw new AppError('Bookmark not found', 404);
    }

    return { message: 'Bookmark removed successfully' };
  }

  public static async getBookmarks(studentId: string) {
    // 1. Update expired status of published requirements
    await RequirementService.updateExpiredRequirements();

    // 2. Fetch bookmarks and populate requirement and company details
    const bookmarks = await Bookmark.find({ studentId })
      .populate({
        path: 'requirementId',
        populate: {
          path: 'companyId',
          select: 'name logoUrl website industry locations',
        },
      })
      .sort({ createdAt: -1 });

    return bookmarks;
  }
}
