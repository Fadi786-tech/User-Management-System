import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

export const generateToken = (userId: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ userId, role }, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret);
};

