import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { studentService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import StudentsTable from "./components/StudentsTable";
import StudentFormModal from "./components/StudentFormModal";
import StudentsStats from "./components/StudentsStats";

const { Title } = Typography;

export default function StudentsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch students data
  const {
    data: students,
    isLoading: loading,
    request: fetchStudents,
  } = useApi(studentService.getAllStudents);

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

  // Update student API with enhanced validation error handling
  const { request: updateStudentRequest, isLoading: updating } = useApi(
    ({ id, data }) => studentService.updateStudent(id, data),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Student",
      },
    }
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (values) => {
    try {
      await createStudentRequest(values);
      message.success("Student created successfully!");
      setIsModalVisible(false);
      fetchStudents();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create student error handled by useApi");
    }
  };

  const handleUpdateStudent = async (values) => {
    try {
      await updateStudentRequest({ id: editingStudent.id, data: values });
      message.success("Student updated successfully!");
      setIsModalVisible(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Update student error handled by useApi");
    }
  };

  const handleSubmit = async (values) => {
    if (editingStudent) {
      await handleUpdateStudent(values);
    } else {
      await handleCreateStudent(values);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalVisible(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalVisible(true);
  };

  const handleDelete = (student) => {
    // Implement delete functionality
    console.log("Delete student:", student);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStudent(null);
  };

  const studentsData = students || [];

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Students Management</Title>
        </div>

        {/* Statistics Cards */}
        <StudentsStats students={studentsData} />

        {/* Students Table */}
        <StudentsTable
          students={studentsData}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Add/Edit Modal */}
        <StudentFormModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          loading={creating || updating}
          title={editingStudent ? "Edit Student" : "Add New Student"}
          mode={editingStudent ? "edit" : "create"}
          initialData={editingStudent}
        />
      </Space>
    </AdminLayout>
  );
}
