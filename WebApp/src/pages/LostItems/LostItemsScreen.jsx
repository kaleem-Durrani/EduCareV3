import React, { useState, useEffect } from "react";
import { Space, Typography, Button, Card, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { lostItemService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  LostItemsStatistics,
  LostItemsFilters,
  LostItemsTable,
  LostItemFormModal,
  ClaimItemModal,
} from "./components";
import dayjs from "dayjs";

const { Title } = Typography;

export default function LostItemsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [claimingItem, setClaimingItem] = useState(null);
  const [form] = Form.useForm();
  const [claimForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const pageSize = 10;

  // Fetch lost items statistics
  const { request: fetchStatistics, isLoading: loadingStatistics } = useApi(
    lostItemService.getLostItemsStatistics,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        title: "Failed to Load Statistics",
      },
    }
  );

  // Fetch lost items data
  const {
    data: itemsData,
    isLoading: loading,
    request: fetchItems,
  } = useApi((params) => lostItemService.getAllLostItems(params), {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      title: "Failed to Load Lost Items",
    },
  });

  // Create item API
  const { request: createItemRequest, isLoading: creating } = useApi(
    lostItemService.createLostItem,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Lost Item",
      },
    }
  );

  // Update item API
  const { request: updateItemRequest, isLoading: updating } = useApi(
    ({ id, data }) => lostItemService.updateLostItem(id, data),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Lost Item",
      },
    }
  );

  // Claim item API
  const { request: claimItemRequest, isLoading: claiming } = useApi(
    ({ id, data }) => lostItemService.claimLostItem(id, data),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Claim Lost Item",
      },
    }
  );

  // Delete item API
  const { request: deleteItemRequest } = useApi(
    lostItemService.deleteLostItem,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        title: "Failed to Delete Lost Item",
      },
    }
  );

  useEffect(() => {
    fetchItems({
      page: currentPage,
      limit: pageSize,
      ...filters,
    });
  }, [currentPage, filters]);

  useEffect(() => {
    fetchStatisticsData();
  }, []);

  const fetchStatisticsData = async () => {
    try {
      const stats = await fetchStatistics();
      setStatistics(stats);
    } catch (error) {
      console.log("Failed to fetch statistics");
    }
  };

  const handleCreateItem = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "dateFound") {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else if (key === "image" && values[key]?.file) {
          formData.append("image", values[key].file);
        } else if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      await createItemRequest(formData);
      message.success("Lost item created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchItems({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });
      fetchStatisticsData();
    } catch (error) {
      console.log("Create item error handled by useApi");
    }
  };

  const handleUpdateItem = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "dateFound") {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else if (key === "image" && values[key]?.file) {
          formData.append(key, values[key].file);
        } else if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      await updateItemRequest({
        id: editingItem._id,
        data: formData,
      });
      message.success("Lost item updated successfully!");
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
      fetchItems({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });
      fetchStatisticsData();
    } catch (error) {
      console.log("Update item error handled by useApi");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItemRequest(itemId);
      message.success("Lost item deleted successfully!");
      fetchItems({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });
      fetchStatisticsData();
    } catch (error) {
      console.log("Delete item error handled by useApi");
    }
  };

  const handleClaimItem = async (values) => {
    try {
      await claimItemRequest({
        id: claimingItem._id,
        data: { parentEmail: values.parentEmail },
      });
      message.success("Lost item claimed successfully!");
      setIsClaimModalVisible(false);
      setClaimingItem(null);
      claimForm.resetFields();
      fetchItems({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });
      fetchStatisticsData();
    } catch (error) {
      console.log("Claim item error handled by useApi");
    }
  };

  const handleClaim = (item) => {
    setClaimingItem(item);
    setIsClaimModalVisible(true);
  };

  const handleSubmit = async (values) => {
    if (editingItem) {
      await handleUpdateItem(values);
    } else {
      await handleCreateItem(values);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      title: item.title,
      description: item.description,
      dateFound: dayjs(item.dateFound),
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClaimCancel = () => {
    setIsClaimModalVisible(false);
    setClaimingItem(null);
    claimForm.resetFields();
  };

  // Extract items data
  const items = itemsData?.items || [];

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Lost Items Management</Title>
        </div>

        {/* Statistics Cards */}
        <LostItemsStatistics
          statistics={statistics}
          loading={loadingStatistics}
        />

        {/* Filters */}
        <LostItemsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Table */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Lost Item
            </Button>
          </div>

          <LostItemsTable
            items={items}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={itemsData?.pagination?.totalItems || 0}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDeleteItem}
            onClaim={handleClaim}
          />
        </Card>

        {/* Add/Edit Modal */}
        <LostItemFormModal
          visible={isModalVisible}
          editingItem={editingItem}
          form={form}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          creating={creating}
          updating={updating}
        />

        {/* Claim Modal */}
        <ClaimItemModal
          visible={isClaimModalVisible}
          claimingItem={claimingItem}
          form={claimForm}
          onSubmit={handleClaimItem}
          onCancel={handleClaimCancel}
          claiming={claiming}
        />
      </Space>
    </AdminLayout>
  );
}
