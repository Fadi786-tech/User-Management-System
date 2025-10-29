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

