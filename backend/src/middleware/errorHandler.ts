import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Handle database errors
  if (err.message.includes('violates')) {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }

  // Handle validation errors
  if (err.message.includes('must be')) {
    return res.status(400).json({ error: err.message });
  }

  // Default error
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
