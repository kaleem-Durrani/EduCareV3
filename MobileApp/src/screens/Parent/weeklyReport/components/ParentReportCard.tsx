import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts';
import { WeeklyReport, DailyReport } from '../../../../services';

interface ParentReportCardProps {
  report: WeeklyReport;
}

export const ParentReportCard: React.FC<ParentReportCardProps> = ({ report }) => {
  const { colors } = useTheme();
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

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
    const completedDays = report.dailyReports.filter(
      (day) => day.toilet || day.food_intake || day.friends_interaction || day.studies_mood
    ).length;
    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return { completedDays, totalDays, percentage };
  };

  const { completedDays, totalDays, percentage } = getCompletionStats();

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'toilet':
        return '🚽';
      case 'food_intake':
        return '🍽️';
      case 'friends_interaction':
        return '👥';
      case 'studies_mood':
        return '📚';
      default:
        return '📝';
    }
  };

  const getStatusCircle = (value: string) => {
    return value ? '🟢' : '🔴';
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'toilet':
        return 'Toilet';
      case 'food_intake':
        return 'Food';
      case 'friends_interaction':
        return 'Friends';
      case 'studies_mood':
        return 'Studies';
      default:
        return activity;
    }
  };

  const getValueLabel = (value: string) => {
    return value || 'Not recorded';
  };

  const renderDayTag = (day: DailyReport, index: number) => {
    const isCompleted =
      day.toilet || day.food_intake || day.friends_interaction || day.studies_mood;
    return (
      <View
        key={index}
        className="mb-1 mr-2 rounded-lg px-3 py-2"
        style={{
          backgroundColor: isCompleted ? '#10B981' + '20' : '#EF4444' + '20',
          borderWidth: 1,
          borderColor: isCompleted ? '#10B981' : '#EF4444',
        }}>
        <Text
          className="text-sm font-semibold"
          style={{ color: isCompleted ? '#10B981' : '#EF4444' }}>
          {day.day}
        </Text>
      </View>
    );
  };

  const renderDetailModal = () => (
    <Modal
      visible={isDetailModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setIsDetailModalVisible(false)}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-4"
          style={{
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Weekly Report Details
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
            </Text>
          </View>
          <TouchableOpacity
            className="rounded-lg px-4 py-2"
            style={{ backgroundColor: colors.primary + '20' }}
            onPress={() => setIsDetailModalVisible(false)}>
            <Text className="font-semibold" style={{ color: colors.primary }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Summary */}
          <View
            className="mb-6 rounded-xl p-4"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <Text className="mb-3 text-lg font-bold" style={{ color: colors.textPrimary }}>
              Summary
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-base" style={{ color: colors.textSecondary }}>
                Completion Rate
              </Text>
              <View
                className="rounded-full px-3 py-1"
                style={{
                  backgroundColor:
                    percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444',
                }}>
                <Text className="text-sm font-bold text-white">{percentage}%</Text>
              </View>
            </View>
            <Text className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
              {completedDays} out of {totalDays} days completed
            </Text>
          </View>

          {/* Daily Reports */}
          <View
            className="mb-6 rounded-xl p-4"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <Text className="mb-4 text-lg font-bold" style={{ color: colors.textPrimary }}>
              Daily Progress
            </Text>

            {report.dailyReports.map((day, dayIndex) => (
              <View
                key={dayIndex}
                className="mb-4 rounded-lg p-3"
                style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <Text
                  className="mb-3 text-base font-semibold"
                  style={{ color: colors.textPrimary }}>
                  {day.day}
                </Text>

                <View className="space-y-3">
                  {['toilet', 'food_intake', 'friends_interaction', 'studies_mood'].map(
                    (activity) => (
                      <View key={activity} className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Text className="mr-2 text-lg">{getActivityIcon(activity)}</Text>
                          <Text
                            className="text-sm font-medium"
                            style={{ color: colors.textPrimary }}>
                            {getActivityLabel(activity)}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Text className="mr-2 text-lg">
                            {getStatusCircle(day[activity as keyof DailyReport])}
                          </Text>
                          <View
                            className="rounded-lg px-3 py-1"
                            style={{
                              backgroundColor: colors.background,
                              borderWidth: 1,
                              borderColor: colors.border,
                            }}>
                            <Text
                              className="text-xs font-medium"
                              style={{ color: colors.textPrimary }}>
                              {getValueLabel(day[activity as keyof DailyReport])}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Created By */}
          <View
            className="rounded-xl p-4"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <Text className="mb-2 text-lg font-bold" style={{ color: colors.textPrimary }}>
              Report Information
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Created by:
                </Text>
                <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {report.createdBy.name}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Created on:
                </Text>
                <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {formatDate(report.createdAt)}
                </Text>
              </View>
              {report.updatedBy && (
                <View className="flex-row justify-between">
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Last updated by:
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {report.updatedBy.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <View
        className="mb-4 rounded-xl p-5"
        style={{
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 5,
        }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Week of {formatDate(report.weekStart)}
            </Text>
          </View>

          {/* Completion Badge */}
          <View
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor:
                percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444',
            }}>
            <Text className="text-sm font-bold text-white">{percentage}%</Text>
          </View>
        </View>

        {/* Daily Reports Tags */}
        <View className="mb-4 flex-row flex-wrap">
          {report.dailyReports.map((day, index) => renderDayTag(day, index))}
        </View>

        {/* Stats */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {completedDays}/{totalDays} days completed
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Created by {report.createdBy.name}
          </Text>
        </View>

        {/* View Details Button */}
        <TouchableOpacity
          className="rounded-lg py-3"
          style={{ backgroundColor: colors.primary }}
          onPress={() => setIsDetailModalVisible(true)}>
          <Text className="text-center font-semibold text-white">View Details</Text>
        </TouchableOpacity>
      </View>

      {renderDetailModal()}
    </>
  );
};
