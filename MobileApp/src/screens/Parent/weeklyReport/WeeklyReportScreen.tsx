import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import {
  parentService,
  reportService,
  ParentStudent,
  WeeklyReport,
  WeeklyReportsResponse,
} from '../../../services';

interface Props {
  navigation: any;
  route?: any;
}

const WeeklyReportScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedStudent, setSelectedStudent] = useState<ParentStudent | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // API hooks
  const {
    data: students,
    isLoading: loadingStudents,
    error: studentsError,
    request: fetchStudents,
  } = useApi<ParentStudent[]>(parentService.getParentStudents);

  const {
    data: reportsData,
    isLoading: loadingReports,
    error: reportsError,
    request: fetchReports,
  } = useApi<WeeklyReportsResponse>(reportService.getWeeklyReports);

  // Load parent's students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  // Auto-select first student when students are loaded
  useEffect(() => {
    if (students && students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
    }
  }, [students, selectedStudent]);

  // Load reports when student is selected
  useEffect(() => {
    if (selectedStudent) {
      loadReports();
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      await fetchStudents();
    } catch (error) {
      Alert.alert('Error', 'Failed to load students. Please try again.');
    }
  };

  const loadReports = async () => {
    if (!selectedStudent) return;

    try {
      await fetchReports(selectedStudent._id);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reports. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    if (selectedStudent) {
      await loadReports();
    }
    setRefreshing(false);
  };

  const renderStudentSelector = () => {
    if (!students || students.length === 0) return null;

    return (
      <View className="mb-4 px-4">
        <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
          Select Student
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {students.map((student) => (
            <TouchableOpacity
              key={student._id}
              className="mr-3 rounded-lg px-4 py-2"
              style={{
                backgroundColor:
                  selectedStudent?._id === student._id ? colors.primary : colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              }}
              onPress={() => setSelectedStudent(student)}>
              <Text
                className="text-sm font-medium"
                style={{
                  color: selectedStudent?._id === student._id ? '#FFFFFF' : colors.textPrimary,
                }}>
                {student.fullName}
              </Text>
              <Text
                className="text-xs"
                style={{
                  color: selectedStudent?._id === student._id ? '#FFFFFF' : colors.textSecondary,
                }}>
                {student.current_class?.name || 'No Class'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderDailyReport = (report: WeeklyReport['dailyReports'][0], index: number) => {
    const dayNames = { M: 'Monday', T: 'Tuesday', W: 'Wednesday', Th: 'Thursday', F: 'Friday' };

    return (
      <View
        key={index}
        className="mb-3 rounded-lg p-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
        <Text className="mb-3 text-lg font-semibold" style={{ color: colors.primary }}>
          {dayNames[report.day as keyof typeof dayNames] || report.day}
        </Text>

        <View className="space-y-2">
          <View className="flex-row">
            <Text className="w-24 text-sm font-medium" style={{ color: colors.textSecondary }}>
              Toilet:
            </Text>
            <Text className="flex-1 text-sm" style={{ color: colors.textPrimary }}>
              {report.toilet || 'No information'}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-24 text-sm font-medium" style={{ color: colors.textSecondary }}>
              Food:
            </Text>
            <Text className="flex-1 text-sm" style={{ color: colors.textPrimary }}>
              {report.food_intake || 'No information'}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-24 text-sm font-medium" style={{ color: colors.textSecondary }}>
              Friends:
            </Text>
            <Text className="flex-1 text-sm" style={{ color: colors.textPrimary }}>
              {report.friends_interaction || 'No information'}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="w-24 text-sm font-medium" style={{ color: colors.textSecondary }}>
              Studies:
            </Text>
            <Text className="flex-1 text-sm" style={{ color: colors.textPrimary }}>
              {report.studies_mood || 'No information'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderWeeklyReport = (report: WeeklyReport) => {
    const weekStart = new Date(report.weekStart).toLocaleDateString();
    const weekEnd = new Date(report.weekEnd).toLocaleDateString();

    return (
      <View
        key={report._id}
        className="mb-6 rounded-lg p-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold" style={{ color: colors.primary }}>
            Week: {weekStart} - {weekEnd}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            By: {report.createdBy?.name || 'Unknown'}
          </Text>
        </View>

        {report.dailyReports && report.dailyReports.length > 0 ? (
          report.dailyReports.map((dailyReport, index) => renderDailyReport(dailyReport, index))
        ) : (
          <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
            No daily reports available for this week
          </Text>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loadingStudents) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textSecondary }}>Loading students...</Text>
        </View>
      );
    }

    if (studentsError) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center" style={{ color: colors.error }}>
            Failed to load students
          </Text>
          <TouchableOpacity
            className="rounded-lg px-4 py-2"
            style={{ backgroundColor: colors.primary }}
            onPress={loadStudents}>
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!students || students.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Students Found
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            You don't have any students assigned to your account.
          </Text>
        </View>
      );
    }

    if (!selectedStudent) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            Select a Student
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            Choose a student to view their weekly reports.
          </Text>
        </View>
      );
    }

    if (loadingReports) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textSecondary }}>Loading reports...</Text>
        </View>
      );
    }

    if (reportsError) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center" style={{ color: colors.error }}>
            Failed to load reports
          </Text>
          <TouchableOpacity
            className="rounded-lg px-4 py-2"
            style={{ backgroundColor: colors.primary }}
            onPress={loadReports}>
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!reportsData || !reportsData.reports || reportsData.reports.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Reports Available
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            No weekly reports have been created for {selectedStudent.fullName} yet.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {reportsData.reports.map((report) => renderWeeklyReport(report))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      {/* Navigation */}
      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Weekly Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Student Selector */}
      {renderStudentSelector()}

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

export default WeeklyReportScreen;
