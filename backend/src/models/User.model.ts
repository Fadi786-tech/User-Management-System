
import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types';
import { 
  encryptPassword, 
  decryptPassword, 
  isBcryptHash 
} from '../utils/encryption';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'Admin', 'User'],
      default: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// ⚠️ INSECURE: Encrypt password before saving (reversible!)
// For DEMO purposes only
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // ⚠️ WARNING: Using encryption instead of hashing
    this.password = encryptPassword(this.password);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
// Supports both encrypted passwords (new) and bcrypt hashes (old) for migration
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    // Check if it's an old bcrypt hash
    if (isBcryptHash(this.password)) {
      return bcrypt.compare(candidatePassword, this.password);
    }
    
    // ⚠️ INSECURE: Decrypt and compare
    const decrypted = decryptPassword(this.password);
    return candidatePassword === decrypted;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// ⚠️ INSECURE: Method to get decrypted password
// For DEMO purposes only - NEVER do this in production!
userSchema.methods.getDecryptedPassword = function (): string {
  try {
    if (isBcryptHash(this.password)) {
      return '[BCRYPT HASH - Cannot decrypt]';
    }
    return decryptPassword(this.password);
  } catch (error) {
    console.error('Decryption error:', error);
    return '[ERROR: Cannot decrypt]';
  }
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;

