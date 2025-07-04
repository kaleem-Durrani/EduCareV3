import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Activity, activityService } from '../../../../services';
import { useApi } from '../../../../hooks';

interface ActivityItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: () => void;
  isLast?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onEdit,
  onDelete,
  isLast = false,
}) => {
  const { colors } = useTheme();

  // API hook for deleting activity
  const {
    request: deleteActivity,
    isLoading: isDeleting,
  } = useApi(activityService.deleteActivity);

  const getAudienceText = () => {
    switch (activity.audience.type) {
      case 'all':
        return '👥 All Students';
      case 'class':
        return `🏫 ${activity.audience.class_id?.name || 'Unknown Class'}`;
      case 'student':
        return `👶 ${activity.audience.student_id?.fullName || 'Unknown Student'}`;
      default:
        return '❓ Unknown Audience';
    }
  };

  const getAudienceIcon = () => {
    switch (activity.audience.type) {
      case 'all':
        return '👥';
      case 'class':
        return '🏫';
      case 'student':
        return '👶';
      default:
        return '❓';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEdit = () => {
    onEdit(activity);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Activity',
      `Are you sure you want to delete "${activity.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      await deleteActivity(activity._id);
      onDelete();
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to delete activity. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View
      className={`p-4 rounded-lg border ${!isLast ? 'mb-3' : ''}`}
      style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border 
      }}
    >
      {/* Activity Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          {/* Title with color indicator */}
          <View className="flex-row items-center mb-1">
            <View 
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: activity.color }}
            />
            <Text className="text-lg font-bold flex-1" style={{ color: colors.textPrimary }}>
              {activity.title}
            </Text>
          </View>

          {/* Time */}
          <Text className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            🕐 {formatTime(activity.date)}
          </Text>

          {/* Audience */}
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {getAudienceText()}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row">
          <TouchableOpacity
            className="p-2 rounded-lg mr-2"
            style={{ backgroundColor: colors.primary }}
            onPress={handleEdit}
          >
            <Text className="text-white text-sm">✏️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: isDeleting ? colors.border : '#EF4444',
              opacity: isDeleting ? 0.6 : 1
            }}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text className="text-white text-sm">
              {isDeleting ? '⏳' : '🗑️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <View 
        className="p-3 rounded-lg"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-sm" style={{ color: colors.textPrimary }}>
          {activity.description}
        </Text>
      </View>

      {/* Creator Info */}
      <View className="flex-row justify-between items-center mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          Created by {activity.createdBy.name}
        </Text>
        {activity.updatedBy && (
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Updated by {activity.updatedBy.name}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ActivityItem;
