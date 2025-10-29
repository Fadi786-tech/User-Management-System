# 🚀 Deployment Guide

This guide will help you deploy the User Management System to **Vercel** (Backend) and **Netlify** (Frontend).

---

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ GitHub account
- ✅ Vercel account (free): https://vercel.com
- ✅ Netlify account (free): https://netlify.com
- ✅ MongoDB Atlas account (free): https://mongodb.com/atlas
- ✅ Your project pushed to GitHub

---

## 🗄️ Step 1: Set Up MongoDB Atlas (If not done)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster (Free M0 tier)

### 1.2 Configure Network Access
1. Go to **Network Access** in MongoDB Atlas
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### 1.3 Create Database User
1. Go to **Database Access**
2. Click **Add New Database User**
3. Create username and password (save these!)
4. Set role to **Read and write to any database**
5. Click **Add User**

### 1.4 Get Connection String
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `user_management_system`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/user_management_system?retryWrites=true&w=majority
```

---

## 🔧 Step 2: Deploy Backend to Vercel

### 2.1 Push to GitHub (Already Done ✅)
Your code is already on GitHub at:
```
https://github.com/Fadi786-tech/User-Management-System.git
```

### 2.2 Import to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click **Add New** → **Project**

2. **Import Repository**
   - Click **Import Git Repository**
   - Select your GitHub repository: `User-Management-System`
   - Click **Import**

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: Click **Edit** and select `backend`
   - **Build Command**: Leave empty or use `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click **Environment Variables** and add:

   ```
   MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/user_management_system?retryWrites=true&w=majority
   JWT_SECRET = your_super_secret_jwt_key_minimum_32_characters_long
   JWT_EXPIRES_IN = 7d
   NODE_ENV = production
   ENCRYPTION_KEY = your-encryption-key-must-be-32-characters-long-exactly
   PORT = 5000
   ```

   **Important**: 
   - Replace MongoDB URI with your actual connection string
   - Use a strong JWT_SECRET (generate at https://randomkeygen.com)
   - ENCRYPTION_KEY must be exactly 32 characters

5. **Deploy**
   - Click **Deploy**
   - Wait for deployment to complete (2-3 minutes)
   - Copy your deployment URL (e.g., `https://your-app.vercel.app`)

### 2.3 Test Backend Deployment

Visit your Vercel URL + `/api/` (e.g., `https://your-app.vercel.app/api/`)

You should see a response or 404 (that's okay, it means backend is running).

Test with registration:
```bash
curl -X POST https://your-app.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123456","role":"User"}'
```

---

## 🎨 Step 3: Deploy Frontend to Netlify

### 3.1 Update Frontend API URL

Before deploying, update the frontend to use your Vercel backend URL.

**Option A: Using Environment Variable (Recommended)**

1. The frontend already uses `VITE_API_URL` from `.env`
2. We'll set this in Netlify environment variables

**Option B: Hardcode (Not Recommended)**

Edit `frontend/src/services/api.ts`:
```typescript
const API_URL = 'https://your-vercel-url.vercel.app/api';
```

### 3.2 Import to Netlify

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Click **Add new site** → **Import an existing project**

2. **Connect to Git Provider**
   - Choose **GitHub**
   - Authorize Netlify to access your repositories
   - Select your repository: `User-Management-System`

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - Click **Show advanced** → **New variable**

4. **Add Environment Variables**
   Click **Add environment variables** and add:

   ```
   VITE_API_URL = https://your-vercel-backend-url.vercel.app/api
   ```

   Replace with your actual Vercel backend URL from Step 2.

5. **Deploy**
   - Click **Deploy site**
   - Wait for deployment (2-3 minutes)
   - Netlify will give you a random URL like `https://random-name-123456.netlify.app`

### 3.3 Custom Domain (Optional)

1. Click **Domain settings**
2. Click **Options** → **Edit site name**
3. Change to something memorable like `user-management-system`
4. Your URL becomes: `https://user-management-system.netlify.app`

---

## 🔄 Step 4: Update CORS Settings

After deploying frontend, update backend CORS settings:

### 4.1 Update Backend Code

Edit `backend/src/server.ts` and update CORS origin:

```typescript
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://your-frontend-url.netlify.app'  // Add this
    ],
    credentials: true,
  })
);
```

### 4.2 Redeploy Backend

1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push origin main
   ```

2. Vercel will automatically redeploy

---

## 🧪 Step 5: Test Your Deployed App

### 5.1 Open Your Frontend
Visit your Netlify URL: `https://your-app.netlify.app`

### 5.2 Register a SuperAdmin

1. Click **Register**
2. Fill in details:
   - Name: Super Admin
   - Email: admin@example.com
   - Password: Admin@123456
3. Click **Create Account**

### 5.3 Test Features

1. **Login** with your credentials
2. **Dashboard** - View your profile, click eye button to see password
3. **User Management** - View users, see passwords with eye buttons
4. **Create User** - Add new users
5. **Edit User** - Update user details
6. **Delete User** - Remove users (SuperAdmin only)

---

## 📊 Environment Variables Summary

### Backend (Vercel)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_32_char_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=production
ENCRYPTION_KEY=must_be_exactly_32_characters
PORT=5000
```

### Frontend (Netlify)
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Deployment fails
- **Solution**: Check Vercel build logs, ensure all dependencies are in `package.json`

**Problem**: MongoDB connection error
- **Solution**: Check MongoDB Atlas IP whitelist, verify connection string

**Problem**: 500 Internal Server Error
- **Solution**: Check Vercel function logs, verify environment variables

### Frontend Issues

**Problem**: API calls fail
- **Solution**: Check VITE_API_URL is correct, verify CORS settings

**Problem**: Build fails
- **Solution**: Check Netlify build logs, ensure `npm run build` works locally

**Problem**: Blank page after deployment
- **Solution**: Check browser console, verify API URL, check redirects in netlify.toml

### CORS Issues

**Problem**: CORS errors in browser console
- **Solution**: Add frontend URL to backend CORS origins, redeploy backend

---

## 🔄 Continuous Deployment

Both Vercel and Netlify support automatic deployments:

1. **Push to GitHub main branch**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment**
   - Vercel automatically redeploys backend
   - Netlify automatically redeploys frontend

3. **Monitor Deployments**
   - Vercel Dashboard: https://vercel.com/dashboard
   - Netlify Dashboard: https://app.netlify.com

---

## 📱 Post-Deployment Checklist

- [ ] Backend deployed successfully to Vercel
- [ ] Frontend deployed successfully to Netlify
- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables set correctly
- [ ] CORS settings updated
- [ ] SuperAdmin account created
- [ ] All features tested (login, register, CRUD, password viewing)
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled (automatic on both platforms)

---

## 🎉 You're Live!

**Backend URL**: `https://your-backend.vercel.app`  
**Frontend URL**: `https://your-frontend.netlify.app`

### Share Your App
Share the frontend URL with users. They can:
- Register accounts
- Login and manage profiles
- View their passwords
- Admins can manage users

---

## 🔐 Security Recommendations

1. **Change Default Passwords**: After first login, change all default passwords
2. **Limit SuperAdmin Accounts**: Only create SuperAdmin accounts when necessary
3. **Use Strong JWT Secret**: Generate a cryptographically secure secret
4. **Enable 2FA on MongoDB**: Add extra security to your database
5. **Monitor Logs**: Regularly check Vercel and Netlify logs for suspicious activity

---

## 💰 Costs

Both deployments are **FREE** on the free tiers:

- **Vercel Free**: 100GB bandwidth, 100 deployments/day
- **Netlify Free**: 100GB bandwidth, 300 build minutes/month
- **MongoDB Atlas Free**: 512MB storage, shared cluster

Perfect for personal projects and demos!

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

**Need Help?**  
Check the troubleshooting section or open an issue on GitHub.

**Happy Deploying! 🚀**

