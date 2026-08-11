import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { AppError } from '../utils/appError';

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password?: string;
}

export class AuthService {
  private static generateToken(user: IUser): string {
    const jwtSecret: jwt.Secret =
      process.env.JWT_SECRET || 'super_secret_jwt_key_external_job_portal_2026';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
    return jwt.sign({ id: user._id.toString(), role: user.role }, jwtSecret, {
      expiresIn,
    });
  }

  public static async register(data: RegisterDTO) {
    // 1. Enforce Student registration for public signup
    if (data.role && data.role !== 'STUDENT') {
      throw new AppError(
        'Trainer, HR, and Admin accounts cannot be created via public registration.',
        403
      );
    }

    const email = data.email.toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email address already exists', 400);
    }

    // 2. Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password!, salt);

    const user = await User.create({
      name: data.name,
      email,
      passwordHash,
      role: 'STUDENT',
      phone: data.phone || '',
      isActive: true,
    });

    // 3. Create StudentProfile
    await StudentProfile.create({
      userId: user._id,
      skills: [],
      experienceLevel: 'FRESHER',
    });

    const token = this.generateToken(user);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    return {
      user: userObj,
      token,
    };
  }

  public static async login(data: LoginDTO) {
    const email = data.email.toLowerCase();
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    const isMatch = await user.comparePassword(data.password!);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated or suspended', 403);
    }

    const token = this.generateToken(user);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    let studentProfile = null;
    if (user.role === 'STUDENT') {
      studentProfile = await StudentProfile.findOne({ userId: user._id });
    }

    return {
      user: userObj,
      studentProfile,
      token,
    };
  }

  public static async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    let studentProfile = null;
    if (user.role === 'STUDENT') {
      studentProfile = await StudentProfile.findOne({ userId: user._id });
    }

    return {
      user,
      studentProfile,
    };
  }

  public static async updatePassword(
    userId: string,
    currentPass: string,
    newPass: string
  ) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await user.comparePassword(currentPass);
    if (!isMatch) {
      throw new AppError('Incorrect current password', 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPass, salt);
    await user.save();

    return { message: 'Password updated successfully' };
  }
}
