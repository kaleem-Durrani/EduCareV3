import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Activity } from '../../../../services';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAudienceIcon = () => {
    switch (activity.audience.type) {
      case 'all':
        return '🌍';
      case 'class':
        return '🏫';
      case 'student':
        return '👤';
      default:
        return '📅';
    }
  };

  const getAudienceText = () => {
    switch (activity.audience.type) {
      case 'all':
        return 'All Students';
      case 'class':
        return activity.audience.class_id?.name || 'Class Activity';
      case 'student':
        return activity.audience.student_id?.fullName || 'Individual Activity';
      default:
        return 'Activity';
    }
  };

  const getAudienceColor = () => {
    switch (activity.audience.type) {
      case 'all':
        return '#8B5CF6'; // Purple
      case 'class':
        return '#10B981'; // Green
      case 'student':
        return '#F59E0B'; // Orange
      default:
        return colors.textSecondary;
    }
  };

  const isUpcoming = () => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    return activityDate > now;
  };

  const isToday = () => {
    const activityDate = new Date(activity.date);
    const today = new Date();
    return (
      activityDate.getDate() === today.getDate() &&
      activityDate.getMonth() === today.getMonth() &&
      activityDate.getFullYear() === today.getFullYear()
    );
  };

  const getDateStatus = () => {
    if (isToday()) {
      return { text: 'Today', color: '#10B981', bgColor: '#10B981' + '20' };
    } else if (isUpcoming()) {
      return { text: 'Upcoming', color: '#3B82F6', bgColor: '#3B82F6' + '20' };
    } else {
      return { text: 'Past', color: '#6B7280', bgColor: '#6B7280' + '20' };
    }
  };

  const dateStatus = getDateStatus();

  return (
    <View
      className="mb-4 rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
        borderLeftWidth: 6,
        borderLeftColor: activity.color || colors.primary,
      }}>
      
      {/* Header */}
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {activity.title}
          </Text>
          
          {/* Date and Time */}
          <View className="flex-row items-center mb-2">
            <Text className="mr-2 text-lg">📅</Text>
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              {formatDate(activity.date)}
            </Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <Text className="mr-2 text-lg">🕐</Text>
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              {formatTime(activity.date)}
            </Text>
          </View>
        </View>
        
        {/* Status Badge */}
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: dateStatus.bgColor }}>
          <Text className="text-sm font-semibold" style={{ color: dateStatus.color }}>
            {dateStatus.text}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{
          backgroundColor: colors.background,
        }}>
        <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
          {activity.description}
        </Text>
      </View>

      {/* Audience and Creator Info */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="mr-2 text-lg">{getAudienceIcon()}</Text>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: getAudienceColor() + '20' }}>
            <Text
              className="text-sm font-semibold"
              style={{ color: getAudienceColor() }}>
              {getAudienceText()}
            </Text>
          </View>
        </View>
        
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          By {activity.createdBy.name}
        </Text>
      </View>

      {/* Color Indicator */}
      <View className="mt-3 flex-row items-center">
        <View
          className="mr-2 h-4 w-4 rounded-full"
          style={{ backgroundColor: activity.color || colors.primary }}
        />
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Activity Color
        </Text>
      </View>
    </View>
  );
};
