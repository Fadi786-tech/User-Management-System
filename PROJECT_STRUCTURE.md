# Project Structure Overview

## 📁 Complete File Structure

```
User-Management-System-ts/
│
├── backend/                           # Backend application
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── controllers/
│   │   │   └── user.controller.ts    # User CRUD controllers
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT authentication
│   │   │   └── role.middleware.ts    # Role-based authorization
│   │   ├── models/
│   │   │   └── User.model.ts         # Mongoose User model
│   │   ├── routes/
│   │   │   └── user.routes.ts        # API routes
│   │   ├── types/
│   │   │   └── index.d.ts            # TypeScript type definitions
│   │   ├── utils/
│   │   │   └── token.ts              # JWT utilities
│   │   ├── validations/
│   │   │   └── user.validation.ts    # Zod validation schemas
│   │   └── server.ts                 # Express server entry point
│   ├── .eslintrc.json                # ESLint configuration
│   ├── .gitignore                    # Git ignore rules
│   ├── .prettierrc                   # Prettier configuration
│   ├── env.example                   # Environment variables template
│   ├── package.json                  # Backend dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── frontend/                          # Frontend application
│   ├── public/
│   │   └── vite.svg                  # Vite logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.tsx      # Error display component
│   │   │   ├── FormInput.tsx         # Reusable form input
│   │   │   ├── Loader.tsx            # Loading spinner
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   └── ProtectedRoute.tsx    # Route protection HOC
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # User dashboard
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── Register.tsx          # Registration page
│   │   │   └── UserList.tsx          # User management (SuperAdmin)
│   │   ├── services/
│   │   │   └── api.ts                # Axios API service
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── validation.ts         # Client-side validation
│   │   ├── App.tsx                   # Main App component
│   │   ├── index.css                 # Global styles + Tailwind
│   │   ├── main.tsx                  # React entry point
│   │   └── vite-env.d.ts             # Vite environment types
│   ├── .eslintrc.cjs                 # ESLint configuration
│   ├── .gitignore                    # Git ignore rules
│   ├── .prettierrc                   # Prettier configuration
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.js             # PostCSS configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tsconfig.node.json            # TypeScript Node config
│   └── vite.config.ts                # Vite configuration
│
├── .gitignore                         # Root git ignore
├── API_DOCUMENTATION.md               # API documentation
├── README.md                          # Main documentation
├── SETUP_GUIDE.md                     # Quick setup guide
└── PROJECT_STRUCTURE.md               # This file
```

## 🎯 Key Features by File

### Backend Files

| File | Purpose | Key Features |
|------|---------|--------------|
| `server.ts` | Express server | CORS, JSON parsing, routes, error handling |
| `db.ts` | Database | MongoDB connection with error handling |
| `User.model.ts` | Data model | Mongoose schema, password hashing, validation |
| `user.controller.ts` | Business logic | Register, login, CRUD operations with error handling |
| `auth.middleware.ts` | Authentication | JWT token verification |
| `role.middleware.ts` | Authorization | Role-based access control |
| `user.routes.ts` | API routes | Route definitions with middleware |
| `user.validation.ts` | Validation | Zod schemas for input validation |
| `token.ts` | Utilities | JWT generation and verification |

### Frontend Files

| File | Purpose | Key Features |
|------|---------|--------------|
| `App.tsx` | Main component | Routing, auth provider, toast notifications |
| `AuthContext.tsx` | State management | Global auth state, login/logout/register |
| `Login.tsx` | Login page | Form with validation, loading states, error display |
| `Register.tsx` | Registration page | Multi-field validation, password requirements |
| `Dashboard.tsx` | User profile | View/edit profile, role display |
| `UserList.tsx` | Admin panel | User table, role editing, delete functionality |
| `ProtectedRoute.tsx` | Route guard | Auth check, role-based access |
| `Navbar.tsx` | Navigation | Dynamic menu based on auth/role |
| `FormInput.tsx` | Reusable input | Consistent styling, error display |
| `Loader.tsx` | Loading indicator | Configurable spinner sizes |
| `ErrorMessage.tsx` | Error display | Styled error messages with dismiss |
| `api.ts` | API calls | Axios instance with token injection |
| `validation.ts` | Client validation | Email, password, name validation |

## 🔄 Data Flow

### Registration Flow
```
User → Register.tsx → validation.ts → api.ts → 
Backend → user.validation.ts (Zod) → user.controller.ts → 
User.model.ts → MongoDB → JWT Token → 
api.ts → AuthContext → Dashboard.tsx
```

### Login Flow
```
User → Login.tsx → validation.ts → api.ts → 
Backend → user.validation.ts → user.controller.ts → 
Password verification → JWT Token → 
api.ts → AuthContext → Dashboard.tsx
```

### Protected Route Flow
```
User → Route → ProtectedRoute.tsx → 
Check AuthContext → Check user role → 
Allow/Deny access → Render component or redirect
```

### User Management Flow (SuperAdmin)
```
SuperAdmin → UserList.tsx → api.ts → 
auth.middleware.ts → role.middleware.ts → 
user.controller.ts → User.model.ts → MongoDB → 
Response → UserList.tsx (update UI)
```

## 🛡️ Security Layers

1. **Client-Side Validation** (`validation.ts`)
   - Email format
   - Password strength
   - Name length

2. **Server-Side Validation** (`user.validation.ts`)
   - Zod schema validation
   - Type checking
   - Business rules

3. **Authentication** (`auth.middleware.ts`)
   - JWT token verification
   - Token expiration check
   - User identification

4. **Authorization** (`role.middleware.ts`)
   - Role-based access control
   - Route protection
   - Permission checking

5. **Password Security** (`User.model.ts`)
   - Bcrypt hashing
   - Salt generation
   - Secure comparison

## 📦 Dependencies Overview

### Backend Dependencies
```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "bcrypt": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "zod": "Schema validation",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables"
}
```

### Frontend Dependencies
```json
{
  "react": "UI library",
  "react-router-dom": "Routing",
  "axios": "HTTP client",
  "react-hot-toast": "Notifications",
  "jwt-decode": "JWT decoding",
  "tailwindcss": "Styling"
}
```

## 🎨 UI Components Hierarchy

```
App
├── Navbar
└── Routes
    ├── Login
    │   ├── FormInput (x2)
    │   ├── ErrorMessage
    │   └── Loader
    ├── Register
    │   ├── FormInput (x4)
    │   ├── ErrorMessage
    │   └── Loader
    ├── Dashboard (Protected)
    │   ├── FormInput (x3)
    │   ├── ErrorMessage
    │   └── Loader
    └── UserList (Protected - SuperAdmin)
        ├── ErrorMessage
        ├── Loader
        └── User Table
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler options |
| `eslintrc.*` | Code linting rules |
| `.prettierrc` | Code formatting rules |
| `tailwind.config.js` | Tailwind CSS customization |
| `vite.config.ts` | Vite build configuration |
| `postcss.config.js` | PostCSS plugins |
| `.gitignore` | Git ignore patterns |

## 🌐 Environment Variables

### Backend (`.env`)
- `PORT` - Server port
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRES_IN` - Token expiration time
- `NODE_ENV` - Environment mode

### Frontend (`.env`)
- `VITE_API_URL` - Backend API URL

## 📊 Database Schema

```typescript
User {
  _id: ObjectId           // Auto-generated
  name: String            // Min 3 chars
  email: String           // Unique, valid email
  password: String        // Hashed with bcrypt
  role: String            // 'SuperAdmin' | 'Admin' | 'User'
  createdAt: Date         // Auto-generated
  updatedAt: Date         // Auto-updated
}
```

## 🚀 Scripts

### Backend
- `npm run dev` - Development with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Production server
- `npm run lint` - Lint code
- `npm run format` - Format code

### Frontend
- `npm run dev` - Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code

## 📝 Code Quality

- ✅ **TypeScript Strict Mode** - Full type safety
- ✅ **ESLint** - Code linting
- ✅ **Prettier** - Code formatting
- ✅ **Zod Validation** - Runtime type checking
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Loading States** - User feedback on all async operations
- ✅ **Responsive Design** - Mobile-first approach

## 🎓 Learning Resources

- **TypeScript**: Learn type safety and interfaces
- **React Context**: Global state management
- **JWT**: Token-based authentication
- **Mongoose**: MongoDB object modeling
- **Zod**: Schema validation
- **Tailwind CSS**: Utility-first CSS
- **Express Middleware**: Request/response pipeline

---

This structure follows industry best practices for separation of concerns, scalability, and maintainability.

