# EduCare Mobile v2 - Project Structure

## Overview
This is a React Native mobile application built with Expo, TypeScript, and Gluestack UI v1. The app serves both parents and teachers with role-based navigation and authentication.

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: Gluestack UI v1
- **Navigation**: React Navigation v7
- **State Management**: React Context
- **HTTP Client**: Axios
- **Storage**: AsyncStorage

## Project Structure

```
EduCareMobilev2/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── LoadingScreen.tsx
│   │   └── index.ts
│   ├── config/              # App configuration
│   │   ├── env.ts           # Environment variables and utilities
│   │   └── index.ts
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication context
│   │   └── index.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useApi.ts        # API request hook
│   │   └── index.ts
│   ├── navigators/          # Navigation structure
│   │   ├── RootNavigator.tsx     # Main navigator
│   │   ├── AuthNavigator.tsx     # Auth screens navigator
│   │   ├── TabNavigators.tsx     # Tab navigators for Parent/Teacher
│   │   ├── ParentNavigator.tsx   # Parent stack navigator
│   │   ├── TeacherNavigator.tsx  # Teacher stack navigator
│   │   └── index.ts
│   ├── screens/             # Screen components
│   │   ├── Auth/            # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── Parent/          # Parent-specific screens
│   │   │   ├── ParentDashboardScreen.tsx
│   │   │   ├── StudentProfileScreen.tsx
│   │   │   ├── BasicInformationScreen.tsx
│   │   │   ├── WeeklyReportScreen.tsx
│   │   │   ├── MonthlyPlanScreen.tsx
│   │   │   └── ActivitiesScreen.tsx
│   │   ├── Teacher/         # Teacher-specific screens
│   │   │   ├── TeacherDashboardScreen.tsx
│   │   │   ├── ClassListScreen.tsx
│   │   │   └── StudentProfileScreen.tsx
│   │   └── Shared/          # Shared screens
│   │       ├── NotificationScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── services/            # API services
│   │   ├── api.ts           # Axios configuration and utilities
│   │   ├── authService.ts   # Authentication API calls
│   │   └── index.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Global types and interfaces
├── App.tsx                  # Main app component
├── app.config.js           # Expo configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── .env.example            # Environment variables example
```

## Key Features

### Authentication
- Role-based login (Parent/Teacher)
- Token-based authentication with AsyncStorage
- Automatic token refresh and logout on expiry
- Forgot password functionality

### Navigation
- Conditional navigation based on authentication state
- Role-based tab navigation (Parent vs Teacher)
- Stack navigation within each role
- Proper TypeScript navigation types

### API Integration
- Centralized Axios configuration
- Request/response interceptors
- Automatic token attachment
- Error handling and logging
- Environment-based API URLs

### UI/UX
- Gluestack UI v1 components
- Consistent theming and styling
- Loading states and error handling
- Responsive design patterns

## Environment Configuration

The app uses environment variables for configuration:

- `EXPO_PUBLIC_API_BASE_URL`: Backend API base URL
- `EXPO_PUBLIC_SERVER_URL`: Server URL for media files
- `EXPO_PUBLIC_DEBUG_MODE`: Enable debug mode
- `EXPO_PUBLIC_ENABLE_LOGGING`: Enable console logging

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update environment variables in `.env` file

4. Start the development server:
   ```bash
   npm start
   ```

## Development Guidelines

### Code Organization
- Use TypeScript for all new code
- Follow the established folder structure
- Export components/utilities through index.ts files
- Use proper TypeScript types for navigation and API responses

### State Management
- Use React Context for global state (auth, user data)
- Use local state for component-specific data
- Use the useApi hook for API calls

### Styling
- Use Gluestack UI components whenever possible
- Follow the established theming patterns
- Use responsive design tokens

### API Integration
- Use the centralized API service
- Handle errors appropriately
- Show loading states during API calls
- Use proper TypeScript types for API responses

## Next Steps

1. Implement actual API endpoints in services
2. Add proper error boundaries
3. Implement push notifications
4. Add offline support
5. Add unit tests
6. Add proper icons for tab navigation
7. Implement file upload functionality
8. Add proper form validation
