# User Edit Features Documentation

## Overview
This document describes the new user editing features added to the User Management System, allowing SuperAdmin and Admin roles to edit user information with proper permission controls.

## Features Added

### 1. Backend Permission Updates

**File Modified:** `backend/src/controllers/user.controller.ts`

#### Permission Rules for Editing Users:

1. **SuperAdmin** can edit:
   - Name, email, and password of **SuperAdmin** users
   - Name, email, and password of **Admin** users
   - Name, email, and password of **User** users

2. **Admin** can edit:
   - Name, email, and password of **User** users only
   - **Cannot** edit SuperAdmin or other Admin users

3. **Regular Users** can:
   - Only edit their own profile

#### Implementation Details:

The `updateUser` controller now includes explicit permission checks:

```typescript
// Permission checks for editing other users
if (req.user?.userId !== id) {
  // Admin cannot edit SuperAdmin users
  if (req.user?.role === 'Admin' && user.role === 'SuperAdmin') {
    res.status(403).json({
      success: false,
      message: 'Access denied',
      error: 'Admin cannot modify SuperAdmin accounts',
    });
    return;
  }

  // Admin cannot edit other Admin users
  if (req.user?.role === 'Admin' && user.role === 'Admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied',
      error: 'Admin can only modify User accounts',
    });
    return;
  }
}
```

### 2. Frontend Edit User Modal

**New Component:** `frontend/src/components/EditUserModal.tsx`

#### Features:
- Edit user's full name
- Edit user's email address
- Change user's password (optional)
- Form validation for all fields
- Only sends changed fields to the backend
- Displays appropriate error messages
- Loading states during submission

#### Validation:
- Name: Must be at least 2 characters
- Email: Must be a valid email format
- Password: Optional, but if provided, must meet password requirements (minimum 6 characters)

#### User Experience:
- Pre-fills current name and email
- Password field is optional (leave blank to keep current password)
- Shows clear error messages for validation failures
- Displays API errors if update fails

### 3. User List Updates

**File Modified:** `frontend/src/pages/UserList.tsx`

#### New Features:

1. **Edit Button** - Appears based on permissions:
   - SuperAdmin sees "Edit" button for all users (except themselves)
   - Admin sees "Edit" button only for User role accounts
   - The button opens the EditUserModal

2. **Permission Helper Function**:
```typescript
const canEditUser = (user: User): boolean => {
  if (!currentUser) return false;
  
  // Users cannot edit themselves through the Edit button
  if (user._id === currentUser._id) return false;
  
  // SuperAdmin can edit anyone
  if (currentUser.role === 'SuperAdmin') return true;
  
  // Admin can only edit User role
  if (currentUser.role === 'Admin' && user.role === 'User') return true;
  
  return false;
};
```

3. **Enhanced Actions Column**:
   - **Edit** button - Opens edit user modal (name, email, password)
   - **Edit Role** button - Opens role editing modal (existing functionality)
   - **Delete** button - Deletes user (SuperAdmin only)
   - **"No permissions"** text - Shows for users that can't be edited by current user

## API Endpoints Used

### Update User
- **Endpoint:** `PUT /api/update/:id`
- **Authentication:** Required (JWT token)
- **Permissions:** 
  - SuperAdmin: Can update any user
  - Admin: Can update User role accounts only
  - User: Can update own profile only

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "role": "User | Admin | SuperAdmin (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "User | Admin | SuperAdmin",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
}
```

## Security Considerations

1. **Password Updates:**
   - Passwords are optional when editing
   - If provided, they must meet minimum security requirements
   - Passwords are hashed before storage (handled by User model)

2. **Email Validation:**
   - Checks if new email is already in use by another user
   - Validates email format on both frontend and backend

3. **Role-Based Access Control:**
   - Backend enforces strict permission checks
   - Frontend UI adapts based on user role
   - Prevents privilege escalation attempts

4. **Own Profile Protection:**
   - Users cannot edit their own profile through the Edit button
   - They should use a dedicated profile page for self-editing

## Usage Examples

### SuperAdmin Editing an Admin User:
1. Login as SuperAdmin
2. Navigate to User Management page
3. Find the Admin user in the list
4. Click "Edit" button
5. Update name, email, or password as needed
6. Click "Update User"

### Admin Editing a Regular User:
1. Login as Admin
2. Navigate to User Management page
3. Find a User role account
4. Click "Edit" button
5. Update name, email, or password as needed
6. Click "Update User"

### Admin Attempting to Edit Another Admin:
1. Login as Admin
2. Navigate to User Management page
3. Admin users will show "No permissions" instead of Edit button
4. Admin cannot modify other Admin or SuperAdmin accounts

## Testing Recommendations

1. **Test SuperAdmin Permissions:**
   - Create a SuperAdmin account
   - Try editing Admin users (should succeed)
   - Try editing User accounts (should succeed)
   - Try editing own account through Edit button (button should not appear)

2. **Test Admin Permissions:**
   - Create an Admin account
   - Try editing User accounts (should succeed)
   - Try editing other Admin accounts (should show "No permissions")
   - Try editing SuperAdmin accounts (should show "No permissions")

3. **Test Form Validation:**
   - Try submitting empty name (should fail)
   - Try submitting invalid email (should fail)
   - Try submitting weak password (should fail)
   - Try making no changes (should show "No changes detected")

4. **Test Email Uniqueness:**
   - Try changing email to one that's already in use
   - Should receive error: "Email is already in use"

## Error Messages

| Scenario | Error Message |
|----------|--------------|
| Admin tries to edit SuperAdmin | "Admin cannot modify SuperAdmin accounts" |
| Admin tries to edit another Admin | "Admin can only modify User accounts" |
| Email already exists | "Email is already in use" |
| No changes made | "No changes detected. Please modify at least one field." |
| Invalid name | "Name must be at least 2 characters long" |
| Invalid email | "Please enter a valid email address" |
| Weak password | "Password must be at least 6 characters long" |

## Future Enhancements

Consider adding:
1. Password strength meter
2. Email verification when changing email
3. Audit log for user edits
4. Bulk user editing capabilities
5. User profile page for self-editing

