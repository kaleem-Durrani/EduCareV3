import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Select,
  Image,
  Popconfirm,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
  FileImageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { lostItemService } from "../../services/index";
import AdminLayout from "../../components/Layout/AdminLayout";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

export default function LostItemsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const pageSize = 10;

  // Fetch lost items data
  const {
    data: itemsData,
    isLoading: loading,
    request: fetchItems,
  } = useApi(() => lostItemService.getAllLostItems({ 
    page: currentPage, 
    per_page: pageSize,
    ...filters 
  }));

  // Create item API
  const { request: createItemRequest, isLoading: creating } = useApi(
    lostItemService.createLostItem
  );

  // Update item API
  const { request: updateItemRequest, isLoading: updating } = useApi(
    ({ id, data }) => lostItemService.updateLostItem(id, data)
  );

  // Delete item API
  const { request: deleteItemRequest, isLoading: deleting } = useApi(
    lostItemService.deleteLostItem
  );

  useEffect(() => {
    fetchItems();
  }, [currentPage, filters]);

  const handleCreateItem = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'dateFound') {
          formData.append(key, values[key].format('YYYY-MM-DD'));
        } else if (key === 'image' && values[key]?.file) {
          formData.append(key, values[key].file);
        } else if (key !== 'image') {
          formData.append(key, values[key]);
        }
      });

      await createItemRequest(formData);
      message.success("Lost item created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchItems();
    } catch (error) {
      message.error("Failed to create lost item");
    }
  };

  const handleUpdateItem = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'dateFound') {
          formData.append(key, values[key].format('YYYY-MM-DD'));
        } else if (key === 'image' && values[key]?.file) {
          formData.append(key, values[key].file);
        } else if (key !== 'image') {
          formData.append(key, values[key]);
        }
      });

      await updateItemRequest({ id: editingItem._id || editingItem.id, data: formData });
      message.success("Lost item updated successfully!");
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
      fetchItems();
    } catch (error) {
      message.error("Failed to update lost item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItemRequest(itemId);
      message.success("Lost item deleted successfully!");
      fetchItems();
    } catch (error) {
      message.error("Failed to delete lost item");
    }
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
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl, record) => (
        imageUrl ? (
          <Image
            width={60}
            height={60}
            src={`http://tallal.info:5500${imageUrl}`}
            alt={record.title}
            style={{ objectFit: "cover", borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div style={{ 
            width: 60, 
            height: 60, 
            backgroundColor: "#f5f5f5", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            borderRadius: 4
          }}>
            <FileImageOutlined style={{ color: "#ccc" }} />
          </div>
        )
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Date Found",
      dataIndex: "dateFound",
      key: "dateFound",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "claimed" ? "green" : "orange"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Item"
            description="Are you sure you want to delete this lost item?"
            onConfirm={() => handleDeleteItem(record._id || record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={deleting}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const items = itemsData?.items || [];
  const totalItems = items.length;
  const claimedItems = items.filter(item => item.status === "claimed").length;
  const unclaimedItems = totalItems - claimedItems;

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Lost Items Management</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Items"
                value={totalItems}
                prefix={<InboxOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Unclaimed Items"
                value={unclaimedItems}
                prefix={<InboxOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Claimed Items"
                value={claimedItems}
                prefix={<InboxOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card title="Filters">
          <Row gutter={16}>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Filter by status"
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
              >
                <Option value="unclaimed">Unclaimed</Option>
                <Option value="claimed">Claimed</Option>
              </Select>
            </Col>
            <Col span={6}>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="From date"
                value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                onChange={(date) => handleFilterChange("dateFrom", date?.format("YYYY-MM-DD") || "")}
              />
            </Col>
            <Col span={6}>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="To date"
                value={filters.dateTo ? dayjs(filters.dateTo) : null}
                onChange={(date) => handleFilterChange("dateTo", date?.format("YYYY-MM-DD") || "")}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Lost Item
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={items}
            loading={loading}
            rowKey={(record) => record._id || record.id}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: itemsData?.total || 0,
              onChange: setCurrentPage,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingItem ? "Edit Lost Item" : "Add Lost Item"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter item title!" },
              ]}
            >
              <Input placeholder="Enter item title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter description!" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Enter item description"
              />
            </Form.Item>

            <Form.Item
              name="dateFound"
              label="Date Found"
              rules={[
                { required: true, message: "Please select date found!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="image"
              label="Image"
            >
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={() => false}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag image to upload</p>
                <p className="ant-upload-hint">Support for single image upload</p>
              </Dragger>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={creating || updating}
                >
                  {editingItem ? "Update" : "Create"} Item
                </Button>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AdminLayout>
  );
}
