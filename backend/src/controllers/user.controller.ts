import { Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User.model';
import { generateToken } from '../utils/token';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from '../validations/user.validation';
import { ZodError } from 'zod';

// Register new user
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate input with Zod
    const validatedData = registerSchema.parse(req.body);

    // Security: Only authenticated Admin/SuperAdmin can assign roles
    // Public registration always creates "User" role
    let roleToAssign = validatedData.role || 'User';
    
    if (!req.user) {
      // Public registration - force role to be User
      roleToAssign = 'User';
    } else if (req.user.role === 'Admin') {
      // Admin can only create User and Admin roles
      if (roleToAssign === 'SuperAdmin') {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: 'Admin cannot create SuperAdmin accounts',
        });
        return;
      }
    }
    // SuperAdmin can create any role (no restriction needed)

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: 'User with this email already exists',
      });
      return;
    }

    // Create new user with determined role
    const user = await User.create({
      ...validatedData,
      role: roleToAssign,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

// Login user
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate input with Zod
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Login failed',
        error: 'Invalid email or password',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Login failed',
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

// Get all users (SuperAdmin only)
export const getAllUsers = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        count: users.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

// Update user
export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    // Check if user is updating their own profile or is an Admin/SuperAdmin
    if (
      req.user?.userId !== id &&
      req.user?.role !== 'Admin' &&
      req.user?.role !== 'SuperAdmin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'You can only update your own profile',
      });
      return;
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Update failed',
        error: 'User not found',
      });
      return;
    }

    // Permission checks for editing other users
    if (req.user?.userId !== id) {
      // Admin cannot edit SuperAdmin users
      if (req.user?.role === 'Admin' && user.role === 'SuperAdmin') {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: 'Admin cannot modify SuperAdmin accounts',
        });
        return;
      }

      // Admin cannot edit other Admin users
      if (req.user?.role === 'Admin' && user.role === 'Admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: 'Admin can only modify User accounts',
        });
        return;
      }

      // Only SuperAdmin can edit Admin users
      // Only SuperAdmin and Admin can edit User accounts
    }

    // Check if email is being changed and if it's already taken
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Update failed',
          error: 'Email is already in use',
        });
        return;
      }
    }

    // Role change restrictions
    if (validatedData.role) {
      // Only Admin and SuperAdmin can change roles
      if (req.user?.role !== 'Admin' && req.user?.role !== 'SuperAdmin') {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: 'Only Admin and SuperAdmin can change user roles',
        });
        return;
      }

      // Admin cannot assign SuperAdmin role
      if (req.user?.role === 'Admin' && validatedData.role === 'SuperAdmin') {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: 'Admin cannot assign SuperAdmin role',
        });
        return;
      }
    }

    // Update user fields
    if (validatedData.name) user.name = validatedData.name;
    if (validatedData.email) user.email = validatedData.email;
    if (validatedData.password) user.password = validatedData.password;
    if (validatedData.role) user.role = validatedData.role;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Update failed',
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

// Delete user (SuperAdmin only)
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Delete failed',
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        deletedUser: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

// Get current user profile
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'User does not exist',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

/**
 * ⚠️⚠️⚠️ INSECURE ENDPOINT ⚠️⚠️⚠️
 * Get decrypted password for a user
 * For DEMO purposes ONLY - NEVER use in production!
 * 
 * Permissions:
 * - User can view their own password
 * - Admin can view User passwords
 * - SuperAdmin can view all passwords
 */
export const getUserPassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find user with password
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'User does not exist',
      });
      return;
    }

    // Permission checks
    const isOwnPassword = req.user?.userId === id;
    const isSuperAdmin = req.user?.role === 'SuperAdmin';
    const isAdminViewingUser = req.user?.role === 'Admin' && user.role === 'User';

    if (!isOwnPassword && !isSuperAdmin && !isAdminViewingUser) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'You do not have permission to view this password',
      });
      return;
    }

    // ⚠️ INSECURE: Decrypt and send password
    const decryptedPassword = user.getDecryptedPassword();

    res.status(200).json({
      success: true,
      message: 'Password retrieved successfully',
      data: { 
        password: decryptedPassword,
        warning: '⚠️ This is insecure and for DEMO purposes only!'
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve password',
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

