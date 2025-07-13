import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import { lostItemService, LostItemsResponse, LostItemFilters } from '../../../services';
import { PaginationControls, ScreenHeader } from '../../../components';
import { LostItemCard, FilterModal, StatisticsCard } from './components';
import Toast from 'react-native-toast-message';

interface FilterState {
  status?: 'unclaimed' | 'claimed';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

const LostItemsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [lostItems, setLostItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({});
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // API hooks
  const {
    request: fetchLostItems,
    isLoading: loadingLostItems,
    error: lostItemsError,
    data: lostItemsData,
  } = useApi<LostItemsResponse>((params: LostItemFilters) => lostItemService.getLostItems(params));

  // Load lost items when filters change
  useEffect(() => {
    loadLostItems();
  }, [currentPage, pageSize, filters]);

  const loadLostItems = async () => {
    const response = await lostItemService.getLostItems({
      page: currentPage,
      limit: pageSize,
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      search: filters.search,
    });

    if (response.success) {
      await fetchLostItems({
        page: currentPage,
        limit: pageSize,
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        search: filters.search,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load lost items',
        visibilityTime: 3000,
      });
    }
  };

  // Update lost items when data changes
  useEffect(() => {
    if (lostItemsData) {
      setLostItems(lostItemsData.items);
      setTotalPages(lostItemsData.pagination.totalPages);
      setTotalItems(lostItemsData.pagination.totalItems);
    }
  }, [lostItemsData]);

  const handleRefresh = async () => {
    await loadLostItems();
  };

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    setIsFilterModalVisible(false);
  };

  const handleFilterClear = (filterKey: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof FilterState];
      return !!value;
    }).length;
  };

  const formatFilterValue = (key: keyof FilterState, value: string) => {
    if (key === 'dateFrom' || key === 'dateTo') {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (key === 'status') {
      return value === 'unclaimed' ? 'Unclaimed' : 'Claimed';
    }
    return value;
  };

  const getFilterLabel = (key: keyof FilterState) => {
    switch (key) {
      case 'dateFrom':
        return 'From';
      case 'dateTo':
        return 'To';
      case 'status':
        return 'Status';
      case 'search':
        return 'Search';
      default:
        return key;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Lost Items" navigation={navigation} showBackButton={true} />

      {/* Main Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loadingLostItems}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }>
          {/* Statistics Card */}
          <View className="mt-4">
            <StatisticsCard />
          </View>

          {/* Filters Section */}
          <View className="mb-4 mt-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Filters
              </Text>
              <TouchableOpacity
                className="flex-row items-center rounded-lg px-4 py-2"
                style={{
                  backgroundColor: isFilterModalVisible ? colors.primary : colors.primary + '20',
                }}
                onPress={() => setIsFilterModalVisible(!isFilterModalVisible)}>
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: isFilterModalVisible ? 'white' : colors.primary,
                  }}>
                  {isFilterModalVisible ? 'Close Filters' : 'Open Filters'}
                </Text>
                {getActiveFiltersCount() > 0 && (
                  <View
                    className="ml-2 h-5 w-5 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isFilterModalVisible ? 'white' : colors.primary,
                    }}>
                    <Text
                      className="text-xs font-bold"
                      style={{
                        color: isFilterModalVisible ? colors.primary : 'white',
                      }}>
                      {getActiveFiltersCount()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Active Filters Tags */}
            {getActiveFiltersCount() > 0 && (
              <View className="flex-row flex-wrap">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;

                  return (
                    <View
                      key={key}
                      className="mb-2 mr-2 flex-row items-center rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                        {getFilterLabel(key as keyof FilterState)}:{' '}
                        {formatFilterValue(key as keyof FilterState, value)}
                      </Text>
                      <TouchableOpacity
                        className="ml-2"
                        onPress={() => handleFilterClear(key as keyof FilterState)}>
                        <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                          ×
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Loading State */}
          {loadingLostItems && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="text-lg" style={{ color: colors.textSecondary }}>
                Loading lost items...
              </Text>
            </View>
          )}

          {/* Error State */}
          {lostItemsError && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="mb-4 text-6xl">⚠️</Text>
              <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                Error Loading Lost Items
              </Text>
              <Text
                className="px-8 text-center text-base leading-6"
                style={{ color: colors.textSecondary }}>
                {lostItemsError || 'Something went wrong'}
              </Text>
              <TouchableOpacity
                className="mt-4 rounded-lg px-6 py-3"
                style={{ backgroundColor: colors.primary }}
                onPress={loadLostItems}>
                <Text className="font-semibold text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lost Items List */}
          {!loadingLostItems && lostItems.length > 0 && (
            <View className="pb-8">
              {/* Header */}
              <View className="mb-4 flex-row items-center">
                <View
                  className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.primary + '20' }}>
                  <Text className="text-2xl">🔍</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    Lost Items
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Items found around the school
                  </Text>
                </View>
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: colors.primary + '20' }}>
                  <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                    {totalItems} Item{totalItems !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              {/* Lost Items */}
              {lostItems.map((item) => (
                <LostItemCard key={item._id} item={item} />
              ))}
            </View>
          )}

          {/* No Lost Items State */}
          {!loadingLostItems && lostItems.length === 0 && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="mb-4 text-6xl">🔍</Text>
              <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                No Lost Items Found
              </Text>
              <Text
                className="px-8 text-center text-base leading-6"
                style={{ color: colors.textSecondary }}>
                No lost items match your current filters.
                {getActiveFiltersCount() > 0 && ' Try adjusting your filters.'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Fixed Pagination at Bottom */}
        {lostItems.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingLostItems}
            itemName="lost items"
          />
        )}
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        filters={filters}
        onApply={handleFilterApply}
        onClose={() => setIsFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default LostItemsScreen;
