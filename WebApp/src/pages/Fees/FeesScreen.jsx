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

  // Fetch fees data with pagination
  const {
    data: feesData,
    isLoading: loading,
    request: fetchFees,
  } = useApi(
    (studentId, params) => feeService.getStudentFees(studentId, params),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    }
  );

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

  useEffect(() => {
    fetchFeeStatistics();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      fetchFees(selectedStudentId, params);
    }
  }, [selectedStudentId, currentPage, pageSize]);

  const fetchFeeStatistics = async () => {
    try {
      const stats = await getFeeStatisticsRequest();
      setFeeStatistics(stats);
    } catch (error) {
      console.log("Failed to fetch fee statistics");
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
      if (selectedStudentId) {
        const params = {
          page: currentPage,
          limit: pageSize,
        };
        fetchFees(selectedStudentId, params);
      }
      // Refresh statistics
      fetchFeeStatistics();
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

      if (selectedStudentId) {
        const params = {
          page: currentPage,
          limit: pageSize,
        };
        fetchFees(selectedStudentId, params);
      }
      // Refresh statistics
      fetchFeeStatistics();
    } catch (error) {
      console.log("Update fee status error handled by useApi");
    }
  };

  const handleDeleteFee = async (feeId) => {
    try {
      await deleteFeeRequest(feeId);
      message.success("Fee deleted successfully!");
      if (selectedStudentId) {
        const params = {
          page: currentPage,
          limit: pageSize,
        };
        fetchFees(selectedStudentId, params);
      }
      // Refresh statistics
      fetchFeeStatistics();
    } catch (error) {
      console.log("Delete fee error handled by useApi");
    }
  };

  const handleAdd = () => {
    setEditingFee(null);
    form.resetFields();
    if (selectedStudentId) {
      form.setFieldsValue({ student_id: selectedStudentId });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingFee(null);
    form.resetFields();
  };

  const handleStudentChange = (studentId) => {
    setSelectedStudentId(studentId);
    setCurrentPage(1); // Reset to first page when changing student
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  const fees = feesData || [];

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

        {/* Student Selection */}
        <StudentSelector
          selectedStudentId={selectedStudentId}
          onStudentChange={handleStudentChange}
          onAddFee={handleAdd}
        />

        {/* Fees Table */}
        <FeesTable
          selectedStudentId={selectedStudentId}
          fees={fees}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={fees.length} // This will be updated when backend supports pagination
          onPageChange={handlePageChange}
          onUpdateStatus={handleUpdateFeeStatus}
          onDeleteFee={handleDeleteFee}
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
