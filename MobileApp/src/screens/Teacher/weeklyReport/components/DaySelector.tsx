import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../contexts';

interface DaySelectorProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
  dailyReports: {
    day: string;
    toilet: string;
    food_intake: string;
    friends_interaction: string;
    studies_mood: string;
  }[];
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  onDaySelect,
  dailyReports,
}) => {
  const { colors } = useTheme();

  const days = ['M', 'T', 'W', 'Th', 'F'];

  const getDayStatus = (day: string) => {
    const dayReport = dailyReports.find((report) => report.day === day);
    if (!dayReport) return 'empty';

    const hasData =
      dayReport.toilet ||
      dayReport.food_intake ||
      dayReport.friends_interaction ||
      dayReport.studies_mood;
    return hasData ? 'completed' : 'empty';
  };

  return (
    <View className="mb-4">
      <Text
        className="mb-3 text-center text-lg font-semibold"
        style={{ color: colors.textPrimary }}>
        Select Day to Edit
      </Text>

      <View className="flex-row justify-between">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const status = getDayStatus(day);

          let backgroundColor = colors.card;
          let borderColor = colors.border;
          let textColor = colors.textPrimary;

          if (isSelected) {
            backgroundColor = colors.primary;
            borderColor = colors.primary;
            textColor = 'white';
          } else if (status === 'completed') {
            backgroundColor = '#10B981';
            borderColor = '#10B981';
            textColor = 'white';
          } else {
            backgroundColor = colors.card;
            borderColor = colors.border;
            textColor = colors.textPrimary;
          }

          return (
            <TouchableOpacity
              key={day}
              className="rounded-lg border px-4 py-3"
              style={{
                backgroundColor,
                borderColor,
                borderWidth: 2,
                minWidth: 50,
              }}
              onPress={() => onDaySelect(day)}>
              <Text className="text-center font-semibold" style={{ color: textColor }}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View className="mt-3 flex-row justify-center">
        <View className="flex-row items-center">
          <View className="mr-1 h-3 w-3 rounded" style={{ backgroundColor: '#10B981' }} />
          <Text className="mr-4 text-xs" style={{ color: colors.textSecondary }}>
            Completed
          </Text>

          <View
            className="mr-1 h-3 w-3 rounded border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          />
          <Text className="mr-4 text-xs" style={{ color: colors.textSecondary }}>
            Empty
          </Text>

          <View className="mr-1 h-3 w-3 rounded" style={{ backgroundColor: colors.primary }} />
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Selected
          </Text>
        </View>
      </View>
    </View>
  );
};
