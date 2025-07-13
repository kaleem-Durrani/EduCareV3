import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import {
  activityService,
  ParentActivitiesResponse,
  ActivityFilters,
  ParentStudent,
} from '../../../services';
import { ChildSelector, PaginationControls, ScreenHeader } from '../../../components';
import { ActivityCard, FilterModal } from './components';
import Toast from 'react-native-toast-message';

interface FilterState {
  startDate?: string;
  endDate?: string;
  timeFilter?: 'all' | 'past' | 'today' | 'upcoming';
}

const ActivitiesScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    timeFilter: 'all',
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const { children, isLoading: isLoadingChildren, refreshChildren } = useParentChildren();

  // API hooks
  const {
    request: fetchActivities,
    isLoading: loadingActivities,
    error: activitiesError,
    data: activitiesData,
  } = useApi<ParentActivitiesResponse>((params: ActivityFilters & { studentId: string }) =>
    activityService.getActivitiesForParent(params.studentId, {
      page: params.page,
      limit: params.limit,
      startDate: params.startDate,
      endDate: params.endDate,
      timeFilter: params.timeFilter,
    })
  );

  // Load activities when child or filters change
  useEffect(() => {
    if (selectedChild) {
      loadActivities();
    } else {
      setActivities([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [selectedChild, currentPage, pageSize, filters]);

  const loadActivities = async () => {
    if (!selectedChild) return;

    const response = await activityService.getActivitiesForParent(selectedChild._id, {
      page: currentPage,
      limit: pageSize,
      startDate: filters.startDate,
      endDate: filters.endDate,
      timeFilter: filters.timeFilter,
    });

    if (response.success) {
      await fetchActivities({
        studentId: selectedChild._id,
        page: currentPage,
        limit: pageSize,
        startDate: filters.startDate,
        endDate: filters.endDate,
        timeFilter: filters.timeFilter,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load activities',
        visibilityTime: 3000,
      });
    }
  };

  // Update activities when data changes
  useEffect(() => {
    if (activitiesData) {
      setActivities(activitiesData.activities);
      setTotalPages(activitiesData.pagination.totalPages);
      setTotalItems(activitiesData.pagination.totalActivities);
    }
  }, [activitiesData]);

  const handleChildSelect = (child: ParentStudent) => {
    setSelectedChild(child);
    setCurrentPage(1); // Reset to first page when changing child
    setHasSearched(true);
  };

  const handleChildReset = () => {
    setSelectedChild(null);
    setActivities([]);
    setCurrentPage(1);
    setFilters({
      timeFilter: 'all',
    });
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await loadActivities();
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
      // Don't count default timeFilter as active filter
      if (key === 'timeFilter' && value === 'all') return false;
      return !!value;
    }).length;
  };

  const formatFilterValue = (key: keyof FilterState, value: string) => {
    if (key === 'startDate' || key === 'endDate') {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (key === 'timeFilter') {
      switch (value) {
        case 'all':
          return 'All Activities';
        case 'past':
          return 'Past Activities';
        case 'today':
          return "Today's Activities";
        case 'upcoming':
          return 'Upcoming Activities';
        default:
          return value;
      }
    }
    return value;
  };

  const getFilterLabel = (key: keyof FilterState) => {
    switch (key) {
      case 'startDate':
        return 'From';
      case 'endDate':
        return 'To';
      case 'timeFilter':
        return 'Time Filter';
      default:
        return key;
    }
  };

  const isLoading = isLoadingChildren || loadingActivities;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Activities" navigation={navigation} showBackButton={true} />

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
              placeholder="Select a child to view their activities"
              disabled={isLoadingChildren}
            />
          </View>

          {selectedChild && (
            <>
              {/* Filters Section */}
              <View className="mb-4 mt-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                    Filters
                  </Text>
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

                {/* Active Filters Tags */}
                {getActiveFiltersCount() > 0 && (
                  <View className="flex-row flex-wrap">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value) return null;
                      // Don't show default timeFilter as tag
                      if (key === 'timeFilter' && value === 'all') return null;

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
              {loadingActivities && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="text-lg" style={{ color: colors.textSecondary }}>
                    Loading {selectedChild.fullName}'s activities...
                  </Text>
                </View>
              )}

              {/* Error State */}
              {activitiesError && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">⚠️</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                    Error Loading Activities
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    {activitiesError || 'Something went wrong'}
                  </Text>
                  <TouchableOpacity
                    className="mt-4 rounded-lg px-6 py-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={loadActivities}>
                    <Text className="font-semibold text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Activities List */}
              {!loadingActivities && activities.length > 0 && (
                <View className="pb-8">
                  {/* Header */}
                  <View className="mb-4 flex-row items-center">
                    <View
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-2xl">📅</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        Activities
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedChild.fullName}'s school activities and events
                      </Text>
                    </View>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {totalItems} Activit{totalItems !== 1 ? 'ies' : 'y'}
                      </Text>
                    </View>
                  </View>

                  {/* Activities */}
                  {activities.map((activity) => (
                    <ActivityCard key={activity._id} activity={activity} />
                  ))}
                </View>
              )}

              {/* No Activities State */}
              {!loadingActivities && activities.length === 0 && selectedChild && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">📅</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                    No Activities Found
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    No activities have been scheduled for {selectedChild.fullName} yet.
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
                Choose one of your children to view their activities
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
        {selectedChild && activities.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingActivities}
            itemName="activities"
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

export default ActivitiesScreen;
