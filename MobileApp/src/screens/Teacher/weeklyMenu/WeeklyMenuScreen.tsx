import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import { menuService, WeeklyMenu } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import MenuHeader from './components/MenuHeader';
import MenuContent from './components/MenuContent';

const WeeklyMenuScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // API hook for fetching current weekly menu
  const {
    request: fetchMenu,
    isLoading,
    error,
    data: menu
  } = useApi<WeeklyMenu | null>(menuService.getCurrentWeeklyMenu);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    await fetchMenu();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading weekly menu..." />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      {/* Navigation Header */}
      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Weekly Menu
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {error ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-center text-lg mb-2" style={{ color: colors.textPrimary }}>
              Failed to load menu
            </Text>
            <Text className="text-center text-sm mb-4" style={{ color: colors.textSecondary }}>
              {error}
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg"
              onPress={loadMenu}
            >
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !menu ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
              No active menu found
            </Text>
            <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
              There is currently no active weekly menu available.
            </Text>
          </View>
        ) : (
          <>
            <MenuHeader menu={menu} />
            <MenuContent menu={menu} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeeklyMenuScreen;
