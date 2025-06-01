import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { teacherService, classService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  TeachersStats,
  TeachersTable,
  CreateTeacherModal,
  EnrollTeacherModal,
  WithdrawTeacherModal,
} from "./components";

const { Title } = Typography;

export default function TeachersScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  console.log(selectedTeacher);

  // Fetch teachers data
  const {
    data: teachersData,
    isLoading: loading,
    request: fetchTeachers,
  } = useApi(() =>
    teacherService.getAllTeachers({ page: currentPage, per_page: pageSize })
  );

  // Fetch classes data
  const { data: classesData, request: fetchClasses } = useApi(
    classService.getAllClasses
  );

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

  // Enroll teacher API with enhanced validation error handling
  const { request: enrollTeacherRequest, isLoading: enrolling } = useApi(
    ({ classId, teacherId }) =>
      classService.enrollTeacher(classId, { teacher_id: teacherId }),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Enroll Teacher",
      },
    }
  );

  // Withdraw teacher API with enhanced error handling
  const { request: withdrawTeacherRequest, isLoading: withdrawing } = useApi(
    ({ classId, teacherId }) =>
      classService.removeTeacherFromClass(classId, teacherId),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Withdraw Teacher",
      },
    }
  );

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, [currentPage]);

  const handleCreateTeacher = async (values) => {
    try {
      await createTeacherRequest(values);
      message.success("Teacher created successfully!");
      setIsCreateModalVisible(false);
      fetchTeachers();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create teacher error handled by useApi");
    }
  };

  const handleEnrollTeacher = async (values) => {
    try {
      await enrollTeacherRequest({
        classId: values.class_id,
        teacherId: selectedTeacher._id,
      });
      message.success("Teacher enrolled successfully!");
      setIsEnrollModalVisible(false);
      setSelectedTeacher(null);
      // Refresh both teachers and classes data to update the UI
      fetchTeachers();
      fetchClasses();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Enroll teacher error handled by useApi");
    }
  };

  const handleWithdrawTeacher = async (values) => {
    try {
      await withdrawTeacherRequest({
        classId: values.class_id,
        teacherId: selectedTeacher._id,
      });
      message.success("Teacher withdrawn successfully!");
      setIsWithdrawModalVisible(false);
      setSelectedTeacher(null);
      // Refresh both teachers and classes data to update the UI
      fetchTeachers();
      fetchClasses();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Withdraw teacher error handled by useApi");
    }
  };

  const handleAdd = () => {
    setIsCreateModalVisible(true);
  };

  const handleEnroll = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEnrollModalVisible(true);
  };

  const handleWithdraw = (teacher) => {
    setSelectedTeacher(teacher);
    setIsWithdrawModalVisible(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancelEnroll = () => {
    setIsEnrollModalVisible(false);
    setSelectedTeacher(null);
  };

  const handleCancelWithdraw = () => {
    setIsWithdrawModalVisible(false);
    setSelectedTeacher(null);
  };

  const teachers = teachersData || [];
  const classes = classesData || [];

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Teachers Management</Title>
        </div>

        {/* Statistics Cards */}
        <TeachersStats teachers={teachers} classes={classes} />

        {/* Teachers Table */}
        <TeachersTable
          teachers={teachers}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={teachersData?.total || 0}
          onPageChange={setCurrentPage}
          onAdd={handleAdd}
          onEnroll={handleEnroll}
          onWithdraw={handleWithdraw}
        />

        {/* Create Teacher Modal */}
        <CreateTeacherModal
          visible={isCreateModalVisible}
          onCancel={handleCancelCreate}
          onSubmit={handleCreateTeacher}
          loading={creating}
        />

        {/* Enroll Teacher Modal */}
        <EnrollTeacherModal
          visible={isEnrollModalVisible}
          onCancel={handleCancelEnroll}
          onSubmit={handleEnrollTeacher}
          loading={enrolling}
          selectedTeacher={selectedTeacher}
          classes={classes}
        />

        {/* Withdraw Teacher Modal */}
        <WithdrawTeacherModal
          visible={isWithdrawModalVisible}
          onCancel={handleCancelWithdraw}
          onSubmit={handleWithdrawTeacher}
          loading={withdrawing}
          selectedTeacher={selectedTeacher}
          classes={classes}
        />
      </Space>
    </AdminLayout>
  );
}
