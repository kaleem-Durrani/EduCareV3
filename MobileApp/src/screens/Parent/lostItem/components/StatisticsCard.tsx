import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { useApi } from '../../../../hooks';
import { lostItemService, LostItemStatistics } from '../../../../services';

export const StatisticsCard: React.FC = () => {
  const { colors } = useTheme();

  const {
    request: fetchStatistics,
    isLoading: loadingStatistics,
    data: statisticsData,
  } = useApi<LostItemStatistics>(lostItemService.getLostItemStatistics);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const response = await lostItemService.getLostItemStatistics();
    if (response.success) {
      await fetchStatistics();
    }
  };

  if (loadingStatistics) {
    return (
      <View
        className="rounded-xl p-5"
        style={{
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 5,
        }}>
        <Text className="text-center" style={{ color: colors.textSecondary }}>
          Loading statistics...
        </Text>
      </View>
    );
  }

  if (!statisticsData) {
    return null;
  }

  return (
    <View
      className="rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
      }}>
      
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary + '20' }}>
          <Text className="text-2xl">📊</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            Lost Items Overview
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Current statistics for all lost items
          </Text>
        </View>
      </View>

      {/* Statistics Grid */}
      <View className="flex-row flex-wrap">
        <View className="mb-3 w-1/2 pr-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: colors.primary + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
              {statisticsData.totalItems}
            </Text>
            <Text className="text-sm" style={{ color: colors.primary }}>
              Total Items
            </Text>
          </View>
        </View>
        
        <View className="mb-3 w-1/2 pl-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: '#F59E0B' + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
              {statisticsData.unclaimedItems}
            </Text>
            <Text className="text-sm" style={{ color: '#F59E0B' }}>
              Unclaimed
            </Text>
          </View>
        </View>

        <View className="mb-3 w-1/2 pr-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: '#10B981' + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: '#10B981' }}>
              {statisticsData.claimedItems}
            </Text>
            <Text className="text-sm" style={{ color: '#10B981' }}>
              Claimed
            </Text>
          </View>
        </View>

        <View className="mb-3 w-1/2 pl-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: '#8B5CF6' + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
              {statisticsData.recentItems}
            </Text>
            <Text className="text-sm" style={{ color: '#8B5CF6' }}>
              Recent (30 days)
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mt-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            Claim Rate
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {statisticsData.totalItems > 0 
              ? Math.round((statisticsData.claimedItems / statisticsData.totalItems) * 100) 
              : 0}%
          </Text>
        </View>
        <View
          className="h-2 rounded-full"
          style={{ backgroundColor: colors.border }}>
          <View
            className="h-2 rounded-full"
            style={{
              backgroundColor: '#10B981',
              width: `${statisticsData.totalItems > 0 
                ? (statisticsData.claimedItems / statisticsData.totalItems) * 100 
                : 0}%`,
            }}
          />
        </View>
      </View>
    </View>
  );
};
