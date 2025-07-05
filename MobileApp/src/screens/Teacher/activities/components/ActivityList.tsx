import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Activity, ActivityPagination } from '../../../../services';
import { PaginationControls } from '../../../../components';
import ActivityItem from './ActivityItem';
import EditActivityModal from './EditActivityModal';

interface ActivityListProps {
  activities: Activity[];
  pagination?: ActivityPagination;
  isLoading: boolean;
  pageSize: number;
  onActivityUpdated: () => void;
  onActivityDeleted: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  pagination,
  isLoading,
  pageSize,
  onActivityUpdated,
  onActivityDeleted,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  refreshing,
}) => {
  const { colors } = useTheme();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsEditModalVisible(true);
  };

  const handleActivityUpdated = () => {
    setIsEditModalVisible(false);
    setSelectedActivity(null);
    onActivityUpdated();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const groupActivitiesByDate = (activities: Activity[]) => {
    const grouped: { [key: string]: Activity[] } = {};

    activities.forEach((activity) => {
      const dateKey = activity.date.split('T')[0]; // Get YYYY-MM-DD format
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    // Sort dates and activities within each date
    const sortedDates = Object.keys(grouped).sort();
    const result: { date: string; activities: Activity[] }[] = [];

    sortedDates.forEach((date) => {
      grouped[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      result.push({
        date,
        activities: grouped[date],
      });
    });

    return result;
  };

  const renderDateGroup = ({ item }: { item: { date: string; activities: Activity[] } }) => (
    <View className="mb-6">
      {/* Date Header */}
      <View className="mb-3 rounded-lg p-3" style={{ backgroundColor: colors.primary }}>
        <Text className="text-center text-lg font-bold text-white">📅 {formatDate(item.date)}</Text>
      </View>

      {/* Activities for this date */}
      {item.activities.map((activity, index) => (
        <ActivityItem
          key={activity._id}
          activity={activity}
          onEdit={handleEditActivity}
          onDelete={onActivityDeleted}
          isLast={index === item.activities.length - 1}
        />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Loading activities...
        </Text>
      </View>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className="mb-2 text-lg font-medium" style={{ color: colors.textPrimary }}>
          📅 No Activities Found
        </Text>
        <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
          No activities match your current filters.{'\n'}
          Try adjusting your filters or create a new activity.
        </Text>
      </View>
    );
  }

  const groupedActivities = groupActivitiesByDate(activities);

  if (isLoading && activities.length === 0) {
    return (
      <View className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textSecondary }}>Loading activities...</Text>
        </View>

        {pagination && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalActivities}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            isLoading={isLoading}
            itemName="activities"
          />
        )}
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg" style={{ color: colors.textSecondary }}>
          🎯 No activities yet
        </Text>
        <Text className="mt-2 text-center" style={{ color: colors.textSecondary }}>
          Create your first activity to get started
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={groupedActivities}
        keyExtractor={(item) => item.date}
        renderItem={renderDateGroup}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {pagination && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalActivities}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          itemName="activities"
        />
      )}

      {/* Edit Activity Modal */}
      {selectedActivity && (
        <EditActivityModal
          visible={isEditModalVisible}
          activity={selectedActivity}
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedActivity(null);
          }}
          onActivityUpdated={handleActivityUpdated}
        />
      )}
    </View>
  );
};

export default ActivityList;
