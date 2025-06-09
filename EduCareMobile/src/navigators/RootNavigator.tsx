import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts";

// Import navigators
import { AuthNavigator } from "./AuthNavigator";
import { ParentTabNavigator, TeacherTabNavigator } from "./TabNavigators";
import LoadingScreen from "../components/LoadingScreen";

export type RootStackParamList = {
  Auth: undefined;
  ParentApp: undefined;
  TeacherApp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack Group - Only when not authenticated
        <Stack.Group>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Group>
      ) : (
        // App Stack Group - Only when authenticated
        <Stack.Group>
          {user?.role === "parent" ? (
            <Stack.Screen name="ParentApp" component={ParentTabNavigator} />
          ) : (
            <Stack.Screen name="TeacherApp" component={TeacherTabNavigator} />
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
