import { createStackNavigator } from "@react-navigation/stack";
import { TeacherStackParamList } from "../types";

// Import Teacher screens
import TeacherHomeScreen from "../screens/Teacher/TeacherHomeScreen";
import OurKidsScreen from "../screens/Teacher/OurKidsScreen";
import StudentProfileScreen from "../screens/Teacher/StudentProfileScreen";
import BasicInformationScreen from "../screens/Teacher/BasicInformationScreen";
import ContactsScreen from "../screens/Teacher/ContactsScreen";
import WeeklyMenuScreen from "../screens/Teacher/WeeklyMenuScreen";
import WeeklyReportScreen from "../screens/Teacher/WeeklyReportScreen";
import MonthlyPlanScreen from "../screens/Teacher/MonthlyPlanScreen";
import MyBoxScreen from "../screens/Teacher/MyBoxScreen";
import MyDocumentsScreen from "../screens/Teacher/MyDocumentsScreen";
import ActivitiesScreen from "../screens/Teacher/ActivitiesScreen";
import ActivityDetailScreen from "../screens/Teacher/ActivityDetailScreen";
import CreateActivityScreen from "../screens/Teacher/CreateActivityScreen";
import WallScreen from "../screens/Teacher/WallScreen";
import CreatePostScreen from "../screens/Teacher/CreatePostScreen";
import NotesScreen from "../screens/Teacher/NotesScreen";
import CreateNoteScreen from "../screens/Teacher/CreateNoteScreen";
import NotificationsScreen from "../screens/Shared/NotificationsScreen";
import SettingsScreen from "../screens/Shared/SettingsScreen";

const Stack = createStackNavigator<TeacherStackParamList>();

export const TeacherNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Home Screen */}
      <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} />
      
      {/* Class Management */}
      <Stack.Screen name="OurKids" component={OurKidsScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
      
      {/* Student Information Screens (View Only) */}
      <Stack.Screen name="BasicInformation" component={BasicInformationScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      
      {/* Educational Screens */}
      <Stack.Screen name="WeeklyMenu" component={WeeklyMenuScreen} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
      <Stack.Screen name="MonthlyPlan" component={MonthlyPlanScreen} />
      
      {/* Items & Documents */}
      <Stack.Screen name="MyBox" component={MyBoxScreen} />
      <Stack.Screen name="MyDocuments" component={MyDocumentsScreen} />
      
      {/* Communication Screens (With Edit Rights) */}
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
      <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
      <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
      <Stack.Screen name="Wall" component={WallScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="Notes" component={NotesScreen} />
      <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
      
      {/* App Features */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
