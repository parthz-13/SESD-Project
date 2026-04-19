import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { StatusCodes } from 'http-status-codes';

/**
 * AuthController — Handles HTTP requests for auth endpoints.
 * Delegates all logic to AuthService (MVC pattern).
 */
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Account created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(StatusCodes.OK).json({
        success: true,
        data: (req as Request & { user?: unknown }).user,
      });
    } catch (error) {
      next(error);
    }
  };
}
