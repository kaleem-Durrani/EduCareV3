import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import { menuService, WeeklyMenu } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import MenuHeader from './components/MenuHeader';
import MenuContent from './components/MenuContent';
import { ScreenHeader } from '~/components';

const WeeklyMenuScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // API hook for fetching current weekly menu
  const {
    request: fetchMenu,
    isLoading,
    error,
    data: menu,
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

      <ScreenHeader navigation={navigation} title={'Weekly Menu'} />

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {error ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="mb-2 text-center text-lg" style={{ color: colors.textPrimary }}>
              Failed to load menu
            </Text>
            <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
              {error}
            </Text>
            <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3" onPress={loadMenu}>
              <Text className="font-medium text-white">Retry</Text>
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
