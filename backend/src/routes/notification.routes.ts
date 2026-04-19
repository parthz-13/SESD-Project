import { Router } from 'express';
import { prisma } from '../config/database';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationController } from '../controllers/NotificationController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.use(authenticate);

// GET /api/notifications/:userId
router.get('/:userId', notificationController.getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', notificationController.markAsRead);

// PATCH /api/notifications/user/:userId/read-all
router.patch('/user/:userId/read-all', notificationController.markAllAsRead);

export default router;
