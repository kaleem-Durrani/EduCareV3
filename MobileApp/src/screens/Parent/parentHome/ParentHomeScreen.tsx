import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useViewMode } from '../../../hooks';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParentStackParamList } from '../../../types';

type ParentHomeScreenNavigationProp = StackNavigationProp<ParentStackParamList, 'ParentHome'>;

interface Props {
  navigation: ParentHomeScreenNavigationProp;
}

interface ModuleItem {
  id: string;
  title: string;
  icon: string; // TODO: Replace with actual icon component
  route: keyof ParentStackParamList;
  params?: any;
}

const ParentHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { viewMode, toggleViewMode } = useViewMode();

  // TODO: Replace with actual student data
  const studentData = {
    name: 'John Doe',
    photo: null, // TODO: Add actual photo
    class: 'Red Class',
    age: 4,
  };

  // Use real student ID from test data
  const STUDENT_ID = '686bf7982acc4588d3bcc0e1'; // John Doe's ID (updated for educare_db)

  const modules: ModuleItem[] = [
    {
      id: '1',
      title: 'Basic Information',
      icon: '👤',
      route: 'BasicInformation',
      params: { studentId: STUDENT_ID },
    },
    {
      id: '2',
      title: 'Contacts',
      icon: '📞',
      route: 'Contacts',
      params: { studentId: STUDENT_ID },
    },
    {
      id: '3',
      title: 'Weekly Menu',
      icon: '🍽️',
      route: 'WeeklyMenu',
      params: { studentId: STUDENT_ID },
    },
    {
      id: '4',
      title: 'Weekly Report',
      icon: '📊',
      route: 'WeeklyReport',
      params: { studentId: STUDENT_ID },
    },
    {
      id: '5',
      title: 'Monthly Plan',
      icon: '📅',
      route: 'MonthlyPlan',
      params: { studentId: STUDENT_ID },
    },
    { id: '6', title: 'My Box', icon: '📦', route: 'MyBox', params: { studentId: STUDENT_ID } },
    {
      id: '7',
      title: 'My Documents',
      icon: '📄',
      route: 'MyDocuments',
      params: { studentId: STUDENT_ID },
    },
    {
      id: '8',
      title: 'Activities',
      icon: '🎯',
      route: 'Activities',
      params: { studentId: STUDENT_ID },
    },
    { id: '9', title: 'Wall', icon: '📝', route: 'Wall', params: { studentId: STUDENT_ID } },
    { id: '10', title: 'Notes', icon: '📋', route: 'Notes', params: { studentId: STUDENT_ID } },
    { id: '11', title: 'Lost Items', icon: '🔍', route: 'LostItems' },
    { id: '12', title: 'Health', icon: '🏥', route: 'Health', params: { studentId: STUDENT_ID } },
    {
      id: '13',
      title: 'Payment',
      icon: '💳',
      route: 'Payment',
      params: { studentId: STUDENT_ID },
    },
    { id: '14', title: 'Driver', icon: '🚌', route: 'Driver', params: { studentId: STUDENT_ID } },
    { id: '15', title: 'Notifications', icon: '🔔', route: 'Notifications' },
    { id: '16', title: 'Settings', icon: '⚙️', route: 'Settings' },
    { id: '17', title: 'Contact', icon: '💬', route: 'Settings' }, // WhatsApp integration
    { id: '18', title: 'Feedback', icon: '📢', route: 'Settings' }, // Feedback form
  ];

  const handleModulePress = (module: ModuleItem) => {
    if (module.params) {
      navigation.navigate(module.route as any, module.params);
    } else {
      navigation.navigate(module.route as any);
    }
  };

  const renderTileModule = (module: ModuleItem) => (
    <TouchableOpacity
      key={module.id}
      className="m-1 min-h-[100px] flex-1 items-center justify-center rounded-lg p-4"
      style={{
        backgroundColor: colors.surface,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.borderLight,
      }}
      onPress={() => handleModulePress(module)}>
      <Text className="mb-2 text-3xl">{module.icon}</Text>
      <Text
        className="text-center text-sm font-medium"
        style={{ color: colors.textPrimary }}
        numberOfLines={2}>
        {module.title}
      </Text>
    </TouchableOpacity>
  );

  const renderListModule = (module: ModuleItem) => (
    <TouchableOpacity
      key={module.id}
      className="mx-2 mb-2 flex-row items-center rounded-lg p-4"
      style={{
        backgroundColor: colors.surface,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.borderLight,
      }}
      onPress={() => handleModulePress(module)}>
      <Text className="mr-4 text-2xl">{module.icon}</Text>
      <View className="flex-1">
        <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
          {module.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header with Logo and View Toggle */}
      <View className="pb-4 pt-4">
        <View className="mb-2 flex-row items-center justify-between px-4">
          <Text className="flex-1 text-center text-xl font-bold" style={{ color: colors.primary }}>
            Centro Infantil EDUCARE
          </Text>
          {/* View Mode Toggle */}
          <View className="flex-row">
            <TouchableOpacity
              className="mr-1 rounded-lg p-2"
              style={{
                backgroundColor: viewMode === 'tiles' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => viewMode !== 'tiles' && toggleViewMode()}>
              <Text
                style={{
                  color: viewMode === 'tiles' ? colors.textOnPrimary : colors.textPrimary,
                  fontSize: 16,
                }}>
                ⊞
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-lg p-2"
              style={{
                backgroundColor: viewMode === 'list' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => viewMode !== 'list' && toggleViewMode()}>
              <Text
                style={{
                  color: viewMode === 'list' ? colors.textOnPrimary : colors.textPrimary,
                  fontSize: 16,
                }}>
                ☰
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Black line under logo */}
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Student Summary Section */}
        <View
          className="mb-6 flex-row items-center rounded-lg p-4"
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
          {/* Student Photo Placeholder */}
          <View
            className="mr-4 h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primary }}>
            <Text className="text-2xl">👶</Text>
          </View>

          {/* Student Info */}
          <View className="flex-1">
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              {studentData.name}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {studentData.class} • Age {studentData.age}
            </Text>
          </View>
        </View>

        {/* Modules */}
        <View className="mb-6">
          {viewMode === 'tiles'
            ? // Tiles View - 3 columns, 6 rows
              Array.from({ length: 6 }, (_, rowIndex) => (
                <View key={rowIndex} className="mb-2 flex-row">
                  {modules.slice(rowIndex * 3, (rowIndex + 1) * 3).map(renderTileModule)}
                </View>
              ))
            : // List View
              modules.map(renderListModule)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParentHomeScreen;
