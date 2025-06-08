import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import Parent screens
import ParentDashboard from "../Tabs/Dashboard/ParentDashboard";
import StatisticsScreen from "../screens/Statistics/StatisticsScreen";
import FeeInvoice from "../screens/FeeInvoice/FeeInvoice";
import ChildProfileScreen from "../screens/Parent/ChildProfile/ChildProfile";
import BasicInformation from "../screens/Parent/BasicInformation/BasicInformation";
import Contacts from "../screens/Parent/Contacts/Contacts";
import WeeklyMenu from "../screens/Parent/WeeklyMenu/WeeklyMenu";
import WeeklyReport from "../screens/Parent/WeeklyReport/WeeklyReport";
import MonthlyPlan from "../screens/Parent/MonthlyPlan/MonthlyPlan";
import MyBox from "../screens/Parent/MyBox/MyBox";
import MyDocuments from "../screens/Parent/MyDocuments/MyDocuments";
import Activities from "../screens/Parent/Activities.js/Activities";
import ActivitiesDetail from "../screens/Parent/Activities.js/ActivitiesDetail";
import WallScreen from "../screens/Parent/WallScreen/WallScreen";
import Notes from "../screens/Teacher/Notes/Notes";
import LostItems from "../screens/Parent/LostItems/LostItems";
import HealthScreen from "../screens/Parent/Health/Health";
import Payment from "../screens/Parent/Payment/Payment";
import Driver from "../screens/Parent/Driver/Driver";

export type ParentStackParamList = {
  ParentDashboard: undefined;
  Statistics: undefined;
  FeeInvoice: undefined;
  ChildProfileScreen: undefined;
  BasicInformation: undefined;
  Contacts: undefined;
  WeeklyMenu: undefined;
  WeeklyReport: undefined;
  MonthlyPlan: undefined;
  MyBox: undefined;
  MyDocuments: undefined;
  Activities: undefined;
  ActivitiesDetail: undefined;
  WallScreen: undefined;
  Notes: undefined;
  LostItems: undefined;
  HealthScreen: undefined;
  Payment: undefined;
  Driver: undefined;
};

const Stack = createStackNavigator<ParentStackParamList>();

export const ParentNavigator = () => {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="FeeInvoice" component={FeeInvoice} />
      <Stack.Screen name="ChildProfileScreen" component={ChildProfileScreen} />
      <Stack.Screen name="BasicInformation" component={BasicInformation} />
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="WeeklyMenu" component={WeeklyMenu} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReport} />
      <Stack.Screen name="MonthlyPlan" component={MonthlyPlan} />
      <Stack.Screen name="MyBox" component={MyBox} />
      <Stack.Screen name="MyDocuments" component={MyDocuments} />
      <Stack.Screen name="Activities" component={Activities} />
      <Stack.Screen name="ActivitiesDetail" component={ActivitiesDetail} />
      <Stack.Screen name="WallScreen" component={WallScreen} />
      <Stack.Screen name="Notes" component={Notes} />
      <Stack.Screen name="LostItems" component={LostItems} />
      <Stack.Screen name="HealthScreen" component={HealthScreen} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Driver" component={Driver} />
    </Stack.Navigator>
  );
};
