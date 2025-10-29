/**
 * Migration Script: Convert Bcrypt Hashes to Encrypted Passwords
 * 
 * This script sets a default password for all users with bcrypt hashes
 * so they can be viewed through the eye button feature.
 * 
 * Default password: "Password123!"
 * 
 * IMPORTANT: Tell all users their passwords have been reset to: Password123!
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.model';
import { isBcryptHash } from '../utils/encryption';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DEFAULT_PASSWORD = 'Password123!';

async function migratePasswords() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-management';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!\n');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database\n`);

    let migratedCount = 0;
    let alreadyEncryptedCount = 0;

    for (const user of users) {
      if (isBcryptHash(user.password)) {
        console.log(`Migrating user: ${user.email} (${user.role})`);
        
        // Set the default password
        user.password = DEFAULT_PASSWORD;
        await user.save();
        
        migratedCount++;
        console.log(`  ✓ Password reset to: ${DEFAULT_PASSWORD}\n`);
      } else {
        console.log(`Skipping user: ${user.email} (already encrypted)\n`);
        alreadyEncryptedCount++;
      }
    }

    console.log('═══════════════════════════════════════════');
    console.log('Migration Complete!');
    console.log('═══════════════════════════════════════════');
    console.log(`Total users: ${users.length}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Already encrypted: ${alreadyEncryptedCount}`);
    console.log('═══════════════════════════════════════════\n');

    if (migratedCount > 0) {
      console.log('⚠️  IMPORTANT: Notify the following users that their password is now: Password123!');
      console.log('They should change it immediately after logging in.\n');
      
      const migratedUsers = await User.find({});
      for (const user of migratedUsers) {
        if (!isBcryptHash(user.password)) {
          console.log(`  - ${user.email} (${user.role})`);
        }
      }
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run migration
console.log('═══════════════════════════════════════════');
console.log('Password Migration Script');
console.log('═══════════════════════════════════════════');
console.log(`Default password: ${DEFAULT_PASSWORD}`);
console.log('═══════════════════════════════════════════\n');

migratePasswords();

