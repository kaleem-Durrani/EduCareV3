import React from "react";
import { NavigationContainer } from "@react-navigation/native";

// Import the root navigator and auth provider
import { RootNavigator } from "./src/navigators";
import { AuthProvider } from "./src/contexts";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
