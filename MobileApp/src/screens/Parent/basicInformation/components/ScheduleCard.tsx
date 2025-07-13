import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentSchedule } from '../../../../services';

interface ScheduleCardProps {
  schedule: StudentSchedule;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  const { colors } = useTheme();

  return (
    <View
      className="mb-6 rounded-xl p-6"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
      {/* Header */}
      <View className="mb-6 flex-row items-center">
        <Text className="mr-3 text-2xl">⏰</Text>
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          School Schedule
        </Text>
      </View>

      {/* Schedule Details */}
      <View className="mb-2 space-y-4">
        {/* Time */}
        <View
          className="mb-2 rounded-lg p-4"
          style={{
            backgroundColor: colors.background,
            borderLeftWidth: 4,
            borderLeftColor: colors.info,
          }}>
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 text-xl">🕐</Text>
            <Text className="text-base font-semibold" style={{ color: colors.textSecondary }}>
              School Hours
            </Text>
          </View>
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {schedule.time}
          </Text>
        </View>

        {/* Days */}
        <View
          className="mb-2 rounded-lg p-4"
          style={{
            backgroundColor: colors.background,
            borderLeftWidth: 4,
            borderLeftColor: colors.success,
          }}>
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 text-xl">📅</Text>
            <Text className="text-base font-semibold" style={{ color: colors.textSecondary }}>
              School Days
            </Text>
          </View>
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {schedule.days}
          </Text>
        </View>

        {/* Visual Schedule */}
        <View className="rounded-lg p-4" style={{ backgroundColor: colors.primary + '10' }}>
          <Text
            className="mb-3 text-center text-base font-semibold"
            style={{ color: colors.primary }}>
            Weekly Schedule
          </Text>
          <View className="flex-row justify-between">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
              <View key={day} className="items-center">
                <View
                  className="mb-2 h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.primary }}>
                  <Text className="text-xs font-bold text-white">{day.charAt(0)}</Text>
                </View>
                <Text className="text-xs font-medium" style={{ color: colors.primary }}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
          <View className="mt-3 flex-row justify-between">
            {['Sat', 'Sun'].map((day) => (
              <View key={day} className="items-center opacity-50">
                <View
                  className="mb-2 h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.textMuted }}>
                  <Text className="text-xs font-bold text-white">{day.charAt(0)}</Text>
                </View>
                <Text className="text-xs font-medium" style={{ color: colors.textMuted }}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
