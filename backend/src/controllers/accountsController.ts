import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest, UserRole } from '../middleware/auth';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query<{ user_id: string; role: UserRole }>(
      'SELECT user_id, role FROM accounts WHERE user_id = $1',
      [req.userId]
    );

    let role: UserRole = 'candidate';
    if (result.rows[0]) {
      role = result.rows[0].role;
    } else {
      await pool.query(
        'INSERT INTO accounts (user_id, role) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
        [req.userId, 'candidate']
      );
    }

    res.json({ user_id: req.userId, role });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
};
