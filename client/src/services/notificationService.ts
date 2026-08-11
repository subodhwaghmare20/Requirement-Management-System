import API from './api';
import { ApiResponse, NotificationItem } from '../types';

export interface UserNotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

export const notificationService = {
  async getNotifications(): Promise<UserNotificationsResponse> {
    const res = await API.get<ApiResponse<UserNotificationsResponse>>('/notifications');
    return res.data.data;
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    const res = await API.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return res.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await API.patch('/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await API.delete(`/notifications/${id}`);
  },
};
