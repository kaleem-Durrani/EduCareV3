import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { teacherService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  TeachersStats,
  TeachersTable,
  CreateTeacherModal,
  TeacherDetailsModal,
} from "./components";

const { Title } = Typography;

export default function TeachersScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [teacherStatistics, setTeacherStatistics] = useState(null);
  const pageSize = 10;

  console.log(selectedTeacher);

  // Fetch teachers data with pagination
  const {
    data: teachersData,
    isLoading: loading,
    request: fetchTeachers,
  } = useApi((params) => teacherService.getAllTeachers(params), {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      showValidationDetails: true,
    },
  });

  // Get teacher statistics API
  const { request: getTeacherStatisticsRequest, isLoading: loadingStatistics } =
    useApi(teacherService.getTeacherStatistics, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    });

  // Create teacher API with enhanced validation error handling
  const { request: createTeacherRequest, isLoading: creating } = useApi(
    teacherService.createTeacher,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Teacher",
      },
    }
  );

  useEffect(() => {
    fetchTeachersData();
    fetchTeacherStatistics();
  }, []);

  useEffect(() => {
    fetchTeachersData();
  }, [currentPage]);

  const fetchTeachersData = async () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    await fetchTeachers(params);
  };

  const fetchTeacherStatistics = async () => {
    try {
      const stats = await getTeacherStatisticsRequest();
      setTeacherStatistics(stats);
    } catch (error) {
      console.log("Failed to fetch teacher statistics");
    }
  };

  const handleCreateTeacher = async (values) => {
    try {
      await createTeacherRequest(values);
      message.success("Teacher created successfully!");
      setIsCreateModalVisible(false);
      fetchTeachersData();
      fetchTeacherStatistics(); // Refresh statistics
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create teacher error handled by useApi");
    }
  };

  const handleAdd = () => {
    setIsCreateModalVisible(true);
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalVisible(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancelDetails = () => {
    setIsDetailsModalVisible(false);
    setSelectedTeacher(null);
  };

  const handleRefreshTeachers = () => {
    fetchTeachersData();
    fetchTeacherStatistics();
  };

  const teachers = teachersData?.teachers || [];
  const pagination = teachersData?.pagination || {};

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Teachers Management</Title>
        </div>

        {/* Statistics Cards */}
        <TeachersStats
          statistics={teacherStatistics}
          loading={loadingStatistics}
        />

        {/* Teachers Table */}
        <TeachersTable
          teachers={teachers}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={pagination.totalItems || 0}
          onPageChange={setCurrentPage}
          onAdd={handleAdd}
          onViewDetails={handleViewDetails}
        />

        {/* Create Teacher Modal */}
        <CreateTeacherModal
          visible={isCreateModalVisible}
          onCancel={handleCancelCreate}
          onSubmit={handleCreateTeacher}
          loading={creating}
        />

        {/* Teacher Details Modal */}
        <TeacherDetailsModal
          visible={isDetailsModalVisible}
          onCancel={handleCancelDetails}
          teacher={selectedTeacher}
          onRefresh={handleRefreshTeachers}
        />
      </Space>
    </AdminLayout>
  );
}
