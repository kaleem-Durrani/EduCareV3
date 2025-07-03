import { createStackNavigator } from '@react-navigation/stack';
import { TeacherStackParamList } from '../types';
import { TeacherClassesProvider } from '../contexts';

// Import Teacher screens
import TeacherHomeScreen from '../screens/Teacher/teacherHome';
import OurKidsScreen from '../screens/Teacher/ourKids';
import StudentProfileScreen from '../screens/Teacher/studentProfile';
import BasicInformationScreen from '../screens/Teacher/basicInformation';
import ContactsScreen from '../screens/Teacher/contacts';
import WeeklyMenuScreen from '../screens/Teacher/weeklyMenu';
import WeeklyReportScreen from '../screens/Teacher/weeklyReport';
import MonthlyPlanScreen from '../screens/Teacher/monthlyPlan';
import MyBoxScreen from '../screens/Teacher/myBox';
import MyDocumentsScreen from '../screens/Teacher/myDocuments';
import ActivitiesScreen from '../screens/Teacher/activities';
import ActivityDetailScreen from '../screens/Teacher/activityDetail';
import CreateActivityScreen from '../screens/Teacher/createActivity';
import WallScreen from '../screens/Teacher/wall';
import CreatePostScreen from '../screens/Teacher/createPost';
import NotesScreen from '../screens/Teacher/notes';
import CreateNoteScreen from '../screens/Teacher/createNote';
import NotificationsScreen from '../screens/Shared/notifications';
import SettingsScreen from '../screens/Shared/settings';

const Stack = createStackNavigator<TeacherStackParamList>();

export const TeacherNavigator = () => {
  return (
    <TeacherClassesProvider userRole="teacher">
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
    </TeacherClassesProvider>
  );
};
