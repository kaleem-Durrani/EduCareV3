import React, { useState, useEffect } from "react";
import { Space, Typography, Form, message } from "antd";
import useApi from "../../hooks/useApi";
import { healthService, studentService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  HealthStats,
  StudentsHealthTable,
  HealthInfoModal,
  HealthMetricsModal,
} from "./components";

const { Title } = Typography;

export default function HealthScreen() {
  const [isHealthInfoModalVisible, setIsHealthInfoModalVisible] =
    useState(false);
  const [isMetricsModalVisible, setIsMetricsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [healthInfoMode, setHealthInfoMode] = useState("view"); // "view", "edit", "create"
  const [currentHealthInfo, setCurrentHealthInfo] = useState(null);
  const [currentMetrics, setCurrentMetrics] = useState([]);
  const [metricsPagination, setMetricsPagination] = useState({});
  const [metricsPage, setMetricsPage] = useState(1);
  const [metricsPageSize, setMetricsPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [healthStatistics, setHealthStatistics] = useState(null);
  const pageSize = 10;

  // Form instances
  const [healthInfoForm] = Form.useForm();

  // Fetch students with health data
  const {
    data: studentsData,
    request: fetchStudents,
    isLoading: loadingStudents,
  } = useApi(studentService.getAllStudents);

  // Get health info API
  const { request: getHealthInfoRequest, isLoading: loadingHealthInfo } =
    useApi(healthService.getHealthInfo, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Load Health Info",
      },
    });

  // Update health info API
  const { request: updateHealthInfoRequest, isLoading: updatingHealthInfo } =
    useApi(
      ({ studentId, healthData }) =>
        healthService.updateHealthInfo(studentId, healthData),
      {
        errorHandling: {
          displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
          showValidationDetails: true,
          title: "Failed to Update Health Info",
        },
      }
    );

  // Get health metrics API
  const { request: getHealthMetricsRequest, isLoading: loadingMetrics } =
    useApi(healthService.getHealthMetrics, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Load Health Metrics",
      },
    });

  // Get health statistics API
  const { request: getHealthStatisticsRequest, isLoading: loadingStatistics } =
    useApi(healthService.getHealthStatistics, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    });

  // Create health metric API
  const { request: createHealthMetricRequest, isLoading: creatingMetric } =
    useApi(
      ({ studentId, metricData }) =>
        healthService.createHealthMetric(studentId, metricData),
      {
        errorHandling: {
          displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
          showValidationDetails: true,
          title: "Failed to Create Health Metric",
        },
      }
    );

  // Update health metric API
  const { request: updateHealthMetricRequest, isLoading: updatingMetric } =
    useApi(
      ({ studentId, metricId, metricData }) =>
        healthService.updateHealthMetric(studentId, metricId, metricData),
      {
        errorHandling: {
          displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
          showValidationDetails: true,
          title: "Failed to Update Health Metric",
        },
      }
    );

  useEffect(() => {
    fetchStudents({ page: currentPage, limit: pageSize });
    fetchHealthStatistics();
  }, [currentPage]);

  useEffect(() => {
    fetchHealthStatistics();
  }, []);

  const fetchHealthStatistics = async () => {
    try {
      const stats = await getHealthStatisticsRequest();
      setHealthStatistics(stats);
    } catch (error) {
      console.log("Failed to fetch health statistics");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Extract students array from API response
  const students = studentsData?.students || [];
  const totalStudents = studentsData?.pagination?.totalItems || 0;

  const handleViewHealthInfo = async (student) => {
    setSelectedStudent(student);
    setHealthInfoMode("view");

    try {
      console.log("Fetching health info for student:", student._id);
      const healthInfo = await getHealthInfoRequest(student._id);
      console.log("Health info received:", healthInfo);
      setCurrentHealthInfo(healthInfo);
      setIsHealthInfoModalVisible(true);
    } catch (error) {
      console.log("Health info fetch error:", error);
      // If no health info exists, show create mode
      setCurrentHealthInfo(null);
      setHealthInfoMode("create");
      setIsHealthInfoModalVisible(true);
    }
  };

  const handleEditHealthInfo = async (student) => {
    setSelectedStudent(student);
    setHealthInfoMode("edit");

    try {
      const healthInfo = await getHealthInfoRequest(student._id);
      setCurrentHealthInfo(healthInfo);
      setIsHealthInfoModalVisible(true);
    } catch (error) {
      // If no health info exists, show create mode
      setCurrentHealthInfo(null);
      setHealthInfoMode("create");
      setIsHealthInfoModalVisible(true);
    }
  };

  const handleViewMetrics = async (student) => {
    setSelectedStudent(student);
    setMetricsPage(1); // Reset to first page when opening modal
    setMetricsPageSize(10); // Reset page size

    try {
      const response = await getHealthMetricsRequest(student._id, {
        page: 1,
        limit: 10,
      });
      setCurrentMetrics(response?.metrics || []);
      setMetricsPagination(response?.pagination || {});
      setIsMetricsModalVisible(true);
    } catch (error) {
      setCurrentMetrics([]);
      setMetricsPagination({});
      setIsMetricsModalVisible(true);
    }
  };

  const handleUpdateHealthInfo = async (values) => {
    try {
      await updateHealthInfoRequest({
        studentId: selectedStudent._id,
        healthData: values,
      });
      message.success("Health information updated successfully!");
      setIsHealthInfoModalVisible(false);
      setCurrentHealthInfo(null);
      setSelectedStudent(null);
      // Refresh statistics
      fetchHealthStatistics();
    } catch (error) {
      console.log("Update health info error handled by useApi");
    }
  };

  const handleCreateHealthMetric = async (values) => {
    try {
      await createHealthMetricRequest({
        studentId: selectedStudent._id,
        metricData: values,
      });
      // Refresh metrics with current pagination
      await refreshMetrics();
      // Refresh statistics
      fetchHealthStatistics();
    } catch (error) {
      console.log("Create health metric error handled by useApi");
    }
  };

  const handleUpdateHealthMetric = async (metricId, values) => {
    try {
      await updateHealthMetricRequest({
        studentId: selectedStudent._id,
        metricId: metricId,
        metricData: values,
      });
      // Refresh metrics with current pagination
      await refreshMetrics();
      // Refresh statistics
      fetchHealthStatistics();
    } catch (error) {
      console.log("Update health metric error handled by useApi");
    }
  };

  const handleDeleteHealthMetric = async (metricId) => {
    // Note: Delete functionality would need to be added to the backend
    message.info("Delete functionality not implemented yet");
  };

  const refreshMetrics = async () => {
    if (!selectedStudent) return;

    try {
      const response = await getHealthMetricsRequest(selectedStudent._id, {
        page: metricsPage,
        limit: metricsPageSize,
      });
      setCurrentMetrics(response?.metrics || []);
      setMetricsPagination(response?.pagination || {});
    } catch (error) {
      console.log("Failed to refresh metrics");
    }
  };

  const handleMetricsPageChange = async (page, pageSize) => {
    setMetricsPage(page);
    if (pageSize !== metricsPageSize) {
      setMetricsPageSize(pageSize);
    }

    try {
      const response = await getHealthMetricsRequest(selectedStudent._id, {
        page,
        limit: pageSize,
      });
      setCurrentMetrics(response?.metrics || []);
      setMetricsPagination(response?.pagination || {});
    } catch (error) {
      console.log("Failed to load metrics page");
    }
  };

  const handleCancelHealthInfo = () => {
    setIsHealthInfoModalVisible(false);
    setCurrentHealthInfo(null);
    setSelectedStudent(null);
  };

  const handleSwitchToEdit = () => {
    setHealthInfoMode("edit");
  };

  const handleCancelMetrics = () => {
    setIsMetricsModalVisible(false);
    setCurrentMetrics([]);
    setMetricsPagination({});
    setSelectedStudent(null);
    setMetricsPage(1);
    setMetricsPageSize(10);
  };

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Health Management</Title>
        </div>

        {/* Statistics Cards */}
        <HealthStats
          statistics={healthStatistics}
          loading={loadingStatistics}
        />

        {/* Students Health Table */}
        <StudentsHealthTable
          students={students}
          loading={loadingStudents}
          currentPage={currentPage}
          pageSize={pageSize}
          total={totalStudents}
          onPageChange={handlePageChange}
          onViewHealthInfo={handleViewHealthInfo}
          onViewMetrics={handleViewMetrics}
          onEditHealthInfo={handleEditHealthInfo}
        />

        {/* Health Info Modal */}
        <HealthInfoModal
          visible={isHealthInfoModalVisible}
          onCancel={handleCancelHealthInfo}
          onSubmit={handleUpdateHealthInfo}
          loading={updatingHealthInfo}
          selectedStudent={selectedStudent}
          mode={healthInfoMode}
          initialData={currentHealthInfo}
          form={healthInfoForm}
          onEdit={handleSwitchToEdit}
        />

        {/* Health Metrics Modal */}
        <HealthMetricsModal
          visible={isMetricsModalVisible}
          onCancel={handleCancelMetrics}
          onSubmit={handleCreateHealthMetric}
          onUpdate={handleUpdateHealthMetric}
          onDelete={handleDeleteHealthMetric}
          loading={creatingMetric || updatingMetric}
          selectedStudent={selectedStudent}
          metrics={currentMetrics}
          pagination={metricsPagination}
          onPageChange={handleMetricsPageChange}
          onRefresh={refreshMetrics}
        />
      </Space>
    </AdminLayout>
  );
}
