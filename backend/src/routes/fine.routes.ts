import { Router } from 'express';
import { prisma } from '../config/database';
import { FineRepository } from '../repositories/FineRepository';
import { FineService } from '../services/FineService';
import { FineController } from '../controllers/FineController';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models';

const router = Router();
const fineRepository = new FineRepository(prisma);
const fineService = new FineService(fineRepository);
const fineController = new FineController(fineService);

router.use(authenticate);

// GET /api/fines — admin only
router.get('/', authorize(UserRole.ADMIN), fineController.getAllFines);

// GET /api/fines/member/:memberId
router.get('/member/:memberId', fineController.getMemberFines);

// PATCH /api/fines/:id/pay
router.patch('/:id/pay', fineController.payFine);

export default router;
