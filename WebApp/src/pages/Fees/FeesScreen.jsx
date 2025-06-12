import React, { useState, useEffect } from "react";
import { Space, Typography, Form, message } from "antd";
import useApi from "../../hooks/useApi";
import { feeService } from "../../services/index";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  FeesStatistics,
  StudentSelector,
  FeesTable,
  FeeModal,
} from "./components";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import dayjs from "dayjs";

const { Title } = Typography;

export default function FeesScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [form] = Form.useForm();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [feeStatistics, setFeeStatistics] = useState(null);

  // Pagination and filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "deadline",
    order: "desc",
  });

  // Fetch all fees data with pagination and filters
  const {
    data: feesData,
    isLoading: loading,
    request: fetchFees,
  } = useApi(feeService.getAllFees, {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      showValidationDetails: true,
    },
  });

  // Get fee statistics API
  const { request: getFeeStatisticsRequest, isLoading: loadingStatistics } =
    useApi(feeService.getFeeStatistics, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    });

  // Create fee API
  const { request: createFeeRequest, isLoading: creating } = useApi(
    feeService.createFee,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    }
  );

  // Update fee status API
  const { request: updateFeeStatusRequest, isLoading: updating } = useApi(
    feeService.updateFeeStatus,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    }
  );

  // Delete fee API
  const { request: deleteFeeRequest, isLoading: deleting } = useApi(
    feeService.deleteFee,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    }
  );

  // Smart refresh function that preserves current state
  const refreshFeesData = async () => {
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      };

      // Only add status if it's not "all"
      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      // Only add student filter if it's a valid value
      if (studentFilter && studentFilter !== "all") {
        params.student_id = studentFilter;
      }

      // Only add date range if both dates are selected
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      await fetchFees(params);
    } catch (error) {
      console.log("Fetch fees error handled by useApi");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshFeesData();
        await fetchFeeStatistics();
      } catch (error) {
        console.log("Error loading fees data:", error);
      }
    };

    loadData();
  }, [
    currentPage,
    pageSize,
    statusFilter,
    studentFilter,
    dateRange,
    sortConfig,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFeeStatistics = async () => {
    try {
      const stats = await getFeeStatisticsRequest();
      setFeeStatistics(stats);
    } catch (error) {
      console.log("Failed to fetch fee statistics:", error);
      // Don't throw error, just log it
    }
  };

  const handleCreateFee = async (values) => {
    try {
      const feeData = {
        ...values,
        deadline: values.deadline.format("YYYY-MM-DD"),
        student_id: values.student_id,
        status: "pending", // Use backend status format
      };
      await createFeeRequest(feeData);
      message.success("Fee created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      refreshFeesData(); // Use smart refresh
      fetchFeeStatistics(); // Refresh statistics
    } catch (error) {
      console.log("Create fee error handled by useApi");
    }
  };

  const handleUpdateFeeStatus = async (feeId, currentStatus) => {
    try {
      // Normalize status for backend
      const normalizedCurrentStatus = currentStatus?.toLowerCase();
      const newStatus = normalizedCurrentStatus === "paid" ? "pending" : "paid";

      await updateFeeStatusRequest(feeId, newStatus);
      message.success(
        `Fee marked as ${newStatus === "paid" ? "paid" : "unpaid"}!`
      );

      refreshFeesData(); // Use smart refresh
      fetchFeeStatistics(); // Refresh statistics
    } catch (error) {
      console.log("Update fee status error handled by useApi");
    }
  };

  const handleDeleteFee = async (feeId) => {
    try {
      await deleteFeeRequest(feeId);
      message.success("Fee deleted successfully!");
      refreshFeesData(); // Use smart refresh
      fetchFeeStatistics(); // Refresh statistics
    } catch (error) {
      console.log("Delete fee error handled by useApi");
    }
  };

  const handleAdd = () => {
    setEditingFee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingFee(null);
    form.resetFields();
  };

  const handleTableChange = ({
    page,
    pageSize: newPageSize,
    sorter,
    filters,
  }) => {
    // Update state variables
    if (page !== undefined) setCurrentPage(page);
    if (newPageSize !== undefined) setPageSize(newPageSize);
    if (filters?.status !== undefined) setStatusFilter(filters.status || "all");
    if (filters?.student !== undefined) setStudentFilter(filters.student || "");
    if (filters?.dateRange !== undefined) setDateRange(filters.dateRange || []);
    if (sorter && sorter.field) {
      setSortConfig({
        field: sorter.field,
        order: sorter.order || "desc",
      });
    }

    // The useEffect will automatically trigger refreshFeesData when state changes
  };

  const handleRefreshFees = () => {
    refreshFeesData(); // Use smart refresh
    fetchFeeStatistics();
  };

  // Get data from API response
  const fees = feesData?.fees || [];
  const paginationData = feesData?.pagination || {};

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Fees Management</Title>
        </div>

        {/* Statistics Cards */}
        <FeesStatistics
          statistics={feeStatistics}
          loading={loadingStatistics}
        />

        {/* Fees Table */}
        <FeesTable
          fees={fees}
          loading={loading}
          pagination={paginationData}
          statusFilter={statusFilter}
          studentFilter={studentFilter}
          dateRange={dateRange}
          onAdd={handleAdd}
          onUpdateStatus={handleUpdateFeeStatus}
          onDeleteFee={handleDeleteFee}
          onTableChange={handleTableChange}
          onRefresh={handleRefreshFees}
          updating={updating}
          deleting={deleting}
        />

        {/* Add Fee Modal */}
        <FeeModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleCreateFee}
          form={form}
          loading={creating}
          editingFee={editingFee}
        />
      </Space>
    </AdminLayout>
  );
}
