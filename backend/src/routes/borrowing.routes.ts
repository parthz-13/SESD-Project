import { Router } from 'express';
import { prisma } from '../config/database';
import { BorrowingRepository } from '../repositories/BorrowingRepository';
import { BookRepository } from '../repositories/BookRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { FineRepository } from '../repositories/FineRepository';
import { BorrowingService } from '../services/BorrowingService';
import { FineService } from '../services/FineService';
import { NotificationService } from '../services/NotificationService';
import { BorrowingController } from '../controllers/BorrowingController';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models';

const router = Router();
const borrowingRepository = new BorrowingRepository(prisma);
const bookRepository = new BookRepository(prisma);
const fineRepository = new FineRepository(prisma);
const notificationRepository = new NotificationRepository(prisma);
const fineService = new FineService(fineRepository);
const notificationService = new NotificationService(notificationRepository);
const borrowingService = new BorrowingService(borrowingRepository, bookRepository, fineService, notificationService);
const borrowingController = new BorrowingController(borrowingService);

router.use(authenticate);

// POST /api/borrowings/issue
router.post('/issue', authorize(UserRole.ADMIN, UserRole.LIBRARIAN), borrowingController.issueBook);

// PATCH /api/borrowings/:id/return
router.patch('/:id/return', authorize(UserRole.ADMIN, UserRole.LIBRARIAN), borrowingController.returnBook);

// GET /api/borrowings/active
router.get('/active', authorize(UserRole.ADMIN, UserRole.LIBRARIAN), borrowingController.getActive);

// GET /api/borrowings/overdue
router.get('/overdue', authorize(UserRole.ADMIN, UserRole.LIBRARIAN), borrowingController.getOverdue);

// GET /api/borrowings/member/:memberId
router.get('/member/:memberId', borrowingController.getMemberHistory);

export default router;
