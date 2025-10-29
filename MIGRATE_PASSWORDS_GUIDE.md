# Password Migration Guide

## Why Migration Is Needed

If you see `[BCRYPT HASH - Cannot decrypt]` when clicking the eye button, it means your existing users have old bcrypt-hashed passwords. These need to be converted to the new encrypted format.

## How to Migrate

### Step 1: Stop Your Backend Server
If your backend is running, stop it first (Ctrl+C).

### Step 2: Run the Migration Script

```bash
cd backend
npm run migrate-passwords
```

### Step 3: Migration Output

You'll see output like:
```
═══════════════════════════════════════════
Password Migration Script
═══════════════════════════════════════════
Default password: Password123!
═══════════════════════════════════════════

Connecting to MongoDB...
Connected to MongoDB successfully!

Found 3 users in database

Migrating user: admin@example.com (SuperAdmin)
  ✓ Password reset to: Password123!

Migrating user: user@example.com (User)
  ✓ Password reset to: Password123!

═══════════════════════════════════════════
Migration Complete!
═══════════════════════════════════════════
Total users: 3
Migrated: 2
Already encrypted: 1
═══════════════════════════════════════════

⚠️  IMPORTANT: Notify the following users that their password is now: Password123!
They should change it immediately after logging in.

  - admin@example.com (SuperAdmin)
  - user@example.com (User)

Disconnected from MongoDB
```

### Step 4: Notify Your Users

All migrated users now have the password: **Password123!**

Tell them to:
1. Login with: `Password123!`
2. Go to Dashboard → Edit Profile
3. Change their password immediately

### Step 5: Restart Your Backend

```bash
npm run dev
```

### Step 6: Test the Eye Button

1. Login to your application
2. Go to Dashboard
3. Click the eye button next to "Password"
4. Your password should now be visible!

## What the Migration Does

- Finds all users with bcrypt-hashed passwords
- Resets their password to: `Password123!`
- Encrypts the new password using AES-256
- Now the eye button can decrypt and show the password

## Customizing the Default Password

If you want a different default password, edit:

**File:** `backend/src/scripts/migrate-passwords.ts`

**Line 11:**
```typescript
const DEFAULT_PASSWORD = 'Password123!';  // Change this
```

Then run the migration again.

## Re-running the Migration

The script is safe to run multiple times. It will:
- Skip users who are already encrypted
- Only migrate users with bcrypt hashes
- Show you exactly what it's doing

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your `.env` file has the correct `MONGODB_URI`
- Make sure MongoDB is running

### "No users found"
- Your database might be empty
- Create users first, then migrate

### Still seeing bcrypt error after migration?
- Make sure you restarted the backend
- Try logging out and logging back in
- Check the migration output to confirm users were migrated

## Important Notes

1. **All migrated users get the same password:** `Password123!`
2. **Users should change it immediately** after logging in
3. **The migration is irreversible** - old bcrypt hashes are replaced
4. **Keep the migration script** for future users with bcrypt hashes

## For New Users

Any users created AFTER the code changes will automatically have encrypted passwords. They won't need migration.

---

**After migration, the eye button will work perfectly!** 👁️

