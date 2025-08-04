# Subscription Validation Feature

This feature implements subscription validation for member login to ensure only users with active clinic subscriptions can access the system.

## Overview

When a member logs in, the system:
1. Finds the user in the User table
2. Checks the clinicId associated with the user
3. Looks up the subscription state in the SubscriptionTier table
4. Validates the `isActive` variable
5. If active: allows access
6. If inactive: redirects to login page with warning alert

## Implementation Details

### Files Modified/Created:

1. **`src/app/lib/subscriptionCheck.js`** - Utility function to check subscription status
2. **`src/app/api/auth/check-subscription/route.js`** - API endpoint for subscription validation
3. **`src/app/pages/LoginPage.jsx`** - Modified to check subscription after login
4. **`src/app/lib/authoption.js`** - Added subscription checking to session callback
5. **`src/middleware.js`** - Middleware to check subscription on protected routes

### How It Works:

1. **Login Flow**: When a user logs in, the system checks their subscription status
2. **Session Validation**: Subscription status is checked on every session
3. **Route Protection**: Middleware prevents access to protected routes if subscription is inactive
4. **Blocked Access**: Users with inactive subscriptions are blocked at login and cannot access any dashboard

### Database Schema:

- **User table**: Contains `clinic` field linking to clinic
- **SubscriptionTier table**: Contains `clinicId`, `isActive` fields

### Admin Users:

Admin users (role = "admin") are exempt from subscription validation and can always access the system.

### Error Handling:

- Invalid subscriptions redirect to login page with error message
- Toast notifications show subscription status warnings
- Users with inactive subscriptions are completely blocked from accessing the system

## Usage

The feature is automatically active for all non-admin users. No additional configuration is required.

### Testing:

1. Create a user with an inactive clinic subscription
2. Attempt to log in - should be redirected to login with warning
3. Create a user with an active clinic subscription
4. Log in - should proceed normally to dashboard
5. Admin users should always have access regardless of subscription status 