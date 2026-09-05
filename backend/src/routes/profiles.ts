import { Router } from 'express';
import {
  getProfile,
  getMyProfile,
  createProfile,
  updateProfile,
} from '../controllers/profilesController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Authenticated routes
router.get('/me', authenticate, getMyProfile);
router.post('/', authenticate, createProfile);
router.put('/me', authenticate, updateProfile);

// Public route - get profile by ID (for shareable links)
// NOTE: must be registered after the '/me' routes so that 'me' is not treated as an ID
router.get('/:id', getProfile);

export default router;
