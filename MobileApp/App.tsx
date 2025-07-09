import React from 'react';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';
import {
  ThemeProvider,
  AuthProvider,
  TeacherClassesProvider,
  ParentChildrenProvider,
  useAuth,
  useTheme as useThemeContext, // Renamed to avoid conflict with `~/hooks`
} from './src/contexts';
import { RootNavigator } from './src/navigators';
// import { useTheme } from '~/hooks'; // You are not using this import directly here anymore

// A new component to render StatusBar that consumes the theme context
const ThemedStatusBar: React.FC = () => {
  const { isDark } = useThemeContext(); // Use the useTheme from your contexts
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
};

// Role-specific provider wrapper
const RoleBasedProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (user?.role === 'teacher') {
    return <TeacherClassesProvider userRole={user.role}>{children}</TeacherClassesProvider>;
  }

  if (user?.role === 'parent') {
    return <ParentChildrenProvider userRole={user.role}>{children}</ParentChildrenProvider>;
  }

  // No role-specific provider needed for unauthenticated users
  return <>{children}</>;
};

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RoleBasedProviders>
            <NavigationContainer>
              <RootNavigator />
              {/* Render the ThemedStatusBar here, inside NavigationContainer */}
              <ThemedStatusBar />
            </NavigationContainer>
          </RoleBasedProviders>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
