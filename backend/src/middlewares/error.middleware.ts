import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Global error handling middleware.
 * Distinguishes between operational errors (AppError) and programming errors.
 * Must have 4 parameters to be recognized as error middleware by Express.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  console.error(`[Error] ${req.method} ${req.path} →`, err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
    return;
  }

  // Prisma unique constraint violation
  if ((err as { code?: string }).code === 'P2002') {
    res.status(409).json({
      success: false,
      error: { message: 'A record with this value already exists', statusCode: 409 },
    });
    return;
  }

  // Prisma record not found
  if ((err as { code?: string }).code === 'P2025') {
    res.status(404).json({
      success: false,
      error: { message: 'Record not found', statusCode: 404 },
    });
    return;
  }

  // Unknown / programming errors
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    success: false,
    error: {
      message: isDev ? err.message : 'Internal Server Error',
      statusCode: 500,
      ...(isDev && { stack: err.stack }),
    },
  });
};

/**
 * 404 handler for unmatched routes.
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.method} ${req.path} not found`, statusCode: 404 },
  });
};
