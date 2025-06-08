import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import LoginScreen from "../Auth/Login/Login";
import ForgotPasswordScreen from "../Auth/ForgetPassword/ForgetPassword";

export type AuthStackParamList = {
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};
