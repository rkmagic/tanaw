import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import pool from '../config/database';

export type UserRole = 'candidate' | 'agency' | 'employer' | 'admin';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: UserRole;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid;

      const roleResult = await pool.query<{ role: UserRole }>(
        'SELECT role FROM accounts WHERE user_id = $1',
        [decodedToken.uid]
      );
      if (roleResult.rows[0]) {
        req.role = roleResult.rows[0].role;
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!req.role || !allowedRoles.includes(req.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
