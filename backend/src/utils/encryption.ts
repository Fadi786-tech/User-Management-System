/**
 * ⚠️ SECURITY WARNING ⚠️
 * 
 * This file implements REVERSIBLE password encryption.
 * This is EXTREMELY INSECURE and should NEVER be used in production.
 * 
 * This is for DEMO/LEARNING purposes ONLY.
 * 
 * In production, ALWAYS use one-way hashing (bcrypt, argon2, etc.)
 * NEVER store passwords in a way they can be decrypted.
 */

import crypto from 'crypto';

// ⚠️ WARNING: In production, this should be in environment variables
// For demo purposes, using a fixed key (NEVER do this in production!)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'demo-key-32-chars-long-12345';
const ALGORITHM = 'aes-256-cbc';

// Ensure key is 32 bytes
const KEY = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

/**
 * ⚠️ INSECURE: Encrypts password (reversible)
 * For DEMO purposes only
 */
export const encryptPassword = (password: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Store IV with encrypted data (separated by :)
  return iv.toString('hex') + ':' + encrypted;
};

/**
 * ⚠️ INSECURE: Decrypts password
 * For DEMO purposes only
 */
export const decryptPassword = (encryptedPassword: string): string => {
  try {
    const parts = encryptedPassword.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

/**
 * For backwards compatibility during migration
 * Checks if password is bcrypt hashed or encrypted
 */
export const isEncrypted = (password: string): boolean => {
  // Encrypted passwords have the format: iv:encrypted (both hex)
  return password.includes(':') && password.split(':').length === 2;
};

/**
 * For backwards compatibility during migration
 * Checks if password is bcrypt hashed
 */
export const isBcryptHash = (password: string): boolean => {
  return password.startsWith('$2a$') || password.startsWith('$2b$');
};

