import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../../contexts';
import { WeeklyReport } from '../../../../services';

interface ReportCardProps {
  report: WeeklyReport;
  onEdit: (report: WeeklyReport) => void;
  onDelete: (report: WeeklyReport) => void;
  onView: (report: WeeklyReport) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onEdit,
  onDelete,
  onView,
}) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCompletionStats = () => {
    const totalDays = report.dailyReports.length;
    const completedDays = report.dailyReports.filter(day => 
      day.toilet || day.food_intake || day.friends_interaction || day.studies_mood
    ).length;
    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    return { completedDays, totalDays, percentage };
  };

  const { completedDays, totalDays, percentage } = getCompletionStats();

  return (
    <View
      className="mb-3 rounded-lg p-4"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {report.student_id.fullName} • Roll #{report.student_id.rollNum}
          </Text>
        </View>
        
        {/* Completion Badge */}
        <View
          className="rounded-full px-3 py-1"
          style={{
            backgroundColor: percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444',
          }}
        >
          <Text className="text-xs font-bold text-white">
            {percentage}%
          </Text>
        </View>
      </View>

      {/* Daily Reports Tags */}
      <View className="mb-3 flex-row flex-wrap">
        {report.dailyReports.map((day, index) => {
          const isCompleted = day.toilet || day.food_intake || day.friends_interaction || day.studies_mood;
          return (
            <View
              key={index}
              className="mb-1 mr-2 rounded px-2 py-1"
              style={{
                backgroundColor: isCompleted ? '#10B981' : '#EF4444',
              }}
            >
              <Text className="text-xs font-medium text-white">
                {day.day}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Stats */}
      <View className="mb-3">
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          {completedDays}/{totalDays} days completed
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="flex-1 mr-2 rounded-lg py-2"
          style={{ backgroundColor: colors.primary }}
          onPress={() => onView(report)}
        >
          <View className="flex-row items-center justify-center">
            <Icon name="visibility" size={16} color="white" />
            <Text className="ml-1 font-medium text-white">View</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 mx-1 rounded-lg py-2"
          style={{ backgroundColor: colors.secondary }}
          onPress={() => onEdit(report)}
        >
          <View className="flex-row items-center justify-center">
            <Icon name="edit" size={16} color="white" />
            <Text className="ml-1 font-medium text-white">Edit</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 ml-2 rounded-lg py-2"
          style={{ backgroundColor: '#EF4444' }}
          onPress={() => onDelete(report)}
        >
          <View className="flex-row items-center justify-center">
            <Icon name="delete" size={16} color="white" />
            <Text className="ml-1 font-medium text-white">Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
