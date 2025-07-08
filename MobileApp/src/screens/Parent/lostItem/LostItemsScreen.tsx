import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { lostItemService, LostItem } from '../../../services';

const LostItemsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'found' | 'claimed' | 'returned'>('all');

  useEffect(() => {
    fetchLostItems();
  }, [statusFilter]);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const response = await lostItemService.getAllLostItems({
        limit: 50,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });

      if (response.success) {
        setLostItems(response.data.lostItems || []);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch lost items');
      }
    } catch (error) {
      console.error('Error fetching lost items:', error);
      Alert.alert('Error', 'Failed to fetch lost items');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLostItems();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'found':
        return '#10B981'; // Green
      case 'claimed':
        return '#F59E0B'; // Yellow
      case 'returned':
        return '#6B7280'; // Gray
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'found':
        return 'Found';
      case 'claimed':
        return 'Claimed';
      case 'returned':
        return 'Returned';
      default:
        return 'Unknown';
    }
  };

  const renderFilterButton = (filter: typeof statusFilter, label: string) => (
    <TouchableOpacity
      className={`mr-2 rounded-full px-4 py-2 ${statusFilter === filter ? 'bg-blue-500' : 'bg-gray-200'}`}
      onPress={() => setStatusFilter(filter)}>
      <Text
        className={`text-sm font-medium ${statusFilter === filter ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLostItemItem = ({ item }: { item: LostItem }) => (
    <View className="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <View className="flex-row items-start">
        {item.imageUrl ? (
          <Image
            source={{ uri: lostItemService.getLostItemImageUrl(item._id) }}
            className="mr-3 h-16 w-16 rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="mr-3 h-16 w-16 items-center justify-center rounded-lg bg-gray-300">
            <Text className="text-2xl">📦</Text>
          </View>
        )}

        <View className="flex-1">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
              {item.name}
            </Text>
            <View
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: getStatusColor(item.status) + '20' }}>
              <Text className="text-xs font-medium" style={{ color: getStatusColor(item.status) }}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>

          <Text className="mb-2 text-sm" style={{ color: colors.textSecondary }}>
            {item.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              📍 {item.location}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Found: {formatDate(item.dateFound)}
            </Text>
          </View>

          {item.claimedBy && (
            <Text className="mt-1 text-xs" style={{ color: colors.primary }}>
              Claimed by: {item.claimedBy.name}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

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
            Lost & Found Items
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 py-2">
        <FlatList
          horizontal
          data={[
            { filter: 'all' as const, label: 'All' },
            { filter: 'found' as const, label: 'Found' },
            { filter: 'claimed' as const, label: 'Claimed' },
            { filter: 'returned' as const, label: 'Returned' },
          ]}
          renderItem={({ item }) => renderFilterButton(item.filter, item.label)}
          keyExtractor={(item) => item.filter}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
            Loading lost items...
          </Text>
        </View>
      ) : lostItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Lost Items Found
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            No {statusFilter === 'all' ? '' : statusFilter + ' '}lost items found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={lostItems}
          renderItem={renderLostItemItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default LostItemsScreen;
