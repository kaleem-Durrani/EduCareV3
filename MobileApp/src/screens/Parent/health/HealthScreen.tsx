import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import {
  healthService,
  HealthMetricsResponse,
  HealthInfo,
  HealthMetricFilters,
  ParentStudent,
} from '../../../services';
import { ChildSelector, PaginationControls, ScreenHeader } from '../../../components';
import { HealthMetricsCard, FilterModal, HealthInfoModal } from './components';
import Toast from 'react-native-toast-message';

interface FilterState {
  type?: 'height' | 'weight';
  period?: 'week' | 'month' | '3months' | '6months' | 'year';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'type' | 'value';
  sortOrder?: 'asc' | 'desc';
}

const HealthScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isHealthInfoModalVisible, setIsHealthInfoModalVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const { children, isLoading: isLoadingChildren, refreshChildren } = useParentChildren();

  // API hooks for health metrics
  const {
    request: fetchHealthMetrics,
    isLoading: loadingHealthMetrics,
    error: healthMetricsError,
    data: healthMetricsData,
  } = useApi<HealthMetricsResponse>((params: HealthMetricFilters & { studentId: string }) =>
    healthService.getHealthMetrics(params.studentId, {
      page: params.page,
      limit: params.limit,
      type: params.type,
      period: params.period,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })
  );

  // API hooks for health info
  const {
    request: fetchHealthInfo,
    isLoading: loadingHealthInfo,
    error: healthInfoError,
    data: healthInfoData,
  } = useApi<HealthInfo>(healthService.getHealthInfo);

  // Load health data when child or filters change
  useEffect(() => {
    if (selectedChild) {
      loadHealthData();
    } else {
      setHealthMetrics([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [selectedChild, currentPage, pageSize, filters]);

  const loadHealthData = async () => {
    if (!selectedChild) return;

    // Load health metrics only
    const healthMetricsResponse = await healthService.getHealthMetrics(selectedChild._id, {
      page: currentPage,
      limit: pageSize,
      type: filters.type,
      period: filters.period,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    if (healthMetricsResponse.success) {
      await fetchHealthMetrics({
        studentId: selectedChild._id,
        page: currentPage,
        limit: pageSize,
        type: filters.type,
        period: filters.period,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: healthMetricsResponse.message || 'Failed to load health metrics',
        visibilityTime: 3000,
      });
    }
  };

  const loadHealthInfo = async () => {
    if (!selectedChild) return;

    const healthInfoResponse = await healthService.getHealthInfo(selectedChild._id);
    if (healthInfoResponse.success) {
      await fetchHealthInfo(selectedChild._id);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: healthInfoResponse.message || 'Failed to load health information',
        visibilityTime: 3000,
      });
    }
  };

  // Update health metrics when data changes
  useEffect(() => {
    if (healthMetricsData) {
      setHealthMetrics(healthMetricsData.metrics);
      setTotalPages(healthMetricsData.pagination.totalPages);
      setTotalItems(healthMetricsData.pagination.totalItems);
    }
  }, [healthMetricsData]);

  const handleChildSelect = (child: ParentStudent) => {
    setSelectedChild(child);
    setCurrentPage(1); // Reset to first page when changing child
    setHasSearched(true);
  };

  const handleChildReset = () => {
    setSelectedChild(null);
    setHealthMetrics([]);
    setCurrentPage(1);
    setFilters({
      sortBy: 'date',
      sortOrder: 'desc',
    });
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await loadHealthData();
    }
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
      // Don't count default sort values as active filters
      if (key === 'sortBy' && value === 'date') return false;
      if (key === 'sortOrder' && value === 'desc') return false;
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
    if (key === 'type') {
      switch (value) {
        case 'height':
          return 'Height';
        case 'weight':
          return 'Weight';
        default:
          return value;
      }
    }
    if (key === 'period') {
      switch (value) {
        case 'week':
          return 'Last Week';
        case 'month':
          return 'Last Month';
        case '3months':
          return 'Last 3 Months';
        case '6months':
          return 'Last 6 Months';
        case 'year':
          return 'Last Year';
        default:
          return value;
      }
    }
    if (key === 'sortBy') {
      switch (value) {
        case 'date':
          return 'Date';
        case 'type':
          return 'Type';
        case 'value':
          return 'Value';
        default:
          return value;
      }
    }
    if (key === 'sortOrder') {
      return value === 'asc' ? 'Ascending' : 'Descending';
    }
    return value;
  };

  const getFilterLabel = (key: keyof FilterState) => {
    switch (key) {
      case 'type':
        return 'Type';
      case 'period':
        return 'Period';
      case 'dateFrom':
        return 'From';
      case 'dateTo':
        return 'To';
      case 'sortBy':
        return 'Sort By';
      case 'sortOrder':
        return 'Order';
      default:
        return key;
    }
  };

  const isLoading = isLoadingChildren || loadingHealthMetrics || loadingHealthInfo;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Health" navigation={navigation} showBackButton={true} />

      {/* Main Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }>
          {/* Child Selector */}
          <View className="mt-4">
            <ChildSelector
              selectedChild={selectedChild}
              onChildSelect={handleChildSelect}
              onResetSelection={handleChildReset}
              placeholder="Select a child to view their health information"
              disabled={isLoadingChildren}
            />
          </View>

          {selectedChild && (
            <>
              {/* Filters Section */}
              <View className="mb-4 mt-6">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                    Health Metrics Filters
                  </Text>
                  <View className="flex-row">
                    {/* Health Info Button */}
                    <TouchableOpacity
                      className="mr-3 flex-row items-center rounded-lg px-4 py-2"
                      style={{
                        backgroundColor: colors.secondary + '20',
                      }}
                      onPress={() => {
                        setIsHealthInfoModalVisible(true);
                        loadHealthInfo();
                      }}>
                      <Text className="mr-2">🏥</Text>
                      <Text className="text-sm font-medium" style={{ color: colors.secondary }}>
                        Health Info
                      </Text>
                    </TouchableOpacity>

                    {/* Filters Button */}
                    <TouchableOpacity
                      className="flex-row items-center rounded-lg px-4 py-2"
                      style={{
                        backgroundColor: isFilterModalVisible
                          ? colors.primary
                          : colors.primary + '20',
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
                </View>

                {/* Active Filters Tags */}
                {getActiveFiltersCount() > 0 && (
                  <View className="flex-row flex-wrap">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value) return null;
                      // Don't show default sort values as tags
                      if (key === 'sortBy' && value === 'date') return null;
                      if (key === 'sortOrder' && value === 'desc') return null;

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

              {/* Health Metrics Loading */}
              {loadingHealthMetrics && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="text-lg" style={{ color: colors.textSecondary }}>
                    Loading {selectedChild.fullName}'s health metrics...
                  </Text>
                </View>
              )}

              {/* Health Metrics Error */}
              {healthMetricsError && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">⚠️</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                    Error Loading Health Metrics
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    {healthMetricsError || 'Something went wrong'}
                  </Text>
                  <TouchableOpacity
                    className="mt-4 rounded-lg px-6 py-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={loadHealthData}>
                    <Text className="font-semibold text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Health Metrics List */}
              {!loadingHealthMetrics && healthMetrics.length > 0 && (
                <View className="pb-8">
                  {/* Header */}
                  <View className="mb-4 flex-row items-center">
                    <View
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-2xl">📊</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        Health Metrics
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedChild.fullName}'s health measurements and records
                      </Text>
                    </View>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {totalItems} Metric{totalItems !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Health Metrics */}
                  {healthMetrics.map((metric) => (
                    <HealthMetricsCard key={metric._id} metric={metric} />
                  ))}
                </View>
              )}

              {/* No Health Metrics State */}
              {!loadingHealthMetrics && healthMetrics.length === 0 && selectedChild && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">📊</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                    No Health Metrics Found
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    No health metrics have been recorded for {selectedChild.fullName} yet.
                    {getActiveFiltersCount() > 0 && ' Try adjusting your filters.'}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Empty State */}
          {!selectedChild && !isLoading && hasSearched && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="mb-4 text-6xl">👶</Text>
              <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
                Select a Child
              </Text>
              <Text className="text-center" style={{ color: colors.textSecondary }}>
                Choose one of your children to view their health information
              </Text>
            </View>
          )}

          {/* No Children State */}
          {children.length === 0 && !isLoadingChildren && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="mb-4 text-6xl">👨‍👩‍👧‍👦</Text>
              <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
                No Children Found
              </Text>
              <Text className="text-center" style={{ color: colors.textSecondary }}>
                No children are associated with your account. Please contact the school
                administration.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Fixed Pagination at Bottom */}
        {selectedChild && healthMetrics.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingHealthMetrics}
            itemName="health metrics"
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

      {/* Health Info Modal */}
      <HealthInfoModal
        visible={isHealthInfoModalVisible}
        selectedChild={selectedChild}
        healthInfoData={healthInfoData}
        isLoading={loadingHealthInfo}
        error={healthInfoError}
        onClose={() => setIsHealthInfoModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HealthScreen;
