import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { Requirement } from '../models/Requirement';
import { Application } from '../models/Application';
import { Company } from '../models/Company';
import { Category } from '../models/Category';
import { escapeRegex } from '../utils/sanitize';
import { AppError } from '../utils/appError';

export interface UserFilterOptions {
  role?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class AdminService {
  public static async getUsers(options: UserFilterOptions) {
    const filter: any = {};

    if (options.role) {
      filter.role = options.role;
    }

    if (options.status === 'active') {
      filter.isActive = true;
    } else if (options.status === 'inactive') {
      filter.isActive = false;
    }

    if (options.search) {
      const regex = new RegExp(escapeRegex(options.search), 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const page = options.page || 1;
    const limit = options.limit || 15;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  public static async createUser(data: any) {
    const { name, email, password, role, phone } = data;

    if (!name || !email || !password || !role) {
      throw new AppError('Name, email, password, and role are required', 400);
    }

    const allowedRoles = ['TRAINER', 'HR', 'ADMIN', 'STUDENT'];
    if (!allowedRoles.includes(role)) {
      throw new AppError(`Invalid role '${role}'`, 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
      isApproved: true,
      isActive: true,
    });

    const userObj: any = user.toObject();
    delete userObj.password;

    return userObj;
  }

  public static async toggleUserActive(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    const userObj: any = user.toObject();
    delete userObj.password;

    return userObj;
  }

  public static async updateUser(userId: string, data: any) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.name) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.role) user.role = data.role;
    if (data.isActive !== undefined) user.isActive = data.isActive;

    await user.save();

    const userObj: any = user.toObject();
    delete userObj.password;

    return userObj;
  }

  public static async getAdminDashboardStats() {
    const [
      totalUsers,
      totalStudents,
      totalTrainers,
      totalHR,
      totalAdmins,
      totalRequirements,
      totalApplications,
      totalCompanies,
      totalCategories,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'STUDENT' }),
      User.countDocuments({ role: 'TRAINER' }),
      User.countDocuments({ role: 'HR' }),
      User.countDocuments({ role: 'ADMIN' }),
      Requirement.countDocuments(),
      Application.countDocuments(),
      Company.countDocuments(),
      Category.countDocuments(),
    ]);

    return {
      totalUsers,
      roles: {
        students: totalStudents,
        trainers: totalTrainers,
        hr: totalHR,
        admins: totalAdmins,
      },
      totalRequirements,
      totalApplications,
      totalCompanies,
      totalCategories,
    };
  }
}
