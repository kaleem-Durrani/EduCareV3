import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { useViewMode } from '../../hooks';
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
  route: keyof TeacherStackParamList;
  hasEditRights?: boolean;
}

const TeacherHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { viewMode, toggleViewMode } = useViewMode();

  // TODO: Replace with actual teacher data
  const teacherData = {
    name: 'Ms. Sarah Johnson',
    photo: null,
    classes: ['Red Class', 'Blue Class'],
  };

  const modules: ModuleItem[] = [
    { id: '1', title: 'Our Kids', icon: '👥', route: 'OurKids' },
    { id: '2', title: 'Basic Information', icon: '👤', route: 'BasicInformation' },
    { id: '3', title: 'Contacts', icon: '📞', route: 'Contacts' },
    { id: '4', title: 'Weekly Menu', icon: '🍽️', route: 'WeeklyMenu' },
    { id: '5', title: 'Weekly Report', icon: '📊', route: 'WeeklyReport', hasEditRights: true },
    { id: '6', title: 'Monthly Plan', icon: '📅', route: 'MonthlyPlan' },
    { id: '7', title: 'My Box', icon: '📦', route: 'MyBox', hasEditRights: true },
    { id: '8', title: 'My Documents', icon: '📄', route: 'MyDocuments' },
    { id: '9', title: 'Activities', icon: '🎯', route: 'Activities', hasEditRights: true },
    { id: '10', title: 'Wall', icon: '📝', route: 'Wall', hasEditRights: true },
    { id: '11', title: 'Notes', icon: '📋', route: 'Notes', hasEditRights: true },
    { id: '12', title: 'Lost Items', icon: '🔍', route: 'OurKids' }, // Navigate to class first
    { id: '13', title: 'Health', icon: '🏥', route: 'OurKids' }, // Navigate to class first
    { id: '14', title: 'Payment', icon: '💳', route: 'OurKids' }, // Navigate to class first
    { id: '15', title: 'Driver', icon: '🚌', route: 'OurKids' }, // Navigate to class first
    { id: '16', title: 'Notifications', icon: '🔔', route: 'Notifications' },
    { id: '17', title: 'Settings', icon: '⚙️', route: 'Settings' },
    { id: '18', title: 'Contact', icon: '💬', route: 'Settings' }, // WhatsApp integration
  ];

  const handleModulePress = (module: ModuleItem) => {
    navigation.navigate(module.route as any);
  };

  const renderTileModule = (module: ModuleItem) => (
    <TouchableOpacity
      key={module.id}
      className="flex-1 m-1 p-4 rounded-lg items-center justify-center min-h-[100px] relative"
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
      onPress={() => handleModulePress(module)}
    >
      {/* Edit Rights Indicator */}
      {module.hasEditRights && (
        <View
          className="absolute top-2 right-2 w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.success }}
        />
      )}

      <Text className="text-3xl mb-2">{module.icon}</Text>
      <Text
        className="text-center text-sm font-medium"
        style={{ color: colors.textPrimary }}
        numberOfLines={2}
      >
        {module.title}
      </Text>
    </TouchableOpacity>
  );

  const renderListModule = (module: ModuleItem) => (
    <TouchableOpacity
      key={module.id}
      className="mx-2 mb-2 p-4 rounded-lg flex-row items-center"
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
      onPress={() => handleModulePress(module)}
    >
      <Text className="text-2xl mr-4">{module.icon}</Text>
      <View className="flex-1">
        <Text
          className="text-base font-medium"
          style={{ color: colors.textPrimary }}
        >
          {module.title}
        </Text>
      </View>
      {/* Edit Rights Indicator */}
      {module.hasEditRights && (
        <View
          className="w-3 h-3 rounded-full ml-2"
          style={{ backgroundColor: colors.success }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header with Logo and View Toggle */}
      <View className="pt-4 pb-4">
        <View className="flex-row items-center justify-between px-4 mb-2">
          <Text
            className="text-xl font-bold flex-1 text-center"
            style={{ color: colors.primary }}
          >
            Centro Infantil EDUCARE
          </Text>
          {/* View Mode Toggle */}
          <View className="flex-row">
            <TouchableOpacity
              className="p-2 rounded-lg mr-1"
              style={{
                backgroundColor: viewMode === 'tiles' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => viewMode !== 'tiles' && toggleViewMode()}
            >
              <Text
                style={{
                  color: viewMode === 'tiles' ? colors.textOnPrimary : colors.textPrimary,
                  fontSize: 16,
                }}
              >
                ⊞
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-lg"
              style={{
                backgroundColor: viewMode === 'list' ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => viewMode !== 'list' && toggleViewMode()}
            >
              <Text
                style={{
                  color: viewMode === 'list' ? colors.textOnPrimary : colors.textPrimary,
                  fontSize: 16,
                }}
              >
                ☰
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

        {/* Modules */}
        <View className="mb-6">
          {viewMode === 'tiles' ? (
            // Tiles View - 3 columns, 6 rows
            Array.from({ length: 6 }, (_, rowIndex) => (
              <View key={rowIndex} className="flex-row mb-2">
                {modules.slice(rowIndex * 3, (rowIndex + 1) * 3).map(renderTileModule)}
              </View>
            ))
          ) : (
            // List View
            modules.map(renderListModule)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherHomeScreen;
