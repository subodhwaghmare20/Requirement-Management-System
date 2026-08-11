import { Company } from '../models/Company';
import { IUser } from '../models/User';
import { escapeRegex } from '../utils/sanitize';
import { AppError } from '../utils/appError';

export interface CompanyFilterOptions {
  search?: string;
  industry?: string;
  location?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export class CompanyService {
  public static async createCompany(data: any, creator: IUser) {
    const safeName = escapeRegex(data.name.trim());
    const existing = await Company.findOne({
      name: new RegExp(`^${safeName}$`, 'i'),
    });

    if (existing) {
      throw new AppError('A company with this name already exists', 400);
    }

    const company = await Company.create({
      ...data,
      name: data.name.trim(),
      createdById: creator._id,
    });

    return company;
  }

  public static async getCompanies(options: CompanyFilterOptions = {}) {
    const filter: any = {};

    if (options.isActive !== undefined) {
      filter.isActive = options.isActive;
    }

    if (options.industry) {
      filter.industry = options.industry;
    }

    if (options.location) {
      filter.locations = { $in: [new RegExp(escapeRegex(options.location), 'i')] };
    }

    if (options.search) {
      const searchRegex = new RegExp(escapeRegex(options.search), 'i');
      filter.$or = [
        { name: searchRegex },
        { industry: searchRegex },
        { description: searchRegex },
      ];
    }

    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .populate('createdById', 'name email role')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      Company.countDocuments(filter),
    ]);

    return {
      companies,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  public static async getCompanyById(id: string) {
    const company = await Company.findById(id).populate(
      'createdById',
      'name email role'
    );
    if (!company) {
      throw new AppError('Company not found', 404);
    }
    return company;
  }

  public static async updateCompany(id: string, data: any) {
    const company = await Company.findById(id);
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    if (data.name && data.name.trim() !== company.name) {
      const safeName = escapeRegex(data.name.trim());
      const existing = await Company.findOne({
        _id: { $ne: id },
        name: new RegExp(`^${safeName}$`, 'i'),
      });
      if (existing) {
        throw new AppError('Another company with this name already exists', 400);
      }
    }

    Object.assign(company, data);
    await company.save();

    return company;
  }

  public static async toggleCompanyActive(id: string) {
    const company = await Company.findById(id);
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    company.isActive = !company.isActive;
    await company.save();
    return company;
  }
}
