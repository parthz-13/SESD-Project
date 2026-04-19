import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';
import { StatusCodes } from 'http-status-codes';

export class NotificationController {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await this.notificationService.getUserNotifications(userId);
      res.status(StatusCodes.OK).json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await this.notificationService.markAsRead(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, data: notification });
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.notificationService.markAllAsRead(parseInt(req.params.userId));
      res.status(StatusCodes.OK).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  };
}
