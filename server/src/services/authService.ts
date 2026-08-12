import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { EmailService } from './emailService';
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

  private static generateRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public static async sendOtp(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('No user account found with this email address', 404);
    }

    const rawOtp = this.generateRandomOtp();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(rawOtp, salt);

    user.emailOtp = hashedOtp;
    user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await EmailService.sendOtpEmail(user.email, rawOtp, user.name);

    return {
      message: `Verification OTP sent to ${user.email}`,
      devOtp: process.env.NODE_ENV !== 'production' ? rawOtp : undefined,
    };
  }

  public static async verifyOtp(email: string, otp: string) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+emailOtp +emailOtpExpires');
    if (!user) {
      throw new AppError('User account not found', 404);
    }

    if (!user.emailOtp || !user.emailOtpExpires) {
      throw new AppError('No active OTP found. Please request a new OTP code.', 400);
    }

    if (user.emailOtpExpires.getTime() < Date.now()) {
      throw new AppError('OTP code has expired. Please click resend to get a new code.', 400);
    }

    const isMatch = await bcrypt.compare(otp, user.emailOtp);
    if (!isMatch) {
      throw new AppError('Invalid OTP code. Please double check and try again.', 400);
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    await user.save();

    const token = this.generateToken(user);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    delete (userObj as any).emailOtp;
    delete (userObj as any).emailOtpExpires;

    let studentProfile = null;
    if (user.role === 'STUDENT') {
      studentProfile = await StudentProfile.findOne({ userId: user._id });
    }

    return {
      user: userObj,
      studentProfile,
      token,
      message: 'Email address verified successfully!',
    };
  }

  public static async register(data: RegisterDTO) {
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

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password!, salt);

    const user = await User.create({
      name: data.name,
      email,
      passwordHash,
      role: 'STUDENT',
      phone: data.phone || '',
      isActive: true,
      isEmailVerified: false,
    });

    await StudentProfile.create({
      userId: user._id,
      skills: [],
      experienceLevel: 'FRESHER',
    });

    // Send OTP automatically upon registration
    const otpResult = await this.sendOtp(email);

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    return {
      user: userObj,
      requiresOtpVerification: true,
      devOtp: otpResult.devOtp,
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
      requiresOtpVerification: !user.isEmailVerified && user.role === 'STUDENT',
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
