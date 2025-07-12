import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import { menuService, WeeklyMenu } from '../../../services';
import { ScreenHeader } from '../../../components';
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
    data: menu,
  } = useApi<WeeklyMenu | null>(menuService.getCurrentWeeklyMenu);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    await fetchMenu();
  };

  const handleRefresh = async () => {
    await loadMenu();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading weekly menu..." />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        title="Weekly Menu"
        navigation={navigation}
        showBackButton={true}
      />

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        {error ? (
          <View className="items-center justify-center py-12">
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-xl font-bold mb-2" style={{ color: colors.error }}>
              Error Loading Menu
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
              onPress={handleRefresh}>
              <Text className="font-semibold text-white text-base">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : menu ? (
          <>
            <MenuHeader menu={menu} />
            <MenuContent menu={menu} />
          </>
        ) : (
          <View className="items-center justify-center py-12">
            <Text className="text-6xl mb-4">🍽️</Text>
            <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              No Menu Available
            </Text>
            <Text className="mb-6 text-center text-base leading-6 px-8" style={{ color: colors.textSecondary }}>
              There is no weekly menu available at the moment. Please check back later or contact the school.
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
              onPress={handleRefresh}>
              <Text className="font-semibold text-white text-base">Refresh Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeeklyMenuScreen;
