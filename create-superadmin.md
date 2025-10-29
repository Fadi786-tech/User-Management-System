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

