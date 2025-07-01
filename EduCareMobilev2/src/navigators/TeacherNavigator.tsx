import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TeacherStackParamList } from "../types";

// Import Teacher screens
import TeacherDashboardScreen from "../screens/Teacher/TeacherDashboardScreen";
import ClassListScreen from "../screens/Teacher/ClassListScreen";
import StudentProfileScreen from "../screens/Teacher/StudentProfileScreen";

const Stack = createStackNavigator<TeacherStackParamList>();

export const TeacherNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
      <Stack.Screen name="ClassList" component={ClassListScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
    </Stack.Navigator>
  );
};
