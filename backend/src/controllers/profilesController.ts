import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { validateProfileData } from '../utils/validation';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, user_id, full_name, birthday, gender, mobile_number, past_work_experience, educational_background, desired_job, desired_country, created_at, updated_at FROM profiles WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = result.rows[0];
    
    // If user is viewing their own profile, include mobile_number and birthday
    // Otherwise, exclude sensitive fields for public view
    if (req.userId && profile.user_id === req.userId) {
      res.json(profile);
    } else {
      // Public view - exclude sensitive fields
      const { mobile_number, birthday, ...publicProfile } = profile;
      res.json(publicProfile);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const createProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validation = validateProfileData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const {
      full_name,
      birthday,
      gender,
      mobile_number,
      past_work_experience,
      educational_background,
      desired_job,
      desired_country,
    } = req.body;

    // Check if profile already exists
    const existing = await pool.query(
      'SELECT id FROM profiles WHERE user_id = $1',
      [req.userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Profile already exists' });
    }

    const result = await pool.query(
      `INSERT INTO profiles (
        user_id, full_name, birthday, gender, mobile_number,
        past_work_experience, educational_background, desired_job, desired_country
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        req.userId,
        full_name,
        birthday || null,
        gender || null,
        mobile_number || null,
        past_work_experience || null,
        educational_background || null,
        desired_job || null,
        desired_country || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating profile:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Profile already exists for this user' });
    }
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validation = validateProfileData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const {
      full_name,
      birthday,
      gender,
      mobile_number,
      past_work_experience,
      educational_background,
      desired_job,
      desired_country,
    } = req.body;

    const result = await pool.query(
      `UPDATE profiles SET
        full_name = COALESCE($1, full_name),
        birthday = COALESCE($2, birthday),
        gender = COALESCE($3, gender),
        mobile_number = COALESCE($4, mobile_number),
        past_work_experience = COALESCE($5, past_work_experience),
        educational_background = COALESCE($6, educational_background),
        desired_job = COALESCE($7, desired_job),
        desired_country = COALESCE($8, desired_country),
        updated_at = now()
      WHERE user_id = $9
      RETURNING *`,
      [
        full_name,
        birthday,
        gender,
        mobile_number,
        past_work_experience,
        educational_background,
        desired_job,
        desired_country,
        req.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
