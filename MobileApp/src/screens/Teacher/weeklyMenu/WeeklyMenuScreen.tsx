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
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-xl font-bold mb-2" style={{ color: colors.error }}>
              Failed to load menu
            </Text>
            <Text className="mb-6 text-center text-base leading-6 px-8" style={{ color: colors.textSecondary }}>
              {error || 'Something went wrong while loading the menu. Please try again.'}
            </Text>
            <TouchableOpacity
              className="rounded-xl px-8 py-4"
              style={{
                backgroundColor: colors.primary,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={loadMenu}>
              <Text className="font-semibold text-white text-base">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !menu ? (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-6xl mb-4">🍽️</Text>
            <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              No active menu found
            </Text>
            <Text className="text-center text-base leading-6 px-8" style={{ color: colors.textSecondary }}>
              There is currently no active weekly menu available. Please contact the administration.
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
