import { Router } from 'express';
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  getUserPassword,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.get('/users', authenticate, authorizeRoles('SuperAdmin', 'Admin'), getAllUsers);
router.put('/update/:id', authenticate, updateUser);
router.delete(
  '/delete/:id',
  authenticate,
  authorizeRoles('SuperAdmin'),
  deleteUser
);

router.get('/password/:id', authenticate, getUserPassword);

export default router;

