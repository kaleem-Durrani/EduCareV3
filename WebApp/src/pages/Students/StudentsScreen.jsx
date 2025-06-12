import { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { studentService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import { useStudentsContext } from "../../context/StudentsContext";
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

  // Get context refresh function
  const { refreshStudents } = useStudentsContext();

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("active");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({});

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

  // Smart refresh function that preserves current state
  const refreshStudentsData = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
      status: statusFilter,
    };

    if (searchFilter) {
      params.search = searchFilter;
    }

    if (sortConfig.field) {
      params.sortBy = sortConfig.field;
      params.sortOrder = sortConfig.order === "ascend" ? "asc" : "desc";
    }

    fetchStudents(params);
  };

  useEffect(() => {
    refreshStudentsData();
  }, [currentPage, pageSize, statusFilter, searchFilter, sortConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateStudent = async (values) => {
    try {
      await createStudentRequest(values);
      message.success("Student created successfully!");
      setIsModalVisible(false);
      refreshStudentsData(); // Use smart refresh
      refreshStudents(); // Update context for dropdowns
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
    // Only pass the student ID and basic info needed for modal title
    setSelectedStudent({ _id: student._id, fullName: student.fullName });
    setIsDetailsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedStudent(null);
  };

  const handleTableChange = ({
    page,
    pageSize: newPageSize,
    sorter,
    filters,
    status,
  }) => {
    // Update state variables
    if (page) setCurrentPage(page);
    if (newPageSize) setPageSize(newPageSize);
    if (status !== undefined) setStatusFilter(status);
    if (filters?.search !== undefined) setSearchFilter(filters.search);
    if (sorter) {
      setSortConfig({
        field: sorter.field,
        order: sorter.order,
      });
    }

    // The useEffect will automatically trigger refreshStudentsData when state changes
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
          statusFilter={statusFilter}
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
          onRefresh={refreshStudentsData}
        />
      </Space>
    </AdminLayout>
  );
}
