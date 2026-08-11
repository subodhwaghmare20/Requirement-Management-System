import { StudentProfile } from '../models/StudentProfile';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { StorageService } from './storageService';

export class StudentService {
  public static async getProfileByUserId(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      profile = await StudentProfile.create({
        userId,
        skills: [],
        course: '',
        batch: '',
      });
    }

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    };
  }

  public static async updateProfile(userId: string, updateData: any) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Sync fullName and mobile on User if provided
    if (updateData.fullName) {
      user.name = updateData.fullName;
    }
    if (updateData.mobile !== undefined) {
      user.phone = updateData.mobile;
    }
    await user.save();

    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      profile = new StudentProfile({ userId });
    }

    if (updateData.course !== undefined) profile.course = updateData.course;
    if (updateData.batch !== undefined) profile.batch = updateData.batch;
    if (updateData.skills !== undefined) profile.skills = updateData.skills;
    if (updateData.graduationYear !== undefined)
      profile.graduationYear = updateData.graduationYear;
    if (updateData.linkedinUrl !== undefined)
      profile.linkedinUrl = updateData.linkedinUrl;
    if (updateData.githubUrl !== undefined)
      profile.githubUrl = updateData.githubUrl;
    if (updateData.portfolioUrl !== undefined)
      profile.portfolioUrl = updateData.portfolioUrl;
    if (updateData.headline !== undefined) profile.headline = updateData.headline;
    if (updateData.bio !== undefined) profile.bio = updateData.bio;

    await profile.save();

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    };
  }

  public static async updateResume(
    userId: string,
    file: Express.Multer.File
  ) {
    if (!file) {
      throw new AppError('Please select a resume file to upload', 400);
    }

    let profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      profile = await StudentProfile.create({ userId, skills: [] });
    }

    const storageProvider = StorageService.getProvider();

    // Delete old resume file if present
    if (profile.resumeUrl) {
      await storageProvider.deleteResume(profile.resumeUrl);
    }

    // Upload new resume file
    const uploadResult = await storageProvider.uploadResume(file);

    profile.resumeUrl = uploadResult.url;
    profile.resumeOriginalName = uploadResult.originalName;
    await profile.save();

    return {
      resumeUrl: profile.resumeUrl,
      resumeOriginalName: profile.resumeOriginalName,
    };
  }
}
