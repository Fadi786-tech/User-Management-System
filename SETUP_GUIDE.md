# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

Open two terminal windows - one for backend, one for frontend.

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Setup MongoDB

#### Option A: Local MongoDB
Make sure MongoDB is installed and running on your machine.

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace in backend `.env` file

### Step 3: Configure Environment Variables

**Backend:**
```bash
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user_management_system
JWT_SECRET=supersecretkey123!@#
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend (Optional):**
```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in X ms
➜  Local:   http://localhost:3000/
```

### Step 5: Create Your First User

1. Open browser at `http://localhost:3000`
2. Click "Register"
3. Fill in the form:
   - Name: Super Admin
   - Email: admin@example.com
   - Password: Admin@123
   - Confirm Password: Admin@123
4. Click "Create Account"

### Step 6: Make First User a SuperAdmin (Manual)

Since role selection isn't exposed in the UI for security, you need to manually update the first user to SuperAdmin.

#### Method 1: Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `user_management_system`
4. Select collection: `users`
5. Find your user and click Edit
6. Change `role` field to `"SuperAdmin"`
7. Click Update

#### Method 2: Using MongoDB Shell
```bash
mongosh

use user_management_system

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "SuperAdmin" } }
)
```

#### Method 3: Using API Tool (Postman/cURL)
You can also create a SuperAdmin directly via API:

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "role": "SuperAdmin"
  }'
```

### Step 7: Login as SuperAdmin

1. Logout (if logged in)
2. Login with your SuperAdmin credentials
3. You'll now see "Users" menu in the navbar
4. Click "Users" to manage all users

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected successfully
- [ ] Successfully registered a user
- [ ] Successfully logged in
- [ ] Can view dashboard
- [ ] SuperAdmin can access Users page
- [ ] Can create/edit/delete users (SuperAdmin)

## 🐛 Common Issues

### Port Already in Use
```bash
# Change backend port in backend/.env
PORT=5001

# Update frontend .env
VITE_API_URL=http://localhost:5001/api
```

### MongoDB Connection Failed
```
Error: MongoDB not connected
```

**Solution:**
- Check if MongoDB is running: `sudo systemctl status mongod`
- Start MongoDB: `sudo systemctl start mongod`
- Or use MongoDB Atlas connection string

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Ensure backend is running before frontend
- Check `VITE_API_URL` in frontend matches backend URL

### Token Invalid/Expired
**Solution:**
- Clear browser localStorage
- Logout and login again

### Dependencies Not Installing
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## 📚 Next Steps

1. **Customize Validation**: Edit `backend/src/validations/user.validation.ts`
2. **Add More Features**: Add profile pictures, email verification, etc.
3. **Deploy**: Deploy to Vercel (frontend) and Railway/Render (backend)
4. **Add Tests**: Write unit and integration tests

## 🎯 Testing User Roles

Create test users with different roles:

1. **SuperAdmin** (via API or DB): Full access
2. **Admin**: Can update users
3. **User**: Can only view/edit own profile

Login with each to see different permissions.

## 💡 Tips

- Use **MongoDB Compass** for easy database visualization
- Use **Postman** or **Thunder Client** for API testing
- Install **React DevTools** for debugging frontend
- Check browser console for errors
- Check terminal logs for backend errors

## 🔗 Useful Links

- [MongoDB Installation](https://docs.mongodb.com/manual/installation/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Node.js Downloads](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/)

---

Need help? Check the main [README.md](./README.md) for detailed documentation.

