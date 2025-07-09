import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../../contexts';
import { useApi } from '../../../../hooks';
import {
  reportService,
  WeeklyReport,
  UpdateWeeklyReportData,
  DailyReport,
} from '../../../../services';
import { DaySelector, DayInputForm } from './';

interface EditReportModalProps {
  visible: boolean;
  report: WeeklyReport | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  visible,
  report,
  onClose,
  onSuccess,
}) => {
  const { colors } = useTheme();

  // State
  const [selectedDay, setSelectedDay] = useState('M');
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);

  // API hook
  const {
    request: updateReport,
    isLoading: updating,
    error: updateError,
    success: updateSuccess,
  } = useApi<any>((data: { reportId: string; updateData: UpdateWeeklyReportData }) =>
    reportService.updateWeeklyReport(data.reportId, data.updateData)
  );

  // Initialize form when modal opens or report changes
  useEffect(() => {
    if (visible && report) {
      setDailyReports([...report.dailyReports]);
      setSelectedDay('M');
    }
  }, [visible, report]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDayDataChange = (field: string, value: string) => {
    setDailyReports((prev) =>
      prev.map((reportItem) =>
        reportItem.day === selectedDay ? { ...reportItem, [field]: value } : reportItem
      )
    );
  };

  const getCurrentDayData = () => {
    const dayReport = dailyReports.find((reportItem) => reportItem.day === selectedDay);
    return dayReport || { toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' };
  };

  const handleSubmit = async () => {
    if (!report) return;

    const updateData: UpdateWeeklyReportData = {
      dailyReports,
    };

    await updateReport({
      reportId: report._id,
      updateData,
    });
  };

  // Handle success/error after API call
  useEffect(() => {
    if (updateSuccess) {
      Alert.alert('Success', 'Weekly report updated successfully!');
      onSuccess();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (updateError) {
      Alert.alert('Error', `Failed to update report: ${updateError}`);
    }
  }, [updateError]);

  if (!visible || !report) return null;

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
            Edit Weekly Report
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={updating}
            style={{ opacity: updating ? 0.6 : 1 }}>
            <Text className="font-semibold" style={{ color: colors.primary }}>
              {updating ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Report Info */}
          <View className="mb-4 rounded-lg p-3" style={{ backgroundColor: colors.card }}>
            <Text className="font-semibold" style={{ color: colors.textPrimary }}>
              👶 {report.student_id.fullName}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Roll #{report.student_id.rollNum}
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
              📅 {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
            </Text>
          </View>

          {/* Day Selector */}
          <DaySelector
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            dailyReports={dailyReports}
          />

          {/* Day Input Form */}
          <DayInputForm
            selectedDay={selectedDay}
            dayData={getCurrentDayData()}
            onDataChange={handleDayDataChange}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};
