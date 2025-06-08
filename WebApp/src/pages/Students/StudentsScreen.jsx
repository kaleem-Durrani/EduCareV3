import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { studentService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import StudentsTable from "./components/StudentsTable";
import StudentFormModal from "./components/StudentFormModal";
import StudentsStats from "./components/StudentsStats";
import StudentDetailsModal from "./components/StudentDetailsModal";

const { Title } = Typography;

export default function StudentsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students data
  const {
    data: students,
    isLoading: loading,
    request: fetchStudents,
  } = useApi((params = {}) => studentService.getAllStudents(params));

  // Create student API with enhanced validation error handling
  const { request: createStudentRequest, isLoading: creating } = useApi(
    studentService.createStudent,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Student",
      },
    }
  );

  // Removed update functionality since we only use create mode

  useEffect(() => {
    fetchStudents({});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateStudent = async (values) => {
    try {
      await createStudentRequest(values);
      message.success("Student created successfully!");
      setIsModalVisible(false);
      fetchStudents({});
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create student error handled by useApi");
    }
  };

  const handleSubmit = async (values) => {
    await handleCreateStudent(values);
  };

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleDelete = (student) => {
    // Implement delete functionality
    console.log("Delete student:", student);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsDetailsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedStudent(null);
  };

  const handleTableChange = ({ page, pageSize, sorter, filters }) => {
    const params = {
      page: page || 1,
      limit: pageSize || 10,
    };

    // Add search if needed
    if (filters?.search) {
      params.search = filters.search;
    }

    // Add sorting if needed
    if (sorter?.field) {
      params.sortBy = sorter.field;
      params.sortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }

    fetchStudents(params);
  };

  // Extract students array from paginated response
  const studentsData = students?.students || [];
  const paginationData = students?.pagination || {};

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Students Management</Title>
        </div>

        {/* Statistics Cards */}
        <StudentsStats />

        {/* Students Table */}
        <StudentsTable
          students={studentsData}
          loading={loading}
          pagination={paginationData}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          onTableChange={handleTableChange}
        />

        {/* Add/Edit Modal */}
        <StudentFormModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          loading={creating}
          title="Add New Student"
          mode="create"
        />

        {/* Student Details Modal */}
        <StudentDetailsModal
          visible={isDetailsModalVisible}
          onCancel={handleDetailsCancel}
          student={selectedStudent}
          onRefresh={() => fetchStudents({})}
        />
      </Space>
    </AdminLayout>
  );
}
