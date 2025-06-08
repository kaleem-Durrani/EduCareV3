import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import Teacher screens
import TeacherDashboard from "../Tabs/Dashboard/TeacherDashboard";
import ActivityManagement from "../screens/Teacher/ActivityManagement/ActivityManagement";
import ClassList from "../screens/Teacher/ClassList/ClassList";
import EditMyBox from "../screens/Teacher/EditMyBox/EditMyBox";
import EditMyDocuments from "../screens/Teacher/EditMyDocument/EditMyDocument";
import EditWeeklyReport from "../screens/Teacher/EditWeeklyReport/EditWeeklyReport";
import MonthlyPlanTeacher from "../screens/Teacher/MonthlyPlan/MonthlyPlanTeacher";
import Notes from "../screens/Teacher/Notes/Notes";
import StudentProfile from "../screens/Teacher/StudentProfile/StudentProfile";
import WallPost from "../screens/Teacher/WallPost/WallPost";

export type TeacherStackParamList = {
  TeacherDashboard: undefined;
  ClassList: undefined;
  StudentProfile: undefined;
  EditWeeklyReport: undefined;
  EditMyBox: undefined;
  EditMyDocuments: undefined;
  MonthlyPlanTeacher: undefined;
  ActivityManagement: undefined;
  WallPost: undefined;
  Notes: undefined;
};

const Stack = createStackNavigator<TeacherStackParamList>();

export const TeacherNavigator = () => {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      <Stack.Screen name="ClassList" component={ClassList} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="EditWeeklyReport" component={EditWeeklyReport} />
      <Stack.Screen name="EditMyBox" component={EditMyBox} />
      <Stack.Screen name="EditMyDocuments" component={EditMyDocuments} />
      <Stack.Screen name="MonthlyPlanTeacher" component={MonthlyPlanTeacher} />
      <Stack.Screen name="ActivityManagement" component={ActivityManagement} />
      <Stack.Screen name="WallPost" component={WallPost} />
      <Stack.Screen name="Notes" component={Notes} />
    </Stack.Navigator>
  );
};
