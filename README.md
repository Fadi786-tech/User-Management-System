# 🔐 User Management System (TypeScript + MongoDB)

A full-stack **User Management System** built using **TypeScript**, **Express.js**, **React**, and **MongoDB**, featuring:
- ✅ CRUD operations (Create, Read, Update, Delete)
- 🔑 JWT Authentication & Role-Based Authorization
- 🧩 Input Validation using **Zod**
- 👤 Roles: SuperAdmin, Admin, User
- 🧠 Secure password hashing with bcrypt
- 💾 MongoDB Atlas integration
- ⚡ Full TypeScript support (Frontend + Backend)
- 🎨 Modern UI with loading & error states

---

## 🏗️ Tech Stack

**Frontend:**
- React (TypeScript)
- Axios for API calls
- React Router
- Zod for form validation

**Backend:**
- Node.js + Express (TypeScript)
- JWT for authentication
- MongoDB with Mongoose ODM
- bcrypt for password encryption

---

## ⚙️ Features by Role

| Role        | Register | Login | Update | Delete | View All Users |
|--------------|-----------|--------|---------|---------|----------------|
| SuperAdmin  | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin       | ✅ | ✅ | ✅ | ❌ | ✅ |
| User        | ✅ | ✅ | ✅ (Own profile) | ❌ | ❌ |

---
# Create Initial SuperAdmin

## Using cURL (Windows PowerShell)

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/register" -Method POST -ContentType "application/json" -Body '{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "Admin@123456",
  "role": "SuperAdmin"
}'
```

## Using cURL (Command Prompt / Git Bash)

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Super Admin\",\"email\":\"admin@example.com\",\"password\":\"Admin@123456\",\"role\":\"SuperAdmin\"}"
```

## Using Postman / Thunder Client / Insomnia

**Method:** POST  
**URL:** `http://localhost:5000/api/register`  
**Headers:**
- Content-Type: `application/json`

**Body (raw JSON):**
```json
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "Admin@123456",
  "role": "SuperAdmin"
}
```

## After Registration

You'll receive a response like:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "Super Admin",
      "email": "admin@example.com",
      "role": "SuperAdmin",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

## Login Credentials

After creating the SuperAdmin, use these credentials to login:

**Email:** `admin@example.com`  
**Password:** `Admin@123456`

## Important Notes

⚠️ **Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

💡 **Security Tip:** Change the default password after first login!

## Available Roles

- `SuperAdmin` - Full access (can manage all users, delete users, change roles)
- `Admin` - Can update users
- `User` - Basic user access (can only update own profile)


---

## 🔧 Environment Variables

Create a `.env` file in your backend folder and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
---

## 🚀 Installation

1️⃣ Clone the repository
```
git clone https://github.com/your-username/user-management-system.git
cd user-management-system
```

2️⃣ Backend Setup
```
cd backend
npm install
npm run dev
```
3️⃣ Frontend Setup
```
cd frontend
npm install
npm start
```
---

## 🧩 Folder Structure
```
user-management-system/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.ts
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── context/
    │   └── App.tsx
```
---

## 🧪 Validation Example (Zod)
```
import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
```
---

## 🛡️ License

This project is licensed under the MIT License.

---

## 💡 Author

Fahad Sohail
Full-Stack Developer | TypeScript | Node.js | React
📧 sohail786fahad@gmail.com

