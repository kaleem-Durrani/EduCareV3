import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ParentTabParamList, TeacherTabParamList } from "../types";

// Import navigators and screens
import { ParentNavigator } from "./ParentNavigator";
import { TeacherNavigator } from "./TeacherNavigator";
import NotificationScreen from "../screens/Shared/NotificationScreen";
import SettingsScreen from "../screens/Shared/SettingsScreen";

// Tab navigators
const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const TeacherTab = createBottomTabNavigator<TeacherTabParamList>();

export const ParentTabNavigator = () => {
  return (
    <ParentTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <ParentTab.Screen 
        name="Dashboard" 
        component={ParentNavigator}
        options={{
          tabBarLabel: 'Home',
          // Add icon here when you have icons
        }}
      />
      <ParentTab.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Notifications',
          // Add icon here when you have icons
        }}
      />
      <ParentTab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          // Add icon here when you have icons
        }}
      />
    </ParentTab.Navigator>
  );
};

export const TeacherTabNavigator = () => {
  return (
    <TeacherTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <TeacherTab.Screen 
        name="Dashboard" 
        component={TeacherNavigator}
        options={{
          tabBarLabel: 'Home',
          // Add icon here when you have icons
        }}
      />
      <TeacherTab.Screen 
        name="Classes" 
        component={TeacherNavigator}
        options={{
          tabBarLabel: 'Classes',
          // Add icon here when you have icons
        }}
      />
      <TeacherTab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          // Add icon here when you have icons
        }}
      />
    </TeacherTab.Navigator>
  );
};
