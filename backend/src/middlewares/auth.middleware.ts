import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { prisma } from '../config/database';
import { UserRole } from '../models';
import { AppError } from '../errors/AppError';

// Extend Express Request to carry authenticated user
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: UserRole;
  };
}

// Create a shared authService instance for middleware use
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);

/**
 * authenticate — Verifies JWT token and attaches user to request.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = authService.verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * authorize — Role-based access control middleware.
 * Factory function that returns a middleware enforcing allowed roles.
 * Demonstrates the Factory Pattern for middleware creation.
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden(`Access denied. Required roles: ${roles.join(', ')}`));
    }
    next();
  };
};
