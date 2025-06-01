import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    fetchStudents();
  }, []);

  const students = studentsData || [];
  const healthInfos = []; // Will be populated when we fetch health info for each student
  const healthMetrics = []; // Will be populated when we fetch metrics

  const handleViewHealthInfo = async (student) => {
    setSelectedStudent(student);
    setHealthInfoMode("view");

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

    try {
      const metrics = await getHealthMetricsRequest(student._id);
      setCurrentMetrics(metrics || []);
      setIsMetricsModalVisible(true);
    } catch (error) {
      setCurrentMetrics([]);
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
      fetchStudents(); // Refresh data
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
      // Refresh metrics
      const updatedMetrics = await getHealthMetricsRequest(selectedStudent._id);
      setCurrentMetrics(updatedMetrics || []);
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
      // Refresh metrics
      const updatedMetrics = await getHealthMetricsRequest(selectedStudent._id);
      setCurrentMetrics(updatedMetrics || []);
    } catch (error) {
      console.log("Update health metric error handled by useApi");
    }
  };

  const handleDeleteHealthMetric = async (metricId) => {
    // Note: Delete functionality would need to be added to the backend
    message.info("Delete functionality not implemented yet");
  };

  const handleCancelHealthInfo = () => {
    setIsHealthInfoModalVisible(false);
    setCurrentHealthInfo(null);
    setSelectedStudent(null);
  };

  const handleCancelMetrics = () => {
    setIsMetricsModalVisible(false);
    setCurrentMetrics([]);
    setSelectedStudent(null);
  };

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Health Management</Title>
        </div>

        {/* Statistics Cards */}
        <HealthStats
          students={students}
          healthMetrics={healthMetrics}
          healthInfos={healthInfos}
        />

        {/* Students Health Table */}
        <StudentsHealthTable
          students={students}
          loading={loadingStudents}
          currentPage={currentPage}
          pageSize={pageSize}
          total={studentsData?.total || 0}
          onPageChange={setCurrentPage}
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
        />
      </Space>
    </AdminLayout>
  );
}
