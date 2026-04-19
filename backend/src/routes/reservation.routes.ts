import { Router } from 'express';
import { prisma } from '../config/database';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { BookRepository } from '../repositories/BookRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { ReservationService } from '../services/ReservationService';
import { NotificationService } from '../services/NotificationService';
import { ReservationController } from '../controllers/ReservationController';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models';

const router = Router();
const reservationRepository = new ReservationRepository(prisma);
const bookRepository = new BookRepository(prisma);
const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const reservationService = new ReservationService(reservationRepository, bookRepository, notificationService);
const reservationController = new ReservationController(reservationService);

router.use(authenticate);

// POST /api/reservations — member
router.post('/', authorize(UserRole.MEMBER), reservationController.reserve);

// PATCH /api/reservations/:id/cancel — member
router.patch('/:id/cancel', authorize(UserRole.MEMBER), reservationController.cancel);

// PATCH /api/reservations/:id/fulfill — librarian/admin
router.patch('/:id/fulfill', authorize(UserRole.ADMIN, UserRole.LIBRARIAN), reservationController.fulfill);

// GET /api/reservations/member/:memberId
router.get('/member/:memberId', reservationController.getMemberReservations);

// GET /api/reservations/pending — librarian/admin
router.get('/pending', authorize(UserRole.ADMIN, UserRole.LIBRARIAN), reservationController.getAllPending);

export default router;
