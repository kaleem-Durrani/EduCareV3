import { createStackNavigator } from '@react-navigation/stack';
import { ParentStackParamList } from '../types';

// Import Parent screens
import ParentHomeScreen from '../screens/Parent/parentHome';
import BasicInformationScreen from '../screens/Parent/basicInformation';
import ContactsScreen from '../screens/Parent/contacts';
import WeeklyMenuScreen from '../screens/Parent/weeklyMenu';
import WeeklyReportScreen from '../screens/Parent/weeklyReport';
import MonthlyPlanScreen from '../screens/Parent/monthlyPlan';
import MyBoxScreen from '../screens/Parent/myBox';
import MyDocumentsScreen from '../screens/Parent/myDocuments';
import ActivitiesScreen from '../screens/Parent/activities';
import ActivityDetailScreen from '../screens/Parent/activityDetail';
import WallScreen from '../screens/Parent/wall';
import NotesScreen from '../screens/Parent/notes';
import LostItemsScreen from '../screens/Parent/lostItem';
import HealthScreen from '../screens/Parent/health';
import PaymentScreen from '../screens/Parent/payment';
import DriverScreen from '../screens/Parent/driver';
import NotificationsScreen from '../screens/Shared/notifications';
import SettingsScreen from '../screens/Shared/settings';

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
