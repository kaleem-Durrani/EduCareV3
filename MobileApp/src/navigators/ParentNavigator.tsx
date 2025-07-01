import { createStackNavigator } from "@react-navigation/stack";
import { ParentStackParamList } from "../types";

// Import Parent screens
import ParentHomeScreen from "../screens/Parent/ParentHomeScreen";
import BasicInformationScreen from "../screens/Parent/BasicInformationScreen";
import ContactsScreen from "../screens/Parent/ContactsScreen";
import WeeklyMenuScreen from "../screens/Parent/WeeklyMenuScreen";
import WeeklyReportScreen from "../screens/Parent/WeeklyReportScreen";
import MonthlyPlanScreen from "../screens/Parent/MonthlyPlanScreen";
import MyBoxScreen from "../screens/Parent/MyBoxScreen";
import MyDocumentsScreen from "../screens/Parent/MyDocumentsScreen";
import ActivitiesScreen from "../screens/Parent/ActivitiesScreen";
import ActivityDetailScreen from "../screens/Parent/ActivityDetailScreen";
import WallScreen from "../screens/Parent/WallScreen";
import NotesScreen from "../screens/Parent/NotesScreen";
import LostItemsScreen from "../screens/Parent/LostItemsScreen";
import HealthScreen from "../screens/Parent/HealthScreen";
import PaymentScreen from "../screens/Parent/PaymentScreen";
import DriverScreen from "../screens/Parent/DriverScreen";
import NotificationsScreen from "../screens/Shared/NotificationsScreen";
import SettingsScreen from "../screens/Shared/SettingsScreen";

const Stack = createStackNavigator<ParentStackParamList>();

export const ParentNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Home Screen */}
      <Stack.Screen name="ParentHome" component={ParentHomeScreen} />
      
      {/* Student Information Screens */}
      <Stack.Screen name="BasicInformation" component={BasicInformationScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Health" component={HealthScreen} />
      
      {/* Educational Screens */}
      <Stack.Screen name="WeeklyMenu" component={WeeklyMenuScreen} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
      <Stack.Screen name="MonthlyPlan" component={MonthlyPlanScreen} />
      
      {/* Items & Documents */}
      <Stack.Screen name="MyBox" component={MyBoxScreen} />
      <Stack.Screen name="MyDocuments" component={MyDocumentsScreen} />
      <Stack.Screen name="LostItems" component={LostItemsScreen} />
      
      {/* Communication Screens */}
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
      <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
      <Stack.Screen name="Wall" component={WallScreen} />
      <Stack.Screen name="Notes" component={NotesScreen} />
      
      {/* Financial */}
      <Stack.Screen name="Payment" component={PaymentScreen} />
      
      {/* Transportation */}
      <Stack.Screen name="Driver" component={DriverScreen} />
      
      {/* App Features */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
