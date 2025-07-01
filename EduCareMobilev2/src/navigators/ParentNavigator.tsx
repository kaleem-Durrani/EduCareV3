import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ParentStackParamList } from "../types";

// Import Parent screens
import ParentDashboardScreen from "../screens/Parent/ParentDashboardScreen";
import StudentProfileScreen from "../screens/Parent/StudentProfileScreen";
import BasicInformationScreen from "../screens/Parent/BasicInformationScreen";
import WeeklyReportScreen from "../screens/Parent/WeeklyReportScreen";
import MonthlyPlanScreen from "../screens/Parent/MonthlyPlanScreen";
import ActivitiesScreen from "../screens/Parent/ActivitiesScreen";

const Stack = createStackNavigator<ParentStackParamList>();

export const ParentNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
      <Stack.Screen name="BasicInformation" component={BasicInformationScreen} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
      <Stack.Screen name="MonthlyPlan" component={MonthlyPlanScreen} />
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
    </Stack.Navigator>
  );
};
