import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { classService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import { useClassesContext } from "../../context/ClassesContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  ClassesStats,
  ClassesTable,
  ClassFormModal,
  StudentsModal,
  TeachersModal,
} from "./components";

const { Title } = Typography;

export default function ClassesScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [classStatistics, setClassStatistics] = useState(null);

  // Get context refresh function
  const { refreshClasses } = useClassesContext();
  const [studentsModalVisible, setStudentsModalVisible] = useState(false);
  const [teachersModalVisible, setTeachersModalVisible] = useState(false);
  const [selectedClassForModal, setSelectedClassForModal] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const pageSize = 10;

  // Fetch classes data with pagination
  const {
    data: classesData,
    isLoading: loading,
    request: fetchClasses,
  } = useApi((params) => classService.getAllClasses(params), {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      showValidationDetails: true,
    },
  });

  // Get class statistics API
  const { request: getClassStatisticsRequest, isLoading: loadingStatistics } =
    useApi(classService.getClassStatistics, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    });

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
    fetchClassesData();
    fetchClassStatistics();
  }, []);

  useEffect(() => {
    fetchClassesData();
  }, [currentPage]);

  const fetchClassesData = async () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    await fetchClasses(params);
  };

  const fetchClassStatistics = async () => {
    try {
      const stats = await getClassStatisticsRequest();
      setClassStatistics(stats);
    } catch (error) {
      console.log("Failed to fetch class statistics");
    }
  };

  const handleCreateClass = async (values) => {
    try {
      await createClassRequest(values);
      message.success("Class created successfully!");
      setIsModalVisible(false);
      fetchClassesData();
      fetchClassStatistics(); // Refresh statistics
      refreshClasses(); // Update context for dropdowns
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create class error handled by useApi");
    }
  };

  const handleUpdateClass = async (values) => {
    try {
      await updateClassRequest({ id: editingClass._id, data: values });
      message.success("Class updated successfully!");
      setIsModalVisible(false);
      setEditingClass(null);
      fetchClassesData();
      fetchClassStatistics(); // Refresh statistics
      refreshClasses(); // Update context for dropdowns
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

  const handleViewStudents = async (classItem) => {
    try {
      const response = await classService.getClassDetails(classItem._id);
      console.log("Class details response:", response);

      // Access the data from the response (handle both direct data and wrapped response)
      const classDetails = response.data || response;
      setSelectedClassForModal(classItem);
      setClassStudents(classDetails.students || []);
      setStudentsModalVisible(true);
    } catch (error) {
      console.error("Error fetching class details:", error);
      message.error("Failed to fetch class details");
    }
  };

  const handleViewTeachers = async (classItem) => {
    try {
      const response = await classService.getClassDetails(classItem._id);
      console.log("Teachers response:", response);

      // Access the data from the response (handle both direct data and wrapped response)
      const classDetails = response.data || response;
      setSelectedClassForModal(classItem);
      setClassTeachers(classDetails.teachers || []);
      setTeachersModalVisible(true);
    } catch (error) {
      console.error("Error fetching class teachers:", error);
      message.error("Failed to fetch class teachers");
    }
  };

  const handleRefreshClassData = async () => {
    if (selectedClassForModal) {
      try {
        const response = await classService.getClassDetails(
          selectedClassForModal._id
        );
        const classDetails = response.data || response;
        setClassStudents(classDetails.students || []);
        setClassTeachers(classDetails.teachers || []);
        // Also refresh the main classes list
        fetchClassesData();
        fetchClassStatistics();
        refreshClasses(); // Update context for dropdowns
      } catch (error) {
        console.error("Error refreshing class data:", error);
      }
    }
  };

  const handleCloseStudentsModal = () => {
    setStudentsModalVisible(false);
    setSelectedClassForModal(null);
    setClassStudents([]);
  };

  const handleCloseTeachersModal = () => {
    setTeachersModalVisible(false);
    setSelectedClassForModal(null);
    setClassTeachers([]);
  };

  const classes = classesData?.classes || [];
  const pagination = classesData?.pagination || {};

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Classes Management</Title>
        </div>

        {/* Statistics Cards */}
        <ClassesStats
          statistics={classStatistics}
          loading={loadingStatistics}
        />

        {/* Classes Table */}
        <ClassesTable
          classes={classes}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={pagination.totalItems || 0}
          onPageChange={setCurrentPage}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onViewStudents={handleViewStudents}
          onViewTeachers={handleViewTeachers}
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

        {/* Students Modal */}
        <StudentsModal
          visible={studentsModalVisible}
          onCancel={handleCloseStudentsModal}
          classData={selectedClassForModal}
          students={classStudents}
          onRefresh={handleRefreshClassData}
        />

        {/* Teachers Modal */}
        <TeachersModal
          visible={teachersModalVisible}
          onCancel={handleCloseTeachersModal}
          classData={selectedClassForModal}
          teachers={classTeachers}
          onRefresh={handleRefreshClassData}
        />
      </Space>
    </AdminLayout>
  );
}
