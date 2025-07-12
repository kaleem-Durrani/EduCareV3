import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '../../../../contexts';
import { WeeklyMenu, MenuDayItem } from '../../../../services';

interface MenuContentProps {
  menu: WeeklyMenu;
}

const MenuContent: React.FC<MenuContentProps> = ({ menu }) => {
  const { colors } = useTheme();

  const getDayIcon = (day: string) => {
    switch (day.toLowerCase()) {
      case 'monday':
        return '🌟';
      case 'tuesday':
        return '🌈';
      case 'wednesday':
        return '🌸';
      case 'thursday':
        return '🌺';
      case 'friday':
        return '🎉';
      case 'saturday':
        return '🌅';
      case 'sunday':
        return '☀️';
      default:
        return '🍽️';
    }
  };

  const getDayColor = (day: string) => {
    switch (day.toLowerCase()) {
      case 'monday':
        return '#3B82F6'; // Blue
      case 'tuesday':
        return '#10B981'; // Green
      case 'wednesday':
        return '#F59E0B'; // Yellow
      case 'thursday':
        return '#EF4444'; // Red
      case 'friday':
        return '#8B5CF6'; // Purple
      case 'saturday':
        return '#06B6D4'; // Cyan
      case 'sunday':
        return '#F97316'; // Orange
      default:
        return '#6B7280'; // Gray
    }
  };

  const renderDayMenu = ({ item }: { item: MenuDayItem }) => (
    <View
      className="mb-6 rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      {/* Day Header */}
      <View className="flex-row items-center mb-4">
        <View
          className="mr-4 h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: getDayColor(item.day) + '20' }}>
          <Text className="text-2xl">{getDayIcon(item.day)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {item.day}
          </Text>
          <View className="flex-row items-center mt-1">
            <View
              className="mr-2 rounded-full px-2 py-1"
              style={{ backgroundColor: getDayColor(item.day) + '20' }}>
              <Text className="text-xs font-semibold" style={{ color: getDayColor(item.day) }}>
                {item.items.length} item{item.items.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      {item.items.length > 0 ? (
        <View className="space-y-3">
          {item.items.map((menuItem, index) => (
            <View
              key={index}
              className="flex-row items-center p-4 rounded-xl"
              style={{
                backgroundColor: colors.background,
                borderLeftWidth: 3,
                borderLeftColor: getDayColor(item.day),
              }}
            >
              <View
                className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: getDayColor(item.day) + '20' }}>
                <Text className="text-sm">🍽️</Text>
              </View>
              <Text className="text-base flex-1 font-medium leading-6" style={{ color: colors.textPrimary }}>
                {menuItem}
              </Text>
              <View
                className="ml-2 h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.success + '20' }}>
                <Text className="text-xs">✓</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-6">
          <Text className="text-4xl mb-2">🍽️</Text>
          <Text className="text-base font-medium" style={{ color: colors.textSecondary }}>
            No items planned for this day
          </Text>
          <Text className="text-sm mt-1" style={{ color: colors.textMuted }}>
            Check back later for updates
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyMenu = () => (
    <View className="items-center py-12">
      <Text className="text-6xl mb-4">📋</Text>
      <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
        No menu data available
      </Text>
      <Text className="text-base text-center leading-6 px-8" style={{ color: colors.textSecondary }}>
        The menu doesn't have any daily items configured yet. Please check back later.
      </Text>
    </View>
  );

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-6">
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary + '20' }}>
          <Text className="text-xl">📋</Text>
        </View>
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Weekly Menu Details
        </Text>
      </View>

      {menu.menuData && menu.menuData.length > 0 ? (
        <FlatList
          data={menu.menuData}
          keyExtractor={(item) => item.day}
          renderItem={renderDayMenu}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disable scroll since we're inside a ScrollView
        />
      ) : (
        renderEmptyMenu()
      )}
    </View>
  );
};

export default MenuContent;
