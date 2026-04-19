import { Router } from 'express';
import { prisma } from '../config/database';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me
router.get('/me', authenticate, authController.me);

export default router;
