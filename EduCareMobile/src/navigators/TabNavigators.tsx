import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import navigators and screens
import { ParentNavigator } from "./ParentNavigator";
import { TeacherNavigator } from "./TeacherNavigator";
import { NotesNavigator } from "./NotesNavigator";
import NotificationScreen from "../Tabs/Notification/NotificationScreen";
import SettingsScreen from "../screens/Parent/Settings/Settings";

export type ParentTabParamList = {
  Home: undefined;
  Notification: undefined;
  Settings: undefined;
};

export type TeacherTabParamList = {
  Home: undefined;
  Note: undefined;
};

const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const TeacherTab = createBottomTabNavigator<TeacherTabParamList>();

export const ParentTabNavigator = () => (
  <ParentTab.Navigator
    id={undefined}
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Notification") {
          iconName = focused ? "notifications" : "notifications-outline";
        } else if (route.name === "Settings") {
          iconName = focused ? "settings" : "settings-outline";
        } else {
          iconName = "help-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#55A7B5",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <ParentTab.Screen
      name="Home"
      component={ParentNavigator}
      options={{ headerShown: false }}
    />
    <ParentTab.Screen
      name="Notification"
      component={NotificationScreen}
      options={{ headerShown: false }}
    />
    <ParentTab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
  </ParentTab.Navigator>
);

export const TeacherTabNavigator = () => (
  <TeacherTab.Navigator
    id={undefined}
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Note") {
          iconName = focused ? "document-text" : "document-text-outline";
        } else {
          iconName = "help-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#55A7B5",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <TeacherTab.Screen
      name="Home"
      component={TeacherNavigator}
      options={{ headerShown: false }}
    />
    <TeacherTab.Screen
      name="Note"
      component={NotesNavigator}
      options={{ title: "Notes" }}
    />
  </TeacherTab.Navigator>
);
