import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { classService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import { ClassesStats, ClassesTable, ClassFormModal } from "./components";

const { Title } = Typography;

export default function ClassesScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch classes data
  const {
    data: classesData,
    isLoading: loading,
    request: fetchClasses,
  } = useApi(() =>
    classService.getAllClasses({ page: currentPage, per_page: pageSize })
  );

  // Create class API with enhanced validation error handling
  const { request: createClassRequest, isLoading: creating } = useApi(
    classService.createClass,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Class",
      },
    }
  );

  // Update class API with enhanced validation error handling
  const { request: updateClassRequest, isLoading: updating } = useApi(
    ({ id, data }) => classService.updateClass(id, data),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Class",
      },
    }
  );

  useEffect(() => {
    fetchClasses();
  }, [currentPage]);

  const handleCreateClass = async (values) => {
    try {
      await createClassRequest(values);
      message.success("Class created successfully!");
      setIsModalVisible(false);
      fetchClasses();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create class error handled by useApi");
    }
  };

  const handleUpdateClass = async (values) => {
    try {
      await updateClassRequest({ id: editingClass.id, data: values });
      message.success("Class updated successfully!");
      setIsModalVisible(false);
      setEditingClass(null);
      fetchClasses();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Update class error handled by useApi");
    }
  };

  const handleSubmit = async (values) => {
    if (editingClass) {
      await handleUpdateClass(values);
    } else {
      await handleCreateClass(values);
    }
  };

  const handleAdd = () => {
    setEditingClass(null);
    setIsModalVisible(true);
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingClass(null);
  };

  const handleViewStudents = (classItem) => {
    console.log("View students for class:", classItem);
    // TODO: Navigate to students view for this class
  };

  const classes = classesData || [];

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Classes Management</Title>
        </div>

        {/* Statistics Cards */}
        <ClassesStats classes={classes} />

        {/* Classes Table */}
        <ClassesTable
          classes={classes}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={classesData?.total || 0}
          onPageChange={setCurrentPage}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onViewStudents={handleViewStudents}
        />

        {/* Add/Edit Modal */}
        <ClassFormModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          loading={creating || updating}
          title={editingClass ? "Edit Class" : "Add New Class"}
          mode={editingClass ? "edit" : "create"}
          initialData={editingClass}
        />
      </Space>
    </AdminLayout>
  );
}
