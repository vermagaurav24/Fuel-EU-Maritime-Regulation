import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../config/constants';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};