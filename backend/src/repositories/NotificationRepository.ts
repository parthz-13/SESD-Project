import { PrismaClient } from '@prisma/client';
import { Notification } from '../models';
import { CreateNotificationDTO } from '../dtos';
import { INotificationRepository } from './interfaces';

/**
 * NotificationRepository — Prisma implementation of INotificationRepository.
 */
export class NotificationRepository implements INotificationRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } }) as Promise<Notification | null>;
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<Notification[]>;
  }

  async findUnread(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    }) as Promise<Notification[]>;
  }

  async create(data: CreateNotificationDTO): Promise<Notification> {
    return this.prisma.notification.create({ data }) as Promise<Notification>;
  }

  async markAsRead(id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    }) as Promise<Notification>;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
