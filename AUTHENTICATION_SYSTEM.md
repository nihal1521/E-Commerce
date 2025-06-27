# Authentication System

## Overview

The application now features a complete database-backed authentication system. Users can sign up for new accounts and sign in with existing credentials. All user data is stored in the local JSON database system.

## Features

### ✅ **User Registration (Sign Up)**
- Users can create new accounts with name, email, and password
- Email validation ensures proper format
- Password must be at least 6 characters long
- Password confirmation must match
- Duplicate email addresses are rejected
- New users are automatically assigned 'customer' role

### ✅ **User Authentication (Sign In)**
- Users sign in with email and password
- Passwords are validated against stored credentials
- Invalid credentials show appropriate error messages
- Successful login persists user session in localStorage
- Last login timestamp is updated

### ✅ **User Data Storage**
- All user data is stored in `src/database/collections/users.json`
- User profiles include full information (name, email, role, preferences, etc.)
- Passwords are stored as plain text (for demo - in production, use bcrypt)
- Each user gets a unique ID and timestamps

### ✅ **Session Management**
- User sessions persist across browser reloads
- Authenticated state is maintained in localStorage
- Users can sign out to clear their session
- Session restoration on app startup

## Database Schema

### UserProfile Interface
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  isVerified: boolean;
  avatar?: string;
  lastLoginAt?: Date;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  };
  addresses: BillingAddress[];
  orders: Order[];
}
```

## API Methods

### UserService Methods
```typescript
// Create new user
await userService.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Authenticate user
await userService.authenticateUser({
  email: 'john@example.com',
  password: 'password123'
});

// Get user by ID or email
await userService.getUserById('user_123');
await userService.getUserByEmail('john@example.com');

// Update user profile
await userService.updateUser('user_123', { name: 'John Smith' });

// Delete user account
await userService.deleteUser('user_123');
```

## UI Components

### AuthModal
- **Sign In Tab**: Email and password fields with validation
- **Sign Up Tab**: Name, email, password, and confirm password fields
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Loading indicators during authentication
- **Success Feedback**: Welcome message upon successful authentication

### Header Integration
- **User Icon**: Shows authentication modal when clicked
- **Authenticated State**: Shows user name and logout option
- **Sign Out**: Clears session and returns to unauthenticated state

## Security Features

### Validation
- Email format validation using regex
- Password length requirement (minimum 6 characters)
- Password confirmation matching
- Duplicate email prevention
- XSS protection through React's built-in escaping

### Error Handling
- Comprehensive error messages for all failure scenarios
- No sensitive information leaked in error messages
- Graceful degradation on database errors

## Demo Credentials **REMOVED**

Demo credentials have been completely removed. Users must now:
1. **Sign Up**: Create a new account with their own credentials
2. **Sign In**: Use their registered email and password

## Testing the System

1. **Sign Up**: 
   - Click user icon in header
   - Switch to "Sign Up" tab
   - Fill in your details (name, email, password)
   - Click "Create Account"

2. **Sign In**:
   - Use the email and password you just created
   - Click "Sign In"

3. **View Data**:
   - Check `src/database/collections/users.json` to see stored users
   - Open browser DevTools → Application → Local Storage to see session data

## File Structure

```
src/
├── components/
│   ├── AuthModal.tsx          # Sign in/up modal
│   └── Header.tsx             # Updated with auth state
├── context/
│   └── AuthContext.tsx        # Auth state management
├── database/
│   ├── collections/
│   │   └── users.json         # User data storage
│   ├── services/
│   │   └── UserService.ts     # User CRUD operations
│   └── index.ts               # Database exports
└── types/
    └── index.ts               # Updated with auth types
```

## Production Considerations

For a production deployment, consider these improvements:

1. **Password Security**: Use bcrypt for password hashing
2. **JWT Tokens**: Implement proper token-based authentication
3. **API Backend**: Replace local storage with secure backend API
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **Email Verification**: Add email verification flow
6. **Password Reset**: Implement secure password reset functionality
7. **Two-Factor Auth**: Add 2FA for enhanced security

## Migration from Demo System

The old demo credential system has been completely removed:
- No more hardcoded admin/customer accounts
- No more "Fill Admin/Customer" buttons
- No more mock user localStorage management
- All authentication now goes through the database system

Users who had demo accounts will need to create new accounts using the sign-up process.
