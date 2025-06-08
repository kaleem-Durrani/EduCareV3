import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import navigators
import { AuthNavigator } from "./AuthNavigator";
import { ParentTabNavigator, TeacherTabNavigator } from "./TabNavigators";

export type RootStackParamList = {
  Auth: undefined;
  Dashboard: { role?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator id={undefined} initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
        {({ route }) => {
          const params = (route.params as { role?: string }) || {};
          const role = params.role;
          return role === "parent" ? (
            <ParentTabNavigator />
          ) : (
            <TeacherTabNavigator />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
