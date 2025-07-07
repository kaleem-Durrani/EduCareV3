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
      default:
        return '🍽️';
    }
  };

  const renderDayMenu = ({ item }: { item: MenuDayItem }) => (
    <View
      className="mb-4 rounded-lg p-4"
      style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border, 
        borderWidth: 1 
      }}
    >
      {/* Day Header */}
      <View className="flex-row items-center mb-3">
        <Text className="text-2xl mr-3">{getDayIcon(item.day)}</Text>
        <View className="flex-1">
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {item.day}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {item.items.length} item{item.items.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      {item.items.length > 0 ? (
        <View className="space-y-2">
          {item.items.map((menuItem, index) => (
            <View 
              key={index}
              className="flex-row items-center p-3 rounded-lg"
              style={{ backgroundColor: colors.background }}
            >
              <Text className="text-base mr-3">🍽️</Text>
              <Text className="text-base flex-1" style={{ color: colors.textPrimary }}>
                {menuItem}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-4">
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            No items planned for this day
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyMenu = () => (
    <View className="items-center py-8">
      <Text className="text-lg" style={{ color: colors.textPrimary }}>
        No menu data available
      </Text>
      <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
        The menu doesn't have any daily items configured yet.
      </Text>
    </View>
  );

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        📋 Weekly Menu Details
      </Text>

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
