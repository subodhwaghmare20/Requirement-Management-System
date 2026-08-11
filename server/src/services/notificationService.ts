import { Notification, NotificationType } from '../models/Notification';
import { User } from '../models/User';
import { AppError } from '../utils/appError';

export class NotificationService {
  /**
   * Notify all students when a new job requirement is published
   */
  public static async notifyStudentsNewRequirement(requirement: any) {
    try {
      const students = await User.find({ role: 'STUDENT', isActive: true });
      if (students.length === 0) return;

      const companyName = requirement.companyName || 'Hiring Company';
      const notifications = students.map((stu) => ({
        userId: stu._id,
        title: `New Job Opening: ${requirement.title}`,
        message: `${companyName} is hiring for ${requirement.title} (${requirement.location}). Apply before deadline!`,
        type: 'NEW_REQUIREMENT' as NotificationType,
        link: `/jobs/${requirement._id}`,
        isRead: false,
      }));

      await Notification.insertMany(notifications);
    } catch (err) {
      console.error('Failed to notify students of new requirement:', err);
    }
  }

  /**
   * Notify student when their application status is updated by HR/Trainer
   */
  public static async notifyApplicationStatusChange(
    studentId: string,
    requirementTitle: string,
    newStatus: string,
    remarks?: string
  ) {
    try {
      let statusLabel = newStatus;
      if (newStatus === 'SHORTLISTED') statusLabel = 'Shortlisted 🎉';
      if (newStatus === 'INTERVIEW') statusLabel = 'Scheduled for Interview 🗓️';
      if (newStatus === 'SELECTED') statusLabel = 'Selected! 🏆';

      const remarkText = remarks ? ` Remarks: "${remarks}"` : '';

      await Notification.create({
        userId: studentId,
        title: `Application Status Updated: ${requirementTitle}`,
        message: `Your application status for '${requirementTitle}' has been updated to '${statusLabel}'.${remarkText}`,
        type: 'APPLICATION_STATUS',
        link: '/applications',
        isRead: false,
      });
    } catch (err) {
      console.error('Failed to notify student of status change:', err);
    }
  }

  /**
   * Notify HR / Trainer when a student submits a portal application
   */
  public static async notifyHROnApplication(
    posterId: string,
    studentName: string,
    requirementTitle: string,
    requirementId: string
  ) {
    try {
      await Notification.create({
        userId: posterId,
        title: `New Candidate Application Received`,
        message: `${studentName} submitted an application for '${requirementTitle}'. Review candidate resume.`,
        type: 'APPLICATION_STATUS',
        link: `/hr/requirements/${requirementId}/applications`,
        isRead: false,
      });
    } catch (err) {
      console.error('Failed to notify HR/Trainer of new application:', err);
    }
  }

  public static async getUserNotifications(userId: string) {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    return {
      notifications,
      unreadCount,
    };
  }

  public static async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      throw new AppError('Notification record not found', 404);
    }

    return notification;
  }

  public static async markAllAsRead(userId: string) {
    await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
    return { message: 'All notifications marked as read' };
  }

  public static async deleteNotification(notificationId: string, userId: string) {
    const result = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    if (!result) {
      throw new AppError('Notification record not found', 404);
    }

    return { message: 'Notification deleted successfully' };
  }
}
