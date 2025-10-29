# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Register User

**POST** `/api/register`

Register a new user in the system.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "role": "User"  // Optional: 'SuperAdmin' | 'Admin' | 'User' (default: 'User')
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "email: Invalid email format"
}
```

**Validation Rules:**
- Name: min 3 characters
- Email: valid email format
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Role: 'SuperAdmin' | 'Admin' | 'User'

---

### 2. Login

**POST** `/api/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Login failed",
  "error": "Invalid email or password"
}
```

---

### 3. Get Current User

**GET** `/api/me`

Get the currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided"
}
```

---

### 4. Get All Users

**GET** `/api/users`

Get a list of all users (SuperAdmin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** SuperAdmin only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "User",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "Admin",
        "createdAt": "2024-01-15T11:00:00.000Z",
        "updatedAt": "2024-01-15T11:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "Role 'User' is not authorized to access this resource"
}
```

---

### 5. Update User

**PUT** `/api/update/:id`

Update a user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** 
- Users can update their own profile
- Admins/SuperAdmins can update any user
- Only SuperAdmin can change roles

**URL Parameters:**
- `id` - User ID to update

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com",
  "password": "NewSecurePass@123",
  "role": "Admin"  // Only SuperAdmin can change this
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Updated",
      "email": "johnupdated@example.com",
      "role": "Admin",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "You can only update your own profile"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Update failed",
  "error": "Email is already in use"
}
```

---

### 6. Delete User

**DELETE** `/api/delete/:id`

Delete a user from the system (SuperAdmin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Access:** SuperAdmin only

**URL Parameters:**
- `id` - User ID to delete

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "deletedUser": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Delete failed",
  "error": "User not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "Role 'Admin' is not authorized to access this resource"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Example Usage with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Users
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
```

### Update User
```bash
curl -X PUT http://localhost:5000/api/update/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/delete/USER_ID \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
```

---

## Example Usage with JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Register
const register = async () => {
  const response = await axios.post(`${API_URL}/register`, {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass@123'
  });
  return response.data;
};

// Login
const login = async () => {
  const response = await axios.post(`${API_URL}/login`, {
    email: 'john@example.com',
    password: 'SecurePass@123'
  });
  const { token } = response.data.data;
  localStorage.setItem('token', token);
  return response.data;
};

// Get All Users (with auth)
const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data.users;
};

// Update User
const updateUser = async (userId, data) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/update/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data.user;
};

// Delete User
const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/delete/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
```

---

## JWT Token Structure

The JWT token contains:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "User",
  "iat": 1642244400,
  "exp": 1642849200
}
```

Token expires in 7 days by default (configurable in `.env`).

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding:
- Rate limiting middleware (e.g., express-rate-limit)
- Request throttling
- IP-based restrictions

---

## Security Considerations

1. **Always use HTTPS in production**
2. **Store JWT_SECRET securely** (never commit to git)
3. **Validate all inputs** (Zod validation is already implemented)
4. **Hash passwords** (bcrypt is already implemented)
5. **Implement refresh tokens** (for better security)
6. **Add request logging** (for audit trails)
7. **Implement CSRF protection** (for web applications)

---

For more information, see the main [README.md](./README.md).

