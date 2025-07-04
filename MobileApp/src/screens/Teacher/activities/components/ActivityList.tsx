import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Activity, ActivityPagination } from '../../../../services';
import ActivityItem from './ActivityItem';
import EditActivityModal from './EditActivityModal';

interface ActivityListProps {
  activities: Activity[];
  pagination?: ActivityPagination;
  isLoading: boolean;
  isLoadingMore?: boolean;
  onActivityUpdated: () => void;
  onActivityDeleted: () => void;
  onLoadMore?: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  pagination,
  isLoading,
  isLoadingMore,
  onActivityUpdated,
  onActivityDeleted,
  onLoadMore,
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
      day: 'numeric'
    });
  };

  const groupActivitiesByDate = (activities: Activity[]) => {
    const grouped: { [key: string]: Activity[] } = {};
    
    activities.forEach(activity => {
      const dateKey = activity.date.split('T')[0]; // Get YYYY-MM-DD format
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    // Sort dates and activities within each date
    const sortedDates = Object.keys(grouped).sort();
    const result: { date: string; activities: Activity[] }[] = [];

    sortedDates.forEach(date => {
      grouped[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      result.push({
        date,
        activities: grouped[date]
      });
    });

    return result;
  };

  const renderDateGroup = ({ item }: { item: { date: string; activities: Activity[] } }) => (
    <View className="mb-6">
      {/* Date Header */}
      <View 
        className="p-3 rounded-lg mb-3"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-white font-bold text-lg text-center">
          📅 {formatDate(item.date)}
        </Text>
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
        <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
          📅 No Activities Found
        </Text>
        <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
          No activities match your current filters.{'\n'}
          Try adjusting your filters or create a new activity.
        </Text>
      </View>
    );
  }

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        🎯 Activities ({pagination?.totalActivities || activities.length})
      </Text>

      <FlatList
        data={groupedActivities}
        keyExtractor={(item) => item.date}
        renderItem={renderDateGroup}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Disable scroll since we're inside a ScrollView
      />

      {/* Load More Button */}
      {pagination && pagination.hasNextPage && (
        <TouchableOpacity
          className="p-4 rounded-lg border mt-4"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: isLoadingMore ? 0.6 : 1
          }}
          onPress={onLoadMore}
          disabled={isLoadingMore}
        >
          <Text className="text-center font-medium" style={{ color: colors.primary }}>
            {isLoadingMore ? '⏳ Loading more...' : '📄 Load More Activities'}
          </Text>
          {pagination && (
            <Text className="text-center text-sm mt-1" style={{ color: colors.textSecondary }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </Text>
          )}
        </TouchableOpacity>
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
