# User Management System

A complete full-stack application built with **TypeScript**, **React**, **Express**, and **MongoDB** featuring user authentication, role-based access control, and a modern UI.

## 🚀 Features

- ✅ **Full TypeScript Implementation** - Both frontend and backend
- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - SuperAdmin, Admin, and User roles
- ✨ **Zod Schema Validation** - Robust input validation on backend
- 🎨 **Modern UI with Tailwind CSS** - Responsive and beautiful design
- 📝 **CRUD Operations** - Complete user management
- ⚡ **Loading & Error States** - Enhanced UX with proper feedback
- 🔔 **Toast Notifications** - Real-time user feedback
- 🛡️ **Protected Routes** - Secure route access based on authentication
- 👁️ **Viewable Passwords** - Eye button to view passwords (demo feature)

## 🏗️ Project Structure

```
User-Management-System-ts/
├── backend/                  # Express + TypeScript backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & role middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── validations/     # Zod validation schemas
│   │   ├── scripts/         # Migration scripts
│   │   └── server.ts        # Express server entry
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # React + TypeScript frontend
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # Auth context
    │   ├── pages/           # Page components
    │   ├── services/        # API service layer
    │   ├── types/           # TypeScript interfaces
    │   ├── utils/           # Validation utilities
    │   ├── App.tsx          # Main app component
    │   └── main.tsx         # Entry point
    ├── package.json
    └── tsconfig.json
```

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **AES-256** - Password encryption (demo feature)
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **jwt-decode** - JWT token decoding

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Fadi786-tech/User-Management-System.git
cd User-Management-System-ts
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Update .env with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/user_management_system
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# JWT_EXPIRES_IN=7d
# NODE_ENV=development

# Run in development mode
npm run dev

# Or build and run in production
npm run build
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Run in development mode
npm run dev

# Or build for production
npm run build
npm run preview
```

The frontend will start on `http://localhost:5173`

### 4. Password Migration (Important!)

If you're upgrading from an older version, run the password migration:

```bash
cd backend
npm run migrate-passwords
```

This converts old bcrypt passwords to the viewable format. All migrated users will have password: `Password123!`

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user_management_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
ENCRYPTION_KEY=your-encryption-key-32-chars
```

### Frontend (.env) - Optional

```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |

### Protected Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/me` | Get current user | Authenticated |
| GET | `/api/users` | Get all users | Admin/SuperAdmin |
| GET | `/api/password/:id` | Get user password | User (own)/Admin/SuperAdmin |
| PUT | `/api/update/:id` | Update user | Owner/Admin/SuperAdmin |
| DELETE | `/api/delete/:id` | Delete user | SuperAdmin |

## 🔐 Validation Rules

### Email
- Must be a valid email format

### Password
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### Name
- Minimum 3 characters

### Role
- Must be one of: `SuperAdmin`, `Admin`, `User`

## 👥 User Roles & Permissions

### 1. SuperAdmin
- Full access to all features
- Can view/edit/delete all users
- Can view all passwords
- Can change any user's role
- Can create SuperAdmin accounts

### 2. Admin
- Can view all users
- Can edit User accounts (name, email, password)
- Can view User passwords
- Can create Admin and User accounts
- **Cannot** edit/view SuperAdmin or other Admin users

### 3. User
- Can view own profile
- Can edit own profile (name, email, password)
- Can view own password
- Basic access only

## 👁️ Password Viewing Feature

This system includes a viewable password feature (demo purposes):

- **Users** can see their own password via eye button on Dashboard
- **Admins** can see User passwords in the User Management table
- **SuperAdmins** can see all passwords in the User Management table

Click the eye icon (👁️) to reveal/hide passwords.

## 🎯 Usage

### 1. Create SuperAdmin (First Time)

Using Postman/Thunder Client:
```
POST http://localhost:5000/api/register
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "Admin@123456",
  "role": "SuperAdmin"
}
```

### 2. Login

Use your credentials to log in. You'll receive a JWT token stored in localStorage.

### 3. Dashboard

After login, you'll be redirected to your dashboard where you can:
- View your profile information
- See your password (click eye button)
- Edit your profile
- Update your password

### 4. User Management (Admin/SuperAdmin)

Admins and SuperAdmins can access the Users page to:
- View all registered users
- See user passwords (with eye button)
- Edit user details (name, email, password)
- Edit user roles
- Delete users (SuperAdmin only)

## 🚨 Error Handling

The application includes comprehensive error handling:
- **Frontend**: Loading states, error messages, and toast notifications
- **Backend**: Centralized error handling with consistent JSON responses
- **Validation**: Both client-side and server-side validation with Zod

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop
- Tablet
- Mobile devices

## 🧪 Development

### Backend Development

```bash
cd backend
npm run dev              # Run with nodemon (auto-reload)
npm run build            # Compile TypeScript
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run migrate-passwords # Migrate old passwords
```

### Frontend Development

```bash
cd frontend
npm run dev      # Run development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

## 📝 Scripts

### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run migrate-passwords` - Migrate bcrypt passwords to encrypted format

### Frontend Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check if the database name in the connection string is correct

### Port Already in Use
- Change the PORT in backend .env file
- Update VITE_API_URL in frontend .env accordingly

### CORS Errors
- Ensure backend is running before starting frontend
- Check CORS configuration in backend server.ts

### Authentication Issues
- Clear localStorage and try logging in again
- Check if JWT_SECRET is properly set in backend .env

### Password Shows "[BCRYPT HASH - Cannot decrypt]"
- Run the migration script: `npm run migrate-passwords`
- This converts old passwords to the new viewable format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Fahad Sohail**  
Full-Stack Developer | TypeScript | Node.js | React  
📧 sohail786fahad@gmail.com

Built with ❤️ using TypeScript, React, Express, and MongoDB

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- Zod for schema validation

---

**Happy Coding! 🚀**
