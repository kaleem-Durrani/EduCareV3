import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useAuth } from "../contexts";

// Import navigators
import { AuthNavigator } from "./AuthNavigator";
import { ParentNavigator } from "./ParentNavigator";
import { TeacherNavigator } from "./TeacherNavigator";
import { LoadingScreen } from "../components";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  // Get auth state from context
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack Group - Only when not authenticated
        <Stack.Group>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Group>
      ) : (
        // App Stack Group - Only when authenticated
        <Stack.Group>
          {user?.role === "parent" ? (
            <Stack.Screen name="ParentApp" component={ParentNavigator} />
          ) : (
            <Stack.Screen name="TeacherApp" component={TeacherNavigator} />
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
