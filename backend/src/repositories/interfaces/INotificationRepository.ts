import { Notification } from '../../models';
import { CreateNotificationDTO } from '../../dtos';

/**
 * INotificationRepository — Contract for notification data access.
 */
export interface INotificationRepository {
  findById(id: number): Promise<Notification | null>;
  findByUser(userId: number): Promise<Notification[]>;
  findUnread(userId: number): Promise<Notification[]>;
  create(data: CreateNotificationDTO): Promise<Notification>;
  markAsRead(id: number): Promise<Notification>;
  markAllAsRead(userId: number): Promise<void>;
}
