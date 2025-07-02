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
      year: 'numeric'
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
      className="mb-6 rounded-lg p-6"
      style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border, 
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Menu Title */}
      <Text className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
        {menu.title}
      </Text>

      {/* Menu Description */}
      {menu.description && (
        <Text className="text-base mb-4" style={{ color: colors.textSecondary }}>
          {menu.description}
        </Text>
      )}

      {/* Menu Period */}
      <View className="flex-row items-center mb-3">
        <Text className="text-sm font-medium mr-2" style={{ color: colors.textSecondary }}>
          📅 Period:
        </Text>
        <Text className="text-sm" style={{ color: colors.textPrimary }}>
          {formatDate(menu.startDate)} - {formatDate(menu.endDate)}
        </Text>
      </View>

      {/* Status and Total Items */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-sm font-medium mr-2" style={{ color: colors.textSecondary }}>
            Status:
          </Text>
          <View 
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(menu.status) }}
          >
            <Text className="text-white text-sm font-medium">
              {getStatusText(menu.status)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <Text className="text-sm font-medium mr-2" style={{ color: colors.textSecondary }}>
            Total Items:
          </Text>
          <View 
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-sm font-medium">
              {menu.totalItems}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MenuHeader;
