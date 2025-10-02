# Authentication System Documentation

## Overview

The Doctar authentication system provides a comprehensive user management solution with separate registration flows for patients and doctors. The system is built using Redux for state management and includes role-based access control.

## Features

### 🔐 Authentication Features
- **Role-based Registration**: Separate signup flows for patients and doctors
- **Secure Login**: Email/password authentication with social login options
- **Password Recovery**: Forgot password functionality with email verification
- **Session Management**: Persistent authentication state with Redux Persist
- **Protected Routes**: Role-based access control for different user types

### 👥 User Roles
- **Patient**: Healthcare consumers looking for medical services
- **Doctor**: Medical professionals providing healthcare services

## File Structure

```
app/
├── auth/
│   ├── page.js                    # Main auth page with role selection
│   ├── signup/
│   │   └── page.js                # Patient/Doctor signup form
│   ├── login/
│   │   └── page.js                # Login form
│   ├── forgot-password/
│   │   └── page.js                # Password recovery
│   └── success/
│       └── page.js                # Success page after signup
├── store/
│   └── slices/
│       └── authSlice.js           # Authentication state management
├── services/
│   └── auth.js                     # Authentication API service
└── components/
    ├── ProtectedRoute.js          # Route protection component
    └── Header.js                  # Updated with auth features
```

## Authentication Flow

### 1. Role Selection (`/auth`)
- Users choose between "Patient" or "Doctor" roles
- Visual cards with role descriptions
- Directs to appropriate signup flow

### 2. Patient Registration (`/auth/signup?role=patient`)
- Comprehensive patient information form
- Personal details (name, email, phone, DOB, gender)
- Address information
- Medical information (optional)
- Security (password creation)

### 3. Doctor Registration (`/auth/signup?role=doctor`)
- Currently shows "coming soon" message
- Placeholder for future doctor registration
- Contact support for early access

### 4. Login (`/auth/login`)
- Email/password authentication
- Social login options (Google, Facebook)
- Remember me functionality
- Forgot password link

### 5. Password Recovery (`/auth/forgot-password`)
- Email-based password reset
- Confirmation email flow
- Secure token-based reset

## Redux State Management

### Auth Slice (`authSlice.js`)
```javascript
{
  user: null,                    // User object
  isAuthenticated: false,         // Authentication status
  isLoading: false,              // Loading state
  error: null,                   // Error messages
  role: null,                    // User role (patient/doctor)
  profile: null,                 // User profile data
  preferences: {                 // User preferences
    notifications: true,
    emailUpdates: true,
    smsUpdates: false
  }
}
```

### Key Actions
- `loginStart/loginSuccess/loginFailure`: Login flow
- `registerStart/registerSuccess/registerFailure`: Registration flow
- `logout`: User logout
- `updateProfile`: Profile updates
- `resetPasswordStart/resetPasswordSuccess/resetPasswordFailure`: Password reset

## Protected Routes

### ProtectedRoute Component
- Wraps components that require authentication
- Role-based access control
- Loading states and error handling
- Automatic redirect to login for unauthenticated users

### Usage
```javascript
<ProtectedRoute requiredRole="patient">
  <PatientDashboard />
</ProtectedRoute>
```

## API Integration

### AuthService (`services/auth.js`)
- Mock API service for development
- Ready for backend integration
- Comprehensive error handling
- Token management

### Available Methods
- `login(email, password)`: User authentication
- `register(userData)`: User registration
- `forgotPassword(email)`: Password reset request
- `resetPassword(token, newPassword)`: Password reset
- `updateProfile(userId, profileData)`: Profile updates
- `logout()`: User logout
- `verifyEmail(token)`: Email verification
- `resendVerificationEmail(email)`: Resend verification

## UI Components

### Header Integration
- Dynamic user menu based on authentication status
- User profile display
- Logout functionality
- Sign in/Sign up buttons for unauthenticated users

### Form Validation
- Real-time validation feedback
- Comprehensive error handling
- User-friendly error messages
- Required field indicators

## Security Features

### Data Protection
- Password strength requirements
- Email validation
- Secure form handling
- XSS protection

### Session Management
- Persistent login state
- Automatic logout on token expiry
- Secure token storage
- Session timeout handling

## Development Setup

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_API_KEY=your_email_service_key
```

### Dependencies
- Redux Toolkit for state management
- Redux Persist for state persistence
- Next.js for routing and SSR
- Tailwind CSS for styling

## Future Enhancements

### Planned Features
- Email verification system
- Two-factor authentication
- Social login integration
- Advanced profile management
- Doctor verification system
- Patient-doctor matching algorithm

### Backend Integration
- Replace mock services with real API calls
- Implement JWT token authentication
- Add email service integration
- Database schema implementation
- File upload for profile pictures

## Usage Examples

### Basic Authentication Check
```javascript
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

function MyComponent() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <UserContent user={user} />;
}
```

### Role-based Rendering
```javascript
import { useAppSelector } from '../store/hooks';
import { selectRole } from '../store/slices/authSlice';

function Dashboard() {
  const role = useAppSelector(selectRole);
  
  return (
    <div>
      {role === 'patient' && <PatientDashboard />}
      {role === 'doctor' && <DoctorDashboard />}
    </div>
  );
}
```

## Testing

### Test Cases
- User registration flow
- Login/logout functionality
- Password reset flow
- Role-based access control
- Form validation
- Error handling

### Manual Testing
1. Navigate to `/auth`
2. Select patient role
3. Complete registration form
4. Verify success page
5. Test login functionality
6. Verify protected routes

## Troubleshooting

### Common Issues
- **Form validation errors**: Check required fields and format
- **Authentication state**: Verify Redux store configuration
- **Protected routes**: Ensure proper role assignment
- **API errors**: Check network connectivity and endpoints

### Debug Tools
- Redux DevTools for state inspection
- Browser console for error messages
- Network tab for API calls
- Application tab for localStorage

## Support

For technical support or questions about the authentication system, please refer to the development team or create an issue in the project repository.
