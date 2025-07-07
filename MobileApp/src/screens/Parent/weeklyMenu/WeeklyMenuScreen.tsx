import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
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
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Weekly Menu
          </Text>
        </TouchableOpacity>
      </View>

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
          <View className="items-center justify-center py-8">
            <Text className="mb-2 text-lg" style={{ color: colors.error }}>
              Error Loading Menu
            </Text>
            <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
              {error}
            </Text>
            <TouchableOpacity
              className="rounded-lg px-6 py-3"
              style={{ backgroundColor: colors.primary }}
              onPress={handleRefresh}>
              <Text className="font-medium text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : menu ? (
          <>
            <MenuHeader menu={menu} />
            <MenuContent menu={menu} />
          </>
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="mb-2 text-lg" style={{ color: colors.textPrimary }}>
              No Menu Available
            </Text>
            <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
              There is no weekly menu available at the moment. Please check back later.
            </Text>
            <TouchableOpacity
              className="rounded-lg px-6 py-3"
              style={{ backgroundColor: colors.primary }}
              onPress={handleRefresh}>
              <Text className="font-medium text-white">Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeeklyMenuScreen;
