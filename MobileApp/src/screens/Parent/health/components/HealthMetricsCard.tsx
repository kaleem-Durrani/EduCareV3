import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { HealthMetric } from '../../../../services';

interface HealthMetricsCardProps {
  metric: HealthMetric;
}

export const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ metric }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getMetricIcon = () => {
    switch (metric.type) {
      case 'height':
        return '📏';
      case 'weight':
        return '⚖️';
      default:
        return '📊';
    }
  };

  const getMetricColor = () => {
    switch (metric.type) {
      case 'height':
        return '#3B82F6'; // Blue
      case 'weight':
        return '#10B981'; // Green
      default:
        return colors.primary;
    }
  };

  const getMetricLabel = () => {
    switch (metric.type) {
      case 'height':
        return 'Height';
      case 'weight':
        return 'Weight';
      default:
        return metric.type;
    }
  };

  const metricColor = getMetricColor();

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
        borderLeftColor: metricColor,
      }}>
      {/* Header */}
      <View className="mb-4 flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 text-2xl">{getMetricIcon()}</Text>
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {getMetricLabel()}
            </Text>
          </View>

          {/* Date and Time */}
          <View className="mb-1 flex-row items-center">
            <Text className="mr-2 text-base">📅</Text>
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              {formatDate(metric.date)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="mr-2 text-base">🕐</Text>
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              {formatTime(metric.date)}
            </Text>
          </View>
        </View>

        {/* Value Display */}
        <View className="items-center">
          <View className="rounded-full px-4 py-2" style={{ backgroundColor: metricColor + '20' }}>
            <Text className="text-2xl font-bold" style={{ color: metricColor }}>
              {metric.value}
            </Text>
          </View>
          <Text className="mt-1 text-sm font-semibold" style={{ color: metricColor }}>
            {metric.type === 'height' ? 'cm' : 'kg'}
          </Text>
        </View>
      </View>

      {/* Label */}
      {metric.label && (
        <View
          className="mb-3 rounded-lg p-3"
          style={{
            backgroundColor: colors.background,
          }}>
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Label
          </Text>
          <Text className="text-base" style={{ color: colors.textPrimary }}>
            {metric.label}
          </Text>
        </View>
      )}

      {/* Notes */}
      {metric.notes && (
        <View
          className="mb-3 rounded-lg p-3"
          style={{
            backgroundColor: colors.background,
          }}>
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Notes
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
            {metric.notes}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Recorded by {metric.recordedBy.name}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {formatDate(metric.createdAt)}
          </Text>
        </View>
        {metric.updatedBy && (
          <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
            Updated by {metric.updatedBy.name}
          </Text>
        )}
      </View>
    </View>
  );
};
