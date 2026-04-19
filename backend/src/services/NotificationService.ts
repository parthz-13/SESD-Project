import { INotificationRepository } from '../repositories/interfaces';
import { Notification, NotificationType } from '../models';

/**
 * NotificationService — Creates and manages system notifications.
 * Demonstrates:
 *   - Encapsulation: private helper buildNotification
 *   - Open/Closed: new notification types can be added without modifying callers
 */
export class NotificationService {
  private readonly notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async sendDueReminder(userId: number, bookTitle: string, dueDate: Date): Promise<void> {
    const dateStr = dueDate.toLocaleDateString('en-IN');
    await this.notificationRepository.create({
      userId,
      title: 'Book Due Soon',
      message: `Reminder: "${bookTitle}" is due on ${dateStr}. Please return it on time.`,
      type: NotificationType.DUE_REMINDER,
    });
  }

  async sendOverdueAlert(userId: number, bookTitle: string): Promise<void> {
    await this.notificationRepository.create({
      userId,
      title: 'Overdue Book Alert',
      message: `"${bookTitle}" is overdue. A fine has been applied. Please return it immediately.`,
      type: NotificationType.OVERDUE_ALERT,
    });
  }

  async sendAvailabilityAlert(userId: number, bookTitle: string): Promise<void> {
    await this.notificationRepository.create({
      userId,
      title: 'Book Available',
      message: `Good news! "${bookTitle}" that you reserved is now available for borrowing.`,
      type: NotificationType.AVAILABILITY,
    });
  }

  async sendGeneralNotification(userId: number, title: string, message: string): Promise<void> {
    await this.notificationRepository.create({
      userId,
      title,
      message,
      type: NotificationType.GENERAL,
    });
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findByUser(userId);
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    return this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: number): Promise<void> {
    return this.notificationRepository.markAllAsRead(userId);
  }
}
