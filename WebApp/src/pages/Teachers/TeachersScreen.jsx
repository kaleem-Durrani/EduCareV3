import { useState, useEffect } from "react";
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
  const [teacherStatistics, setTeacherStatistics] = useState(null);

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("active");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({});

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

  // Smart refresh function that preserves current state
  const refreshTeachersData = async () => {
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

    await fetchTeachers(params);
  };

  useEffect(() => {
    refreshTeachersData();
    fetchTeacherStatistics();
  }, [currentPage, pageSize, statusFilter, searchFilter, sortConfig]); // eslint-disable-line react-hooks/exhaustive-deps

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
      refreshTeachersData(); // Use smart refresh
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
    // Only pass the teacher ID and basic info needed for modal title
    setSelectedTeacher({ _id: teacher._id, name: teacher.name });
    setIsDetailsModalVisible(true);
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

    // The useEffect will automatically trigger refreshTeachersData when state changes
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancelDetails = () => {
    setIsDetailsModalVisible(false);
    setSelectedTeacher(null);
  };

  const handleRefreshTeachers = () => {
    refreshTeachersData(); // Use smart refresh
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
          pagination={pagination}
          statusFilter={statusFilter}
          onAdd={handleAdd}
          onViewDetails={handleViewDetails}
          onTableChange={handleTableChange}
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
