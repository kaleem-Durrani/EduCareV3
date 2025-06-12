import React, { useState, useEffect } from "react";
import { Space, Typography, Button, Card, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { parentService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import { useParentsContext } from "../../context/ParentsContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  ParentsStatistics,
  ParentsFilters,
  ParentsTable,
  ParentFormModal,
  ParentDetailsModal,
  AddRelationModal,
} from "./components";

const { Title } = Typography;

export default function ParentsScreen() {
  // State management
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isRelationModalVisible, setIsRelationModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [form] = Form.useForm();
  const pageSize = 10;

  // Get context refresh function
  const { refreshParents } = useParentsContext();

  // Fetch parents statistics
  const { request: fetchStatistics, isLoading: loadingStatistics } = useApi(
    parentService.getParentsStatistics,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        title: "Failed to Load Statistics",
      },
    }
  );

  // Fetch parents data with pagination and filters
  const {
    data: parentsData,
    isLoading: loading,
    request: fetchParents,
  } = useApi(parentService.getAllParents, {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      title: "Failed to Load Parents",
    },
  });

  // Create parent API
  const { request: createParentRequest, isLoading: creating } = useApi(
    parentService.createParent,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Parent",
      },
    }
  );

  // Update parent API
  const { request: updateParentRequest, isLoading: updating } = useApi(
    parentService.updateParent,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Parent",
      },
    }
  );

  // Delete parent API
  const { request: deleteParentRequest } = useApi(parentService.deleteParent, {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      title: "Failed to Delete Parent",
    },
  });

  // Create relation API
  const { request: createRelationRequest, isLoading: creatingRelation } =
    useApi(parentService.createStudentParentRelation, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Relation",
      },
    });

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchStatisticsData();
  }, []);

  useEffect(() => {
    fetchParentsData();
  }, [currentPage, filters]);

  const fetchStatisticsData = async () => {
    try {
      const stats = await fetchStatistics();
      setStatistics(stats);
    } catch (error) {
      console.log("Statistics error handled by useApi");
    }
  };

  const fetchParentsData = async () => {
    try {
      await fetchParents({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });
    } catch (error) {
      console.log("Parents fetch error handled by useApi");
    }
  };

  // Handler functions
  const handleAdd = () => {
    setEditingParent(null);
    form.resetFields();
    setIsFormModalVisible(true);
  };

  const handleEdit = (parent) => {
    setEditingParent(parent);
    form.setFieldsValue({
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      address: parent.address,
    });
    setIsFormModalVisible(true);
  };

  const handleDetails = (parent) => {
    setSelectedParent(parent);
    setIsDetailsModalVisible(true);
  };

  const handleDelete = async (parentId) => {
    try {
      await deleteParentRequest(parentId);
      message.success("Parent deleted successfully!");
      fetchParentsData();
      fetchStatisticsData();
      refreshParents(); // Update context for dropdowns
    } catch (error) {
      console.log("Delete error handled by useApi");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Add form fields
      Object.keys(values).forEach((key) => {
        if (key !== "photo" && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Add photo if provided
      if (values.photo && values.photo.file) {
        formData.append("photo", values.photo.file);
      }

      if (editingParent) {
        await updateParentRequest(editingParent._id, formData);
        message.success("Parent updated successfully!");
      } else {
        await createParentRequest(formData);
        message.success("Parent created successfully!");
      }

      setIsFormModalVisible(false);
      setEditingParent(null);
      form.resetFields();
      fetchParentsData();
      fetchStatisticsData();
      refreshParents(); // Update context for dropdowns
    } catch (error) {
      console.log("Form submit error handled by useApi");
    }
  };

  const handleFormCancel = () => {
    setIsFormModalVisible(false);
    setEditingParent(null);
    form.resetFields();
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedParent(null);
  };

  const handleAddRelation = (parent = null) => {
    setSelectedParent(parent);
    setIsRelationModalVisible(true);
  };

  const handleRelationSubmit = async (values) => {
    try {
      await createRelationRequest(values);
      message.success("Relation created successfully!");
      setIsRelationModalVisible(false);
      setSelectedParent(null);
      fetchParentsData();
      fetchStatisticsData();
      refreshParents(); // Update context for dropdowns
    } catch (error) {
      console.log("Relation submit error handled by useApi");
    }
  };

  const handleRelationCancel = () => {
    setIsRelationModalVisible(false);
    setSelectedParent(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Extract data
  const parents = parentsData?.parents || [];
  const pagination = parentsData?.pagination || {};

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Parents Management</Title>
        </div>

        {/* Statistics Cards */}
        <ParentsStatistics
          statistics={statistics}
          loading={loadingStatistics}
        />

        {/* Filters */}
        <ParentsFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Parents Table */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Parent
            </Button>
          </div>

          <ParentsTable
            parents={parents}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={pagination.totalItems || 0}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDetails={handleDetails}
            onAddRelation={handleAddRelation}
          />
        </Card>

        {/* Parent Form Modal */}
        <ParentFormModal
          visible={isFormModalVisible}
          editingParent={editingParent}
          form={form}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          creating={creating}
          updating={updating}
        />

        {/* Parent Details Modal */}
        <ParentDetailsModal
          visible={isDetailsModalVisible}
          parent={selectedParent}
          onCancel={handleDetailsCancel}
          onAddRelation={handleAddRelation}
        />

        {/* Add Relation Modal */}
        <AddRelationModal
          visible={isRelationModalVisible}
          selectedParent={selectedParent}
          onSubmit={handleRelationSubmit}
          onCancel={handleRelationCancel}
          loading={creatingRelation}
        />
      </Space>
    </AdminLayout>
  );
}
