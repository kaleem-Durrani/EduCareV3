import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

// Import providers and navigators
import { AuthProvider } from './src/contexts';
import { RootNavigator } from './src/navigators';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
