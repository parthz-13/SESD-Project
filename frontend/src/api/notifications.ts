import api from './axiosInstance';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'DUE_REMINDER' | 'OVERDUE_ALERT' | 'AVAILABILITY' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getUserNotifications: (userId: number) => 
    api.get(`/notifications/user/${userId}`),

  markAsRead: (id: number) => 
    api.patch(`/notifications/${id}/read`),

  markAllAsRead: (userId: number) => 
    api.patch(`/notifications/user/${userId}/read-all`),
};
