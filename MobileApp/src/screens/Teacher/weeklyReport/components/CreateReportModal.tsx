import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../../contexts';
import { useApi } from '../../../../hooks';
import {
  reportService,
  ClassStudent,
  CreateWeeklyReportData,
  DailyReport,
} from '../../../../services';
import { DaySelector, DayInputForm } from './';

interface CreateReportModalProps {
  visible: boolean;
  student: ClassStudent | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  visible,
  student,
  onClose,
  onSuccess,
}) => {
  const { colors } = useTheme();

  // State
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [weekEnd, setWeekEnd] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState('M');
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([
    { day: 'Sun', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
    { day: 'Mon', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
    { day: 'Tue', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
    { day: 'Wed', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
    { day: 'Thu', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
    { day: 'Fri', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
    { day: 'Sat', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
  ]);

  // API hook
  const {
    request: createReport,
    isLoading: creating,
    error: createError,
    success: createSuccess,
  } = useApi<any>((data: CreateWeeklyReportData) => reportService.createWeeklyReport(data));

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      const today = new Date();
      const sunday = new Date(today);
      const dayOfWeek = today.getDay();
      const daysToSunday = -dayOfWeek; // Sunday is 0, so subtract current day
      sunday.setDate(today.getDate() + daysToSunday);

      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6); // 6 days after Sunday

      setWeekStart(sunday);
      setWeekEnd(saturday);
      setSelectedDay('Sun');
      setDailyReports([
        { day: 'Sun', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
        { day: 'Mon', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
        { day: 'Tue', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
        { day: 'Wed', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
        { day: 'Thu', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
        { day: 'Fri', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
        { day: 'Sat', toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' },
      ]);
    }
  }, [visible]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (_: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setWeekStart(selectedDate);
      // Auto-calculate end date (6 days later for Sun-Sat)
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 6);
      setWeekEnd(endDate);
    }
  };

  const handleEndDateChange = (_: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setWeekEnd(selectedDate);
    }
  };

  const handleDayDataChange = (field: string, value: string) => {
    setDailyReports((prev) =>
      prev.map((report) => (report.day === selectedDay ? { ...report, [field]: value } : report))
    );
  };

  const getCurrentDayData = () => {
    const dayReport = dailyReports.find((report) => report.day === selectedDay);
    return dayReport || { toilet: '', food_intake: '', friends_interaction: '', studies_mood: '' };
  };

  const validateForm = () => {
    if (!student) {
      Alert.alert('Error', 'No student selected');
      return false;
    }

    const daysDiff = Math.ceil((weekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff !== 6) {
      Alert.alert('Error', 'Week must be exactly 7 days (Sunday to Saturday)');
      return false;
    }

    // Validate that start date is Sunday (0) and end date is Saturday (6)
    if (weekStart.getDay() !== 0) {
      Alert.alert('Error', 'Week must start on Sunday');
      return false;
    }
    if (weekEnd.getDay() !== 6) {
      Alert.alert('Error', 'Week must end on Saturday');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const reportData: CreateWeeklyReportData = {
      student_id: student!._id,
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      dailyReports,
    };

    await createReport(reportData);
  };

  // Handle success/error after API call
  useEffect(() => {
    if (createSuccess) {
      Alert.alert('Success', 'Weekly report created successfully!');
      onSuccess();
    }
  }, [createSuccess, onSuccess]);

  useEffect(() => {
    if (createError) {
      Alert.alert('Error', `Failed to create report: ${createError}`);
    }
  }, [createError]);

  if (!visible) return null;

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
            Create Weekly Report
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={creating}
            style={{ opacity: creating ? 0.6 : 1 }}>
            <Text className="font-semibold" style={{ color: colors.primary }}>
              {creating ? 'Creating...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Student Info */}
          {student && (
            <View className="mb-4 rounded-lg p-3" style={{ backgroundColor: colors.card }}>
              <Text className="font-semibold" style={{ color: colors.textPrimary }}>
                👶 {student.fullName}
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Roll #{student.rollNum}
              </Text>
            </View>
          )}

          {/* Week Period */}
          <View className="mb-4">
            <Text className="mb-2 font-medium" style={{ color: colors.textPrimary }}>
              Week Period (Sunday to Saturday)
            </Text>

            <View className="flex-row">
              <TouchableOpacity
                className="mr-2 flex-1 rounded-lg border p-3"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                onPress={() => setShowStartPicker(true)}>
                <Text style={{ color: colors.textPrimary }}>Start: {formatDate(weekStart)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="ml-2 flex-1 rounded-lg border p-3"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                onPress={() => setShowEndPicker(true)}>
                <Text style={{ color: colors.textPrimary }}>End: {formatDate(weekEnd)}</Text>
              </TouchableOpacity>
            </View>
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

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={weekStart}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={weekEnd}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
          />
        )}
      </View>
    </Modal>
  );
};
