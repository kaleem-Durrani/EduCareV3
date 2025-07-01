import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParentStackParamList } from '../../types';

type ParentHomeScreenNavigationProp = StackNavigationProp<ParentStackParamList, 'ParentHome'>;

interface Props {
  navigation: ParentHomeScreenNavigationProp;
}

interface ModuleItem {
  id: string;
  title: string;
  icon: string; // TODO: Replace with actual icon component
  color: string;
  route: keyof ParentStackParamList;
  params?: any;
}

const ParentHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  // TODO: Replace with actual student data
  const studentData = {
    name: 'John Doe',
    photo: null, // TODO: Add actual photo
    class: 'Red Class',
    age: 4,
  };

  const modules: ModuleItem[] = [
    { id: '1', title: 'Basic Information', icon: '👤', color: colors.primary, route: 'BasicInformation', params: { studentId: 'student-1' } },
    { id: '2', title: 'Contacts', icon: '📞', color: colors.secondary, route: 'Contacts', params: { studentId: 'student-1' } },
    { id: '3', title: 'Weekly Menu', icon: '🍽️', color: colors.success, route: 'WeeklyMenu', params: { studentId: 'student-1' } },
    { id: '4', title: 'Weekly Report', icon: '📊', color: colors.warning, route: 'WeeklyReport', params: { studentId: 'student-1' } },
    { id: '5', title: 'Monthly Plan', icon: '📅', color: colors.info, route: 'MonthlyPlan', params: { studentId: 'student-1' } },
    { id: '6', title: 'My Box', icon: '📦', color: colors.primary, route: 'MyBox', params: { studentId: 'student-1' } },
    { id: '7', title: 'My Documents', icon: '📄', color: colors.secondary, route: 'MyDocuments', params: { studentId: 'student-1' } },
    { id: '8', title: 'Activities', icon: '🎯', color: colors.success, route: 'Activities' },
    { id: '9', title: 'Wall', icon: '📝', color: colors.warning, route: 'Wall' },
    { id: '10', title: 'Notes', icon: '📋', color: colors.info, route: 'Notes', params: { studentId: 'student-1' } },
    { id: '11', title: 'Lost Items', icon: '🔍', color: colors.error, route: 'LostItems' },
    { id: '12', title: 'Health', icon: '🏥', color: colors.primary, route: 'Health', params: { studentId: 'student-1' } },
    { id: '13', title: 'Payment', icon: '💳', color: colors.secondary, route: 'Payment', params: { studentId: 'student-1' } },
    { id: '14', title: 'Driver', icon: '🚌', color: colors.success, route: 'Driver' },
    { id: '15', title: 'Notifications', icon: '🔔', color: colors.warning, route: 'Notifications' },
    { id: '16', title: 'Settings', icon: '⚙️', color: colors.info, route: 'Settings' },
    { id: '17', title: 'Contact', icon: '💬', color: colors.primary, route: 'Settings' }, // WhatsApp integration
    { id: '18', title: 'Feedback', icon: '📢', color: colors.secondary, route: 'Settings' }, // Feedback form
  ];

  const handleModulePress = (module: ModuleItem) => {
    if (module.params) {
      navigation.navigate(module.route as any, module.params);
    } else {
      navigation.navigate(module.route as any);
    }
  };

  const renderModule = (module: ModuleItem) => (
    <TouchableOpacity
      key={module.id}
      className="flex-1 m-1 p-4 rounded-lg items-center justify-center min-h-[100px]"
      style={{ backgroundColor: module.color }}
      onPress={() => handleModulePress(module)}
    >
      <Text className="text-3xl mb-2">{module.icon}</Text>
      <Text 
        className="text-center text-sm font-medium"
        style={{ color: colors.textOnPrimary }}
        numberOfLines={2}
      >
        {module.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header with Logo */}
      <View className="items-center pt-4 pb-4">
        <Text 
          className="text-xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          Centro Infantil EDUCARE
        </Text>
        {/* Black line under logo */}
        <View 
          className="w-full h-px"
          style={{ backgroundColor: '#000000' }}
        />
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Student Summary Section */}
        <View 
          className="p-4 rounded-lg mb-6 flex-row items-center"
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
        >
          {/* Student Photo Placeholder */}
          <View 
            className="w-16 h-16 rounded-full mr-4 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-2xl">👶</Text>
          </View>
          
          {/* Student Info */}
          <View className="flex-1">
            <Text 
              className="text-lg font-bold"
              style={{ color: colors.textPrimary }}
            >
              {studentData.name}
            </Text>
            <Text 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              {studentData.class} • Age {studentData.age}
            </Text>
          </View>
        </View>

        {/* Modules Grid - 3 columns, 6 rows */}
        <View className="mb-6">
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row mb-2">
              {modules.slice(rowIndex * 3, (rowIndex + 1) * 3).map(renderModule)}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParentHomeScreen;
