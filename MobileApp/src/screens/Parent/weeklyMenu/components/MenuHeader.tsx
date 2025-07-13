import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { WeeklyMenu } from '../../../../services';

interface MenuHeaderProps {
  menu: WeeklyMenu;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ menu }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981'; // Green
      case 'draft':
        return '#F59E0B'; // Yellow
      case 'archived':
        return '#6B7280'; // Gray
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  return (
    <View
      className="mb-6 rounded-xl p-6"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      }}>
      {/* Header with Icon */}
      <View className="mb-4 flex-row items-center">
        <View
          className="mr-4 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary + '20' }}>
          <Text className="text-2xl">🍽️</Text>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {menu.title}
          </Text>
          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
            Weekly Menu Plan
          </Text>
        </View>
      </View>

      {/* Menu Description */}
      {menu.description && (
        <View className="mb-4 rounded-lg p-3" style={{ backgroundColor: colors.background }}>
          <Text className="text-base leading-6" style={{ color: colors.textSecondary }}>
            {menu.description}
          </Text>
        </View>
      )}

      {/* Menu Period */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{
          backgroundColor: colors.info + '10',
          borderLeftWidth: 4,
          borderLeftColor: colors.info,
        }}>
        <View className="mb-2 flex-row items-center">
          <Text className="mr-2 text-xl">📅</Text>
          <Text className="text-base font-semibold" style={{ color: colors.info }}>
            Menu Period
          </Text>
        </View>
        <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
          {formatDate(menu.startDate)} - {formatDate(menu.endDate)}
        </Text>
      </View>

      {/* Status and Total Items */}
      <View className="flex-row gap-2 space-x-3">
        {/* Status Card */}
        <View className="flex-1">
          <View
            className="rounded-lg p-4"
            style={{
              backgroundColor: getStatusColor(menu.status) + '20',
              borderLeftWidth: 4,
              borderLeftColor: getStatusColor(menu.status),
            }}>
            <View className="mb-1 flex-row items-center">
              <Text className="mr-2 text-lg">
                {menu.status === 'active' ? '✅' : menu.status === 'draft' ? '📝' : '📁'}
              </Text>
              <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                Status
              </Text>
            </View>
            <Text className="text-base font-bold" style={{ color: getStatusColor(menu.status) }}>
              {getStatusText(menu.status)}
            </Text>
          </View>
        </View>

        {/* Total Items Card */}
        <View className="flex-1">
          <View
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.primary + '20',
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}>
            <View className="mb-1 flex-row items-center">
              <Text className="mr-2 text-lg">🍽️</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                Total Items
              </Text>
            </View>
            <Text className="text-base font-bold" style={{ color: colors.primary }}>
              {menu.totalItems} Items
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MenuHeader;
