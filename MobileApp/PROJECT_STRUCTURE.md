# EduCare Mobile - Project Structure

## Overview

This is a React Native mobile application built with Expo, TypeScript, and NativeWind. The app serves both parents and teachers with role-based navigation and authentication.

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation (to be installed)
- **State Management**: React Context
- **HTTP Client**: Axios
- **Storage**: AsyncStorage

## Project Structure

```
MobileApp/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── LoadingScreen.tsx
│   │   └── index.ts
│   ├── config/              # App configuration
│   │   ├── env.ts           # Environment variables and utilities
│   │   ├── theme.ts         # Theme configuration
│   │   └── index.ts
│   ├── contexts/            # React contexts
│   │   ├── ThemeContext.tsx # Theme context
│   │   └── index.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useTheme.ts      # Theme hook
│   │   ├── useApi.ts        # API request hook
│   │   └── index.ts
│   ├── navigators/          # Navigation structure (to be created)
│   ├── screens/             # Screen components (to be created)
│   ├── services/            # API services
│   │   ├── api.ts           # Axios configuration and utilities
│   │   └── index.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Global types and interfaces
├── App.tsx                  # Main app component
├── app.config.js           # Expo configuration
├── global.css              # Global styles
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── .env.example            # Environment variables example
```

## Key Features

### Theme System

- **Light/Dark Mode Support**: Automatic system preference detection
- **Professional Color Scheme**: Tailored for educational applications
- **Persistent Theme**: Saves user preference in AsyncStorage
- **Dynamic Colors**: Theme-aware components with proper contrast
- **School-Appropriate**: Professional blue and teal color palette

### Architecture

- **TypeScript First**: Full type safety throughout the application
- **Modular Structure**: Clean separation of concerns
- **Context-Based State**: Theme and future auth state management
- **Custom Hooks**: Reusable logic for theme and API calls
- **Environment Configuration**: Flexible configuration for different environments

### Styling

- **NativeWind**: Tailwind CSS utility classes for React Native
- **Theme Integration**: Dynamic colors that work with Tailwind classes
- **Responsive Design**: Mobile-first approach with proper spacing
- **Consistent UI**: Unified design system across all components

## Theme Configuration

The app includes a comprehensive theme system with:

### Light Theme

- **Background**: Very light gray-blue (#f8fafc)
- **Primary**: Professional blue (#2563eb)
- **Secondary**: Complementary teal (#0891b2)
- **Text**: Dark gray for readability
- **Status Colors**: Green, amber, red, blue for success, warning, error, info

### Dark Theme

- **Background**: Dark slate (#0f172a)
- **Primary**: Softer blue (#3b82f6)
- **Secondary**: Softer teal (#06b6d4)
- **Text**: Light colors for dark backgrounds
- **Status Colors**: Slightly muted versions for better dark mode experience

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

## Completed Features

1. **✅ Navigation Structure**:
   - Root Navigator with conditional auth/app routing
   - Auth Navigator (Login, Forgot Password)
   - Parent Navigator with all 18 modules
   - Teacher Navigator with all 18 modules (some with edit rights)

2. **✅ Screen Implementation**:
   - **Auth Screens**: Login with role selection, Forgot Password
   - **Parent Screens**: Home with 3x6 grid, Basic Information, Contacts, and 14 other modules
   - **Teacher Screens**: Home with edit rights indicators, Our Kids, and 16 other modules
   - **Shared Screens**: Notifications, Settings with theme toggle

3. **✅ Key Features**:
   - Professional school-appropriate design
   - Role-based navigation (no tabs, stack only)
   - Theme system with light/dark modes
   - Proper header with EDUCARE branding
   - WhatsApp integration for contacts
   - Edit rights indicators for teachers

## Next Steps

1. **Install React Navigation** (Required):

   ```bash
   npm install @react-navigation/native @react-navigation/stack
   npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
   npm install @react-native-async-storage/async-storage axios
   ```

2. **Implement Authentication**:
   - Create AuthContext
   - Connect to backend API
   - Add proper login/logout functionality

3. **Add Real Data**:
   - Connect screens to actual API endpoints
   - Implement data fetching and caching
   - Add proper loading states

4. **Enhanced Features**:
   - File upload functionality
   - Push notifications
   - Form validation
   - Image handling
   - Calendar integration

## Development Guidelines

### Code Organization

- Use TypeScript for all new code
- Follow the established folder structure
- Export components/utilities through index.ts files
- Use proper TypeScript types for all interfaces

### Styling

- Use NativeWind classes whenever possible
- Combine with theme colors for dynamic styling
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

### State Management

- Use React Context for global state
- Use local state for component-specific data
- Use custom hooks for reusable logic

### API Integration

- Use the centralized API service
- Handle errors appropriately
- Show loading states during API calls
- Use proper TypeScript types for API responses
