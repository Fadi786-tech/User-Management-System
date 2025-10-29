# ⚠️ SECURITY NOTICE - READ BEFORE USING ⚠️

## This System Contains CRITICAL SECURITY VULNERABILITIES

This User Management System has been modified to include **viewable passwords** - an **EXTREMELY INSECURE** feature that should **NEVER** be used in production.

---

## 🚨 FOR DEMO/LEARNING PURPOSES ONLY 🚨

This implementation is designed for:
- ✅ Educational purposes
- ✅ Learning about security vulnerabilities
- ✅ Understanding why certain practices are dangerous
- ✅ Local development/testing
- ✅ Demonstration projects

This implementation should **NEVER** be used for:
- ❌ Production applications
- ❌ Real user data
- ❌ Any sensitive information
- ❌ Public-facing systems
- ❌ Commercial projects
- ❌ Client work

---

## What Makes This Insecure?

### The Problem:
Passwords are stored using **reversible encryption** (AES-256) instead of **one-way hashing** (bcrypt). This means:

- Anyone with database access can decrypt passwords
- Passwords are transmitted over the network
- Admins can view user passwords in plain text
- Data breaches would expose ALL user passwords

### What You See:
```
Dashboard: Eye button shows YOUR password
User Management: Admins see passwords with eye buttons
```

### What You Should See (Secure System):
```
Dashboard: Change password option (never show current)
User Management: Reset password button (generate new, don't show old)
```

---

## Features in This System

### ✅ Secure Features (Safe to Use):
1. **User Authentication** - Login/Logout with JWT tokens
2. **Role-Based Access Control** - SuperAdmin, Admin, User roles
3. **User Management** - Create, edit, delete users
4. **Permission System** - Different access levels per role
5. **Form Validation** - Client and server-side validation
6. **Password Visibility Toggle (in forms)** - Shows typed passwords only

### ⚠️ INSECURE Features (DEMO ONLY):
1. **Viewable Stored Passwords** - Eye button shows actual database passwords
2. **Password Decryption Endpoint** - API that returns plain text passwords
3. **Reversible Encryption** - Passwords stored with AES instead of bcrypt

---

## Quick Start (For Demo/Learning)

### Prerequisites:
- Node.js 16+
- MongoDB
- npm or yarn

### Setup:

1. **Backend**:
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB connection
npm run dev
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

3. **Create SuperAdmin** (first user):
```bash
# See create-superadmin.md for instructions
POST /api/register
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "SecurePass123!"
}
# First user is auto-assigned SuperAdmin role
```

### Testing Viewable Passwords:

1. **Test as User** (view own password):
   - Login → Dashboard → Click eye button next to password

2. **Test as Admin** (view User passwords):
   - Login as Admin → User Management → Click eye buttons for Users

3. **Test as SuperAdmin** (view all passwords):
   - Login as SuperAdmin → User Management → Click eye buttons for everyone

---

## File Structure

```
User-Management-System-ts/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   │   └── User.model.ts ⚠️ Uses encryption
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   │   ├── encryption.ts ⚠️ INSECURE
│   │   │   └── token.ts
│   │   ├── validations/
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx ⚠️ Shows passwords
│   │   │   └── UserList.tsx ⚠️ Shows passwords
│   │   ├── services/
│   │   │   └── api.ts ⚠️ Has getUserPassword
│   │   └── types/
│   └── package.json
└── Documentation/
    ├── SECURITY_WARNING_VIEWABLE_PASSWORDS.md ⚠️ READ THIS
    ├── API_DOCUMENTATION.md
    ├── SETUP_GUIDE.md
    └── USER_EDIT_FEATURES.md
```

---

## Permission Matrix

### What Each Role Can Do:

| Feature | User | Admin | SuperAdmin |
|---------|------|-------|------------|
| View own password | ✅ | ✅ | ✅ |
| View User passwords | ❌ | ✅ | ✅ |
| View Admin passwords | ❌ | ❌ | ✅ |
| View SuperAdmin passwords | ❌ | ❌ | ✅ |
| Edit User accounts | ❌ | ✅ | ✅ |
| Edit Admin accounts | ❌ | ❌ | ✅ |
| Edit SuperAdmin accounts | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Create users | ❌ | ✅ | ✅ |
| Change roles | ❌ | ✅ (limited) | ✅ |

---

## How to Make This Secure

If you want to convert this to a production-ready system:

### Step 1: Remove Viewable Passwords

1. Delete `backend/src/utils/encryption.ts`
2. Restore bcrypt hashing in `backend/src/models/User.model.ts`
3. Remove `getUserPassword` from controller and routes
4. Remove password columns from frontend

### Step 2: Implement Secure Password Management

Instead of viewing passwords, implement:

```javascript
// Password Reset
async function resetUserPassword(userId) {
  const tempPassword = generateSecureRandom(12);
  await hashAndUpdatePassword(userId, tempPassword);
  await sendEmailToUser(userId, tempPassword);
  await flagForPasswordChange(userId);
}

// Password Change on Next Login
async function requirePasswordChange(userId) {
  await setFlag(userId, 'mustChangePassword', true);
  // Redirect to change password on next login
}
```

### Step 3: Use Environment Variables

```env
# .env
ENCRYPTION_KEY=your-secret-key-here  # Remove this
JWT_SECRET=your-jwt-secret           # Keep this
MONGODB_URI=your-mongodb-connection
```

### Step 4: Security Audit

- [ ] Remove all password decryption code
- [ ] Implement bcrypt or argon2
- [ ] Add password reset flow
- [ ] Remove insecure endpoints
- [ ] Update frontend UI
- [ ] Add rate limiting
- [ ] Implement HTTPS only
- [ ] Add security headers
- [ ] Enable CORS properly
- [ ] Add input sanitization

---

## Documentation Files

1. **SECURITY_WARNING_VIEWABLE_PASSWORDS.md** - Detailed security analysis
2. **API_DOCUMENTATION.md** - API endpoints and usage
3. **USER_EDIT_FEATURES.md** - User editing capabilities
4. **PASSWORD_VISIBILITY_FEATURES.md** - Password toggle in forms
5. **SETUP_GUIDE.md** - Installation instructions
6. **RECENT_FEATURES_SUMMARY.md** - Feature overview

---

## Common Questions

### Q: Can I use this for my school project?
**A:** Yes, but add a disclaimer that this is a demo and explain the security issues.

### Q: Can I deploy this to production?
**A:** **NO!** This would be a severe security violation. Remove insecure features first.

### Q: What if I need to help users who forgot passwords?
**A:** Implement a password reset feature that sends a reset link, not shows the old password.

### Q: Is the password toggle in forms insecure?
**A:** No, showing typed passwords (form toggle) is standard. Showing **stored** passwords is insecure.

### Q: How do I migrate to secure passwords?
**A:** Force all users to reset passwords, then update their passwords with bcrypt hashing.

---

## Legal Disclaimer

This software is provided "AS IS" for educational purposes. The developers assume NO responsibility for:
- Data breaches
- Password leaks
- Legal consequences
- Financial damages
- Reputational harm

By using this software, you acknowledge that you understand the security risks and will not use it in production without removing the insecure features.

---

## Support

For questions about secure password management:
- OWASP Password Storage Cheat Sheet
- Auth0 Security Best Practices
- NIST Password Guidelines

For questions about this demo:
- Read SECURITY_WARNING_VIEWABLE_PASSWORDS.md
- Check the code comments (marked with ⚠️)

---

## License

This is a demonstration project. Use at your own risk.

**⚠️ NOT SUITABLE FOR PRODUCTION USE WITHOUT MODIFICATIONS ⚠️**

---

**Last Updated**: October 29, 2025

**Remember**: Real security isn't optional. If you're building something real, **use bcrypt or argon2**, not reversible encryption!

