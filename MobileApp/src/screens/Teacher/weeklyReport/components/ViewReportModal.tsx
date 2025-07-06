import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../../contexts';
import { WeeklyReport } from '../../../../services';

interface ViewReportModalProps {
  visible: boolean;
  report: WeeklyReport | null;
  onClose: () => void;
}

export const ViewReportModal: React.FC<ViewReportModalProps> = ({ visible, report, onClose }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'toilet':
        return { name: 'toilet', type: 'MaterialCommunityIcons' };
      case 'food_intake':
        return { name: 'restaurant', type: 'MaterialIcons' };
      case 'friends_interaction':
        return { name: 'group', type: 'MaterialIcons' };
      case 'studies_mood':
        return { name: 'school', type: 'MaterialIcons' };
      default:
        return { name: 'info', type: 'MaterialIcons' };
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'toilet':
        return 'Toilet';
      case 'food_intake':
        return 'Food Intake';
      case 'friends_interaction':
        return 'Friends Interaction';
      case 'studies_mood':
        return 'Studies & Mood';
      default:
        return field;
    }
  };

  if (!visible || !report) return null;

  const fields = ['toilet', 'food_intake', 'friends_interaction', 'studies_mood'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between p-4"
          style={{
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          }}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Weekly Report Details
          </Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Report Info */}
          <View className="mb-4 rounded-lg p-4" style={{ backgroundColor: colors.card }}>
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              👶 {report.student_id.fullName}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Roll #{report.student_id.rollNum}
            </Text>
            <Text className="mt-2 text-lg font-semibold" style={{ color: colors.primary }}>
              📅 {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
            </Text>
          </View>

          {/* Weekly Report Table */}
          <View className="rounded-lg" style={{ backgroundColor: colors.card }}>
            {/* Table Header */}
            <View className="flex-row border-b p-3" style={{ borderBottomColor: colors.border }}>
              <View className="w-16">
                <Text className="font-semibold" style={{ color: colors.textPrimary }}>
                  Day
                </Text>
              </View>
              {fields.map((field) => {
                const iconInfo = getFieldIcon(field);
                return (
                  <View key={field} className="flex-1 items-center">
                    {iconInfo.type === 'MaterialCommunityIcons' ? (
                      <MaterialCommunityIcons
                        name={iconInfo.name}
                        size={20}
                        color={colors.primary}
                      />
                    ) : (
                      <Icon name={iconInfo.name} size={20} color={colors.primary} />
                    )}
                    <Text
                      className="mt-1 text-center text-xs"
                      style={{ color: colors.textSecondary }}>
                      {getFieldLabel(field)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Table Rows */}
            {report.dailyReports.map((dayReport, index) => (
              <View
                key={dayReport.day}
                className={`flex-row p-3 ${index < report.dailyReports.length - 1 ? 'border-b' : ''}`}
                style={{
                  borderBottomColor: colors.border,
                  backgroundColor: index % 2 === 0 ? colors.background : colors.card,
                }}>
                {/* Day Column */}
                <View className="w-16 justify-center">
                  <Text className="font-semibold" style={{ color: colors.primary }}>
                    {dayReport.day}
                  </Text>
                </View>

                {/* Field Columns */}
                {fields.map((field) => {
                  const value = dayReport[field as keyof typeof dayReport];
                  const hasValue = value && value.trim() !== '';

                  return (
                    <View key={field} className="flex-1 items-center justify-center px-1">
                      {hasValue ? (
                        <Text
                          className="text-center text-xs"
                          style={{ color: colors.textPrimary }}
                          numberOfLines={2}>
                          {value}
                        </Text>
                      ) : (
                        <Icon name="close" size={16} color="#EF4444" />
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Legend */}
          <View className="mt-4 rounded-lg p-3" style={{ backgroundColor: colors.card }}>
            <Text className="mb-2 font-semibold" style={{ color: colors.textPrimary }}>
              Legend:
            </Text>
            <View className="flex-row items-center">
              <Icon name="close" size={16} color="#EF4444" />
              <Text className="ml-2 text-sm" style={{ color: colors.textSecondary }}>
                No data recorded
              </Text>
            </View>
          </View>

          {/* Created/Updated Info */}
          <View className="mt-4 rounded-lg p-3" style={{ backgroundColor: colors.card }}>
            <Text className="mb-1 text-sm" style={{ color: colors.textSecondary }}>
              Created by: {report.createdBy.name}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Created: {new Date(report.createdAt).toLocaleDateString()}
            </Text>
            {report.updatedBy && (
              <>
                <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                  Last updated by: {report.updatedBy.name}
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Updated: {new Date(report.updatedAt).toLocaleDateString()}
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
