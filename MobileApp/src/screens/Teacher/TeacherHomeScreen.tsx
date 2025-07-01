import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { TeacherStackParamList } from '../../types';

type TeacherHomeScreenNavigationProp = StackNavigationProp<TeacherStackParamList, 'TeacherHome'>;

interface Props {
  navigation: TeacherHomeScreenNavigationProp;
}

interface ModuleItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: keyof TeacherStackParamList;
  hasEditRights?: boolean;
}

const TeacherHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  // TODO: Replace with actual teacher data
  const teacherData = {
    name: 'Ms. Sarah Johnson',
    photo: null,
    classes: ['Red Class', 'Blue Class'],
  };

  const modules: ModuleItem[] = [
    { id: '1', title: 'Our Kids', icon: '👥', color: colors.primary, route: 'OurKids' },
    { id: '2', title: 'Basic Information', icon: '👤', color: colors.secondary, route: 'BasicInformation' },
    { id: '3', title: 'Contacts', icon: '📞', color: colors.success, route: 'Contacts' },
    { id: '4', title: 'Weekly Menu', icon: '🍽️', color: colors.warning, route: 'WeeklyMenu' },
    { id: '5', title: 'Weekly Report', icon: '📊', color: colors.info, route: 'WeeklyReport', hasEditRights: true },
    { id: '6', title: 'Monthly Plan', icon: '📅', color: colors.primary, route: 'MonthlyPlan' },
    { id: '7', title: 'My Box', icon: '📦', color: colors.secondary, route: 'MyBox', hasEditRights: true },
    { id: '8', title: 'My Documents', icon: '📄', color: colors.success, route: 'MyDocuments' },
    { id: '9', title: 'Activities', icon: '🎯', color: colors.warning, route: 'Activities', hasEditRights: true },
    { id: '10', title: 'Wall', icon: '📝', color: colors.info, route: 'Wall', hasEditRights: true },
    { id: '11', title: 'Notes', icon: '📋', color: colors.primary, route: 'Notes', hasEditRights: true },
    { id: '12', title: 'Lost Items', icon: '🔍', color: colors.error, route: 'OurKids' }, // Navigate to class first
    { id: '13', title: 'Health', icon: '🏥', color: colors.secondary, route: 'OurKids' }, // Navigate to class first
    { id: '14', title: 'Payment', icon: '💳', color: colors.success, route: 'OurKids' }, // Navigate to class first
    { id: '15', title: 'Driver', icon: '🚌', color: colors.warning, route: 'OurKids' }, // Navigate to class first
    { id: '16', title: 'Notifications', icon: '🔔', color: colors.info, route: 'Notifications' },
    { id: '17', title: 'Settings', icon: '⚙️', color: colors.primary, route: 'Settings' },
    { id: '18', title: 'Contact', icon: '💬', color: colors.secondary, route: 'Settings' }, // WhatsApp integration
  ];

  const handleModulePress = (module: ModuleItem) => {
    navigation.navigate(module.route as any);
  };

  const renderModule = (module: ModuleItem) => (
    <TouchableOpacity
      key={module.id}
      className="flex-1 m-1 p-4 rounded-lg items-center justify-center min-h-[100px] relative"
      style={{ backgroundColor: module.color }}
      onPress={() => handleModulePress(module)}
    >
      {/* Edit Rights Indicator */}
      {module.hasEditRights && (
        <View 
          className="absolute top-1 right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.success }}
        />
      )}
      
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
        {/* Teacher Summary Section */}
        <View 
          className="p-4 rounded-lg mb-6 flex-row items-center"
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
        >
          {/* Teacher Photo Placeholder */}
          <View 
            className="w-16 h-16 rounded-full mr-4 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-2xl">👩‍🏫</Text>
          </View>
          
          {/* Teacher Info */}
          <View className="flex-1">
            <Text 
              className="text-lg font-bold"
              style={{ color: colors.textPrimary }}
            >
              {teacherData.name}
            </Text>
            <Text 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              Classes: {teacherData.classes.join(', ')}
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-row items-center mb-4">
          <View 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: colors.success }}
          />
          <Text 
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            Green dot = Edit rights
          </Text>
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

export default TeacherHomeScreen;
