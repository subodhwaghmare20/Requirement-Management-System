import { Application, ApplicationStatus } from '../models/Application';
import { Requirement } from '../models/Requirement';
import { StudentProfile } from '../models/StudentProfile';
import { IUser } from '../models/User';
import { NotificationService } from './notificationService';
import { AppError } from '../utils/appError';

export class ApplicationService {
  public static async createApplication(
    student: IUser,
    requirementId: string,
    customResumeUrl?: string
  ) {
    const profile = await StudentProfile.findOne({ userId: student._id });
    const activeResumeUrl = customResumeUrl || profile?.resumeUrl;

    if (!activeResumeUrl || activeResumeUrl.trim() === '') {
      throw new AppError(
        'Please upload a resume in your student profile before applying for portal jobs.',
        400
      );
    }

    const requirement = await Requirement.findById(requirementId);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    if (requirement.status !== 'PUBLISHED') {
      throw new AppError(
        `Cannot apply: Requirement is currently ${requirement.status}`,
        400
      );
    }

    if (requirement.deadline && new Date(requirement.deadline) < new Date()) {
      requirement.status = 'EXPIRED';
      await requirement.save();
      throw new AppError('Cannot apply: Application deadline has expired', 400);
    }

    if (requirement.applicationType === 'EXTERNAL_REDIRECT') {
      throw new AppError(
        'This requirement uses External Redirect application. Please use the External Apply link.',
        400
      );
    }

    const existing = await Application.findOne({
      studentId: student._id,
      requirementId: requirement._id,
    });

    if (existing) {
      throw new AppError(
        'You have already submitted an application for this job requirement.',
        400
      );
    }

    const application = await Application.create({
      studentId: student._id,
      requirementId: requirement._id,
      resumeUrl: activeResumeUrl,
      status: 'APPLIED',
      appliedAt: new Date(),
    });

    // Notify requirement creator (HR/Trainer)
    NotificationService.notifyHROnApplication(
      requirement.createdBy.toString(),
      student.name,
      requirement.title,
      requirement._id.toString()
    );

    return application;
  }

  public static async getMyApplications(studentId: string) {
    const applications = await Application.find({ studentId })
      .populate({
        path: 'requirementId',
        populate: {
          path: 'companyId',
          select: 'name logoUrl website industry locations',
        },
      })
      .sort({ appliedAt: -1 });

    return applications;
  }

  public static async getApplicationById(id: string, user: IUser) {
    const application = await Application.findById(id).populate({
      path: 'requirementId',
      populate: {
        path: 'companyId',
        select: 'name logoUrl website industry locations description',
      },
    });

    if (!application) {
      throw new AppError('Application record not found', 404);
    }

    if (
      user.role === 'STUDENT' &&
      application.studentId.toString() !== user._id.toString()
    ) {
      throw new AppError('Access denied: You can only view your own applications', 403);
    }

    return application;
  }

  public static async withdrawApplication(id: string, studentId: string) {
    const application = await Application.findById(id);
    if (!application) {
      throw new AppError('Application record not found', 404);
    }

    if (application.studentId.toString() !== studentId) {
      throw new AppError('Access denied: You can only withdraw your own applications', 403);
    }

    if (application.status === 'WITHDRAWN') {
      throw new AppError('Application has already been withdrawn', 400);
    }

    application.status = 'WITHDRAWN';
    application.updatedAt = new Date();
    await application.save();

    return application;
  }

  public static async getRequirementApplications(
    requirementId: string,
    user: IUser
  ) {
    const requirement = await Requirement.findById(requirementId);
    if (!requirement) {
      throw new AppError('Job requirement not found', 404);
    }

    if (
      user.role === 'TRAINER' &&
      requirement.createdBy.toString() !== user._id.toString()
    ) {
      throw new AppError(
        'Trainers can only view candidate applications for their own requirements',
        403
      );
    }

    const rawApplications = await Application.find({ requirementId })
      .populate('studentId', 'name email phone role')
      .sort({ appliedAt: -1 });

    const studentUserIds = rawApplications.map((app) => (app.studentId as any)._id);
    const studentProfiles = await StudentProfile.find({
      userId: { $in: studentUserIds },
    });

    const profileMap = new Map();
    studentProfiles.forEach((p) => {
      profileMap.set(p.userId.toString(), p);
    });

    const applications = rawApplications.map((app) => {
      const studentObj = app.studentId as any;
      const profile = profileMap.get(studentObj._id.toString());
      return {
        _id: app._id,
        requirementId: app.requirementId,
        student: {
          _id: studentObj._id,
          name: studentObj.name,
          email: studentObj.email,
          phone: studentObj.phone,
        },
        course: profile?.course || 'N/A',
        batch: profile?.batch || 'N/A',
        skills: profile?.skills || [],
        resumeUrl: app.resumeUrl || profile?.resumeUrl || '',
        status: app.status,
        appliedAt: app.appliedAt,
        updatedAt: app.updatedAt,
        remarks: app.remarks || '',
      };
    });

    return {
      requirement,
      totalApplications: applications.length,
      applications,
    };
  }

  public static async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    remarks: string,
    user: IUser
  ) {
    const validStatuses: ApplicationStatus[] = [
      'APPLIED',
      'UNDER_REVIEW',
      'SHORTLISTED',
      'INTERVIEW',
      'SELECTED',
      'REJECTED',
    ];

    if (!validStatuses.includes(status)) {
      throw new AppError(
        `Invalid status '${status}'. Allowed statuses: ${validStatuses.join(', ')}`,
        400
      );
    }

    const application = await Application.findById(id).populate('requirementId', 'title');
    if (!application) {
      throw new AppError('Application record not found', 404);
    }

    application.status = status;
    if (remarks !== undefined) {
      application.remarks = remarks;
    }
    application.updatedAt = new Date();
    await application.save();

    const reqTitle = (application.requirementId as any)?.title || 'Job Requirement';

    // Trigger Notification to Student
    NotificationService.notifyApplicationStatusChange(
      application.studentId.toString(),
      reqTitle,
      status,
      remarks
    );

    return application;
  }
}
