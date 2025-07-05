import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import {
  activityService,
  Activity,
  ActivityFilters as ActivityFiltersType,
  PaginatedActivitiesResponse,
} from '../../../services';
import { LoadingScreen } from '../../../components';
import ActivityFilters from './components/ActivityFilters';
import ActivityList from './components/ActivityList';
import CreateActivityModal from './components/CreateActivityModal';

const ActivitiesScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<ActivityFiltersType>({ page: 1, limit: 10 });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  // API hook for fetching activities
  const {
    request: fetchActivities,
    isLoading: isLoadingActivities,
    error: activitiesError,
    data: activitiesResponse,
  } = useApi<PaginatedActivitiesResponse>(activityService.getActivities);

  // Load activities on mount and when filters change
  useEffect(() => {
    loadActivities(true);
  }, [filters]);

  // Update activities when API response changes
  useEffect(() => {
    if (activitiesResponse) {
      // Always replace activities for page-based pagination
      setActivities(activitiesResponse.activities);
      setPagination(activitiesResponse.pagination);
    }
  }, [activitiesResponse]);

  const loadActivities = async (resetPage = false) => {
    if (resetPage && filters.page !== 1) {
      setFilters((prev: ActivityFiltersType) => ({ ...prev, page: 1 }));
      return;
    }
    await fetchActivities(filters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: ActivityFiltersType) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setFilters((prev: ActivityFiltersType) => ({ ...prev, page: 1, limit: size }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setActivities([]);
    await loadActivities(true);
    setRefreshing(false);
  };

  const handleFiltersChange = (newFilters: ActivityFiltersType) => {
    setFilters({ ...newFilters, page: 1, limit: 10 });
  };

  const handleCreateActivity = () => {
    setIsCreateModalVisible(true);
  };

  const handleActivityCreated = () => {
    setIsCreateModalVisible(false);
    setActivities([]);
    loadActivities(true); // Refresh the list from first page
  };

  const handleActivityUpdated = () => {
    setActivities([]);
    loadActivities(true); // Refresh the list from first page
  };

  const handleActivityDeleted = () => {
    setActivities([]);
    loadActivities(true); // Refresh the list from first page
  };

  if (isLoadingActivities && !activities) {
    return <LoadingScreen message="Loading activities..." />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      {/* Navigation Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Activities
          </Text>
        </TouchableOpacity>

        {/* Create Activity Button */}
        <TouchableOpacity
          className="rounded-lg px-4 py-2"
          style={{ backgroundColor: colors.primary }}
          onPress={handleCreateActivity}>
          <Text className="font-medium text-white">+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }>
        {/* Filters */}
        <ActivityFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Activities List */}
        {activitiesError ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="mb-2 text-center text-lg" style={{ color: colors.textPrimary }}>
              Failed to load activities
            </Text>
            <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
              {activitiesError}
            </Text>
            <TouchableOpacity
              className="rounded-lg bg-blue-500 px-6 py-3"
              onPress={() => loadActivities(true)}>
              <Text className="font-medium text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ActivityList
            activities={activities}
            pagination={pagination}
            isLoading={isLoadingActivities}
            pageSize={pageSize}
            onActivityUpdated={handleActivityUpdated}
            onActivityDeleted={handleActivityDeleted}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </ScrollView>

      {/* Create Activity Modal */}
      <CreateActivityModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onActivityCreated={handleActivityCreated}
      />
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
