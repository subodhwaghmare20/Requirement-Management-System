import { Requirement } from '../models/Requirement';
import { Company } from '../models/Company';
import { User, IUser } from '../models/User';
import { Application } from '../models/Application';
import { ApplicationClick } from '../models/ApplicationClick';
import { NotificationService } from './notificationService';
import { escapeRegex } from '../utils/sanitize';
import { AppError } from '../utils/appError';

const isSafeUrl = (url?: string): boolean => {
  if (!url || url.trim() === '') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export interface RequirementFilterOptions {
  status?: string;
  companyId?: string;
  categoryId?: string;
  search?: string;
  sourcePlatform?: string;
  jobType?: string;
  workMode?: string;
  experience?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  createdBy?: string;
  sort?: 'newest' | 'oldest' | 'deadline' | 'salary_high' | 'salary_low';
  page?: number;
  limit?: number;
}

export class RequirementService {
  /**
   * Helper function to automatically update expired requirements whose deadline has passed
   */
  public static async updateExpiredRequirements() {
    const now = new Date();
    await Requirement.updateMany(
      {
        status: 'PUBLISHED',
        deadline: { $lt: now },
      },
      {
        $set: { status: 'EXPIRED' },
      }
    );
  }

  public static async getTrainerStats(user: IUser) {
    await this.updateExpiredRequirements();

    const createdByFilter = user.role === 'TRAINER' ? { createdBy: user._id } : {};

    const [total, published, drafts, closed, expired] = await Promise.all([
      Requirement.countDocuments(createdByFilter),
      Requirement.countDocuments({ ...createdByFilter, status: 'PUBLISHED' }),
      Requirement.countDocuments({ ...createdByFilter, status: 'DRAFT' }),
      Requirement.countDocuments({ ...createdByFilter, status: 'CLOSED' }),
      Requirement.countDocuments({ ...createdByFilter, status: 'EXPIRED' }),
    ]);

    return {
      total,
      published,
      drafts,
      closed,
      expired,
    };
  }

  public static async getHRStats() {
    await this.updateExpiredRequirements();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalRequirements,
      publishedRequirements,
      draftRequirements,
      closedRequirements,
      expiredRequirements,
      postedThisWeek,
      totalStudents,
      totalApplications,
      externalApplyClicks,
    ] = await Promise.all([
      Requirement.countDocuments(),
      Requirement.countDocuments({ status: 'PUBLISHED' }),
      Requirement.countDocuments({ status: 'DRAFT' }),
      Requirement.countDocuments({ status: 'CLOSED' }),
      Requirement.countDocuments({ status: 'EXPIRED' }),
      Requirement.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      User.countDocuments({ role: 'STUDENT' }),
      Application.countDocuments(),
      ApplicationClick.countDocuments(),
    ]);

    return {
      totalRequirements,
      publishedRequirements,
      draftRequirements,
      closedRequirements,
      expiredRequirements,
      postedThisWeek,
      totalStudents,
      totalApplications,
      externalApplyClicks,
    };
  }

  public static async createRequirement(data: any, user: IUser) {
    let companyId = data.companyId;
    let companyName = data.companyName || '';
    let companyLogo = data.companyLogo || '';

    if (companyId && typeof companyId === 'string' && companyId.match(/^[0-9a-fA-F]{24}$/)) {
      const company = await Company.findById(companyId);
      if (company) {
        companyName = company.name;
        companyLogo = company.logoUrl || '';
      }
    } else {
      if (companyName && companyName.trim()) {
        let company = await Company.findOne({
          name: new RegExp(`^${escapeRegex(companyName.trim())}$`, 'i'),
        });
        if (!company) {
          company = await Company.create({
            name: companyName.trim(),
            locations: [data.location || 'Remote'],
            createdById: user._id,
            isActive: true,
          });
        }
        companyId = company._id;
        companyLogo = company.logoUrl || '';
      } else {
        throw new AppError('Please select a valid hiring company or provide a company name', 400);
      }
    }

    const isPublished = data.status === 'PUBLISHED';
    const publishedAt = isPublished ? new Date() : undefined;

    const requirement = await Requirement.create({
      ...data,
      companyId,
      companyName,
      companyLogo,
      createdBy: user._id,
      publishedAt,
    });

    if (isPublished) {
      NotificationService.notifyStudentsNewRequirement(requirement);
    }

    return requirement;
  }

  public static async getRequirements(
    options: RequirementFilterOptions,
    user?: IUser
  ) {
    await this.updateExpiredRequirements();

    const filter: any = {};

    if (user?.role === 'STUDENT') {
      filter.status = 'PUBLISHED';
      filter.$or = [
        { deadline: { $exists: false } },
        { deadline: null },
        { deadline: { $gte: new Date() } },
      ];
    } else if (options.status) {
      filter.status = options.status;
    }

    if (options.companyId) {
      filter.companyId = options.companyId;
    }

    if (options.categoryId) {
      filter.categoryId = options.categoryId;
    }

    if (options.sourcePlatform) {
      filter.sourcePlatform = options.sourcePlatform;
    }

    if (options.jobType) {
      filter.jobType = options.jobType;
    }

    if (options.workMode) {
      filter.workMode = options.workMode;
    }

    if (options.experience) {
      filter.experience = new RegExp(escapeRegex(options.experience), 'i');
    }

    if (options.location) {
      filter.location = new RegExp(escapeRegex(options.location), 'i');
    }

    if (options.createdBy) {
      filter.createdBy = options.createdBy;
    }

    if (options.minSalary) {
      filter.salaryMax = { $gte: options.minSalary };
    }

    if (options.maxSalary) {
      filter.salaryMin = { $lte: options.maxSalary };
    }

    if (options.search) {
      const safeSearch = escapeRegex(options.search);
      const searchRegex = new RegExp(safeSearch, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { companyName: searchRegex },
        { location: searchRegex },
        { skills: searchRegex },
      ];
    }

    let sortQuery: any = { createdAt: -1 };
    if (options.sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    } else if (options.sort === 'deadline') {
      sortQuery = { deadline: 1 };
    } else if (options.sort === 'salary_high') {
      sortQuery = { salaryMax: -1, salaryMin: -1 };
    } else if (options.sort === 'salary_low') {
      sortQuery = { salaryMin: 1, salaryMax: 1 };
    }

    const page = options.page || 1;
    const limit = options.limit || 12;
    const skip = (page - 1) * limit;

    const [requirements, total] = await Promise.all([
      Requirement.find(filter)
        .populate('companyId', 'name logoUrl website industry locations')
        .populate('categoryId', 'name slug')
        .populate('createdBy', 'name email role')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Requirement.countDocuments(filter),
    ]);

    return {
      requirements,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  public static async getRequirementById(id: string) {
    await this.updateExpiredRequirements();

    const requirement = await Requirement.findById(id)
      .populate('companyId', 'name logoUrl website linkedinUrl industry locations description')
      .populate('categoryId', 'name slug')
      .populate('createdBy', 'name email role');

    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    requirement.viewsCount += 1;
    await requirement.save();

    return requirement;
  }

  public static async recordApplyClick(
    id: string,
    user?: IUser,
    ipAddress?: string
  ) {
    await this.updateExpiredRequirements();

    const requirement = await Requirement.findById(id);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    if (requirement.status !== 'PUBLISHED') {
      throw new AppError(
        `Cannot redirect external drive: Job requirement is currently ${requirement.status}`,
        400
      );
    }

    if (requirement.deadline && new Date(requirement.deadline) < new Date()) {
      requirement.status = 'EXPIRED';
      await requirement.save();
      throw new AppError('Cannot redirect external drive: Application deadline has expired', 400);
    }

    const targetUrl = requirement.applicationUrl || requirement.sourceUrl;
    if (!targetUrl || !isSafeUrl(targetUrl)) {
      throw new AppError(
        'Invalid or unsafe external application URL. Only HTTP and HTTPS protocols are permitted.',
        400
      );
    }

    await ApplicationClick.create({
      requirementId: requirement._id,
      studentId: user?._id,
      sourcePlatform: requirement.sourcePlatform,
      ipAddress: ipAddress || '',
      clickedAt: new Date(),
    });

    requirement.clicksCount += 1;
    await requirement.save();

    return {
      redirectUrl: targetUrl,
      sourcePlatform: requirement.sourcePlatform,
      clicksCount: requirement.clicksCount,
    };
  }

  public static async updateRequirement(id: string, data: any, user: IUser) {
    const requirement = await Requirement.findById(id);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    if (
      user.role === 'TRAINER' &&
      requirement.createdBy.toString() !== user._id.toString()
    ) {
      throw new AppError('Trainers can only edit their own posted requirements', 403);
    }

    if (data.companyId) {
      if (typeof data.companyId === 'string' && data.companyId.match(/^[0-9a-fA-F]{24}$/)) {
        const company = await Company.findById(data.companyId);
        if (company) {
          data.companyName = company.name;
          data.companyLogo = company.logoUrl || '';
        }
      } else if (data.companyName && data.companyName.trim()) {
        let company = await Company.findOne({
          name: new RegExp(`^${escapeRegex(data.companyName.trim())}$`, 'i'),
        });
        if (!company) {
          company = await Company.create({
            name: data.companyName.trim(),
            locations: [data.location || 'Remote'],
            createdById: user._id,
            isActive: true,
          });
        }
        data.companyId = company._id;
        data.companyLogo = company.logoUrl || '';
      }
    }

    const wasPublished = requirement.status === 'PUBLISHED';
    Object.assign(requirement, data);
    await requirement.save();

    if (!wasPublished && requirement.status === 'PUBLISHED') {
      NotificationService.notifyStudentsNewRequirement(requirement);
    }

    return requirement;
  }

  public static async publishRequirement(id: string, user: IUser) {
    const requirement = await Requirement.findById(id);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    if (
      user.role === 'TRAINER' &&
      requirement.createdBy.toString() !== user._id.toString()
    ) {
      throw new AppError('Trainers can only publish their own posted requirements', 403);
    }

    requirement.status = 'PUBLISHED';
    requirement.publishedAt = new Date();
    await requirement.save();

    NotificationService.notifyStudentsNewRequirement(requirement);

    return requirement;
  }

  public static async closeRequirement(id: string, user: IUser) {
    const requirement = await Requirement.findById(id);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    if (
      user.role === 'TRAINER' &&
      requirement.createdBy.toString() !== user._id.toString()
    ) {
      throw new AppError('Trainers can only close their own posted requirements', 403);
    }

    requirement.status = 'CLOSED';
    await requirement.save();

    return requirement;
  }

  public static async deleteRequirement(id: string, user: IUser) {
    const requirement = await Requirement.findById(id);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    if (user.role === 'TRAINER') {
      if (requirement.createdBy.toString() !== user._id.toString()) {
        throw new AppError('Trainers can only delete their own requirements', 403);
      }
      if (requirement.status !== 'DRAFT') {
        throw new AppError('Trainers can only delete requirements in DRAFT status', 403);
      }
    }

    await Requirement.findByIdAndDelete(id);
    return { message: 'Requirement deleted successfully' };
  }
}
