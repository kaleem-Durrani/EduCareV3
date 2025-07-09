import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import {
  reportService,
  WeeklyReport,
  WeeklyReportsResponse,
  ClassStudent,
} from '../../../services';
import { StudentSelector, PaginationControls, ScreenHeader } from '../../../components';
import {
  ReportCard,
  CreateReportModal,
  EditReportModal,
  ViewReportModal,
  DateRangeFilter,
} from './components';

const WeeklyReportScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(null);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);

  // API hooks
  const {
    request: fetchReports,
    isLoading: loadingReports,
    error: reportsError,
    data: reportsData,
  } = useApi<WeeklyReportsResponse>((params: any) =>
    reportService.getWeeklyReports(
      params.studentId,
      params.startDate,
      params.endDate,
      params.page,
      params.limit
    )
  );

  const {
    request: deleteReport,
    isLoading: deletingReport,
    error: deleteError,
  } = useApi<void>((reportId: string) => reportService.deleteWeeklyReport(reportId));

  // Load reports when student or filters change
  useEffect(() => {
    if (selectedStudent) {
      loadReports();
    } else {
      setReports([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [selectedStudent, currentPage, pageSize, dateRange]);

  const loadReports = async () => {
    if (!selectedStudent) return;

    await fetchReports({
      studentId: selectedStudent._id,
      startDate: dateRange.start,
      endDate: dateRange.end,
      page: currentPage,
      limit: pageSize,
    });
  };

  // Update reports when data changes
  useEffect(() => {
    if (reportsData) {
      setReports(reportsData.reports);
      setTotalPages(reportsData.pagination.totalPages);
      setTotalItems(reportsData.pagination.totalItems);
    }
  }, [reportsData]);

  const handleStudentSelect = (student: ClassStudent) => {
    setSelectedStudent(student);
    setCurrentPage(1); // Reset to first page when changing student
  };

  const handleStudentReset = () => {
    setSelectedStudent(null);
    setReports([]);
    setCurrentPage(1);
  };

  const handleCreateReport = () => {
    setIsCreateModalVisible(true);
  };

  const handleEditReport = (report: WeeklyReport) => {
    setSelectedReport(report);
    setIsEditModalVisible(true);
  };

  const handleViewReport = (report: WeeklyReport) => {
    setSelectedReport(report);
    setIsViewModalVisible(true);
  };

  const handleDeleteReport = (report: WeeklyReport) => {
    Alert.alert(
      'Delete Report',
      `Are you sure you want to delete the weekly report for ${report.student_id.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteReport(report._id);
            if (!deleteError) {
              loadReports(); // Refresh the list
            }
          },
        },
      ]
    );
  };

  const handleReportCreated = () => {
    setIsCreateModalVisible(false);
    loadReports(); // Refresh the list
  };

  const handleReportUpdated = () => {
    setIsEditModalVisible(false);
    setSelectedReport(null);
    loadReports(); // Refresh the list
  };

  const handleModalClose = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    setIsViewModalVisible(false);
    setSelectedReport(null);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}

      <ScreenHeader navigation={navigation} title={'Weekly Reports'} />

      {/* Main Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl
              refreshing={loadingReports}
              onRefresh={loadReports}
              colors={[colors.primary]}
            />
          }>
          {/* Student Selector */}
          <StudentSelector
            selectedStudent={selectedStudent}
            onStudentSelect={handleStudentSelect}
            onResetSelection={handleStudentReset}
            placeholder="Select a student to view reports"
            showAsTag={true}
          />

          {selectedStudent && (
            <>
              {/* Date Range Filter */}
              <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />

              {/* Create Report Button */}
              <TouchableOpacity
                className="mb-4 rounded-lg py-3"
                style={{ backgroundColor: colors.primary }}
                onPress={handleCreateReport}>
                <Text className="text-center font-semibold text-white">Create New Report</Text>
              </TouchableOpacity>

              {/* Reports List */}
              {reportsError ? (
                <View className="items-center py-8">
                  <Text className="text-center" style={{ color: '#EF4444' }}>
                    Error loading reports: {reportsError}
                  </Text>
                  <TouchableOpacity
                    className="mt-2 rounded-lg px-4 py-2"
                    style={{ backgroundColor: colors.primary }}
                    onPress={loadReports}>
                    <Text className="text-white">Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : reports.length > 0 ? (
                <>
                  {reports.map((report) => (
                    <ReportCard
                      key={report._id}
                      report={report}
                      onEdit={handleEditReport}
                      onDelete={handleDeleteReport}
                      onView={handleViewReport}
                    />
                  ))}
                </>
              ) : (
                <View className="items-center py-8">
                  <Text className="text-center" style={{ color: colors.textSecondary }}>
                    {loadingReports ? 'Loading reports...' : 'No reports found for this student'}
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Fixed Pagination at Bottom */}
        {selectedStudent && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingReports}
            itemName="reports"
          />
        )}
      </View>

      {/* Modals */}
      <CreateReportModal
        visible={isCreateModalVisible}
        student={selectedStudent}
        onClose={handleModalClose}
        onSuccess={handleReportCreated}
      />

      <EditReportModal
        visible={isEditModalVisible}
        report={selectedReport}
        onClose={handleModalClose}
        onSuccess={handleReportUpdated}
      />

      <ViewReportModal
        visible={isViewModalVisible}
        report={selectedReport}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

export default WeeklyReportScreen;
