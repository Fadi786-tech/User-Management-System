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
- **Bcrypt** - Password hashing
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
git clone <repository-url>
cd User-Management-System-ts
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

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

The frontend will start on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user_management_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
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
| GET | `/api/users` | Get all users | SuperAdmin |
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

## 👥 User Roles

1. **SuperAdmin**
   - Full access to all features
   - Can view all users
   - Can delete any user
   - Can change user roles

2. **Admin**
   - Can update user profiles
   - Limited administrative access

3. **User**
   - Can view and edit own profile
   - Basic access

## 🎯 Usage

### 1. Register a New User

Navigate to the registration page and create an account with:
- Full name (min 3 characters)
- Valid email address
- Strong password (meeting all requirements)

### 2. Login

Use your credentials to log in. You'll receive a JWT token that's stored in localStorage.

### 3. Dashboard

After login, you'll be redirected to your dashboard where you can:
- View your profile information
- Edit your profile
- Update your password

### 4. User Management (SuperAdmin Only)

SuperAdmins can access the Users page to:
- View all registered users
- Edit user roles
- Delete users (except themselves)

## 🚨 Error Handling

The application includes comprehensive error handling:
- **Frontend**: Loading states, error messages, and toast notifications
- **Backend**: Centralized error handling with consistent JSON responses
- **Validation**: Both client-side and server-side validation with Zod

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes on frontend and backend
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop
- Tablet
- Mobile devices

## 🧪 Development

### Backend Development

```bash
cd backend
npm run dev      # Run with nodemon (auto-reload)
npm run build    # Compile TypeScript
npm run lint     # Run ESLint
npm run format   # Format with Prettier
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ using TypeScript, React, Express, and MongoDB

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- Zod for schema validation

---

**Happy Coding! 🚀**

