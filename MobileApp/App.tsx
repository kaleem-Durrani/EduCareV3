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
} from './src/contexts';
import { RootNavigator } from './src/navigators';

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
              <StatusBar style="auto" />
            </NavigationContainer>
          </RoleBasedProviders>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
