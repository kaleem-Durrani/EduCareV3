import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  Space,
  Form,
  Input,
  Switch,
  Card,
  Divider,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function DocumentTypesModal({
  visible,
  onCancel,
  onCreateType,
  onUpdateType,
  onDeleteType,
  loading,
  documentTypes = [],
  pagination = {},
  onPageChange,
  loadingTypes = false,
}) {
  const [isAddingType, setIsAddingType] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      setIsAddingType(false);
      setEditingType(null);
      form.resetFields();
    }
  }, [visible, form]);

  const handleAddType = () => {
    setIsAddingType(true);
    setEditingType(null);
    form.resetFields();
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setIsAddingType(false);
    form.setFieldsValue({
      name: type.name,
      description: type.description,
      required: type.required,
    });
  };

  const handleSubmitType = async (values) => {
    try {
      if (editingType) {
        await onUpdateType(editingType._id, values);
        message.success("Document type updated successfully!");
      } else {
        await onCreateType(values);
        message.success("Document type created successfully!");
      }

      setIsAddingType(false);
      setEditingType(null);
      form.resetFields();
    } catch (error) {
      console.log("Document type operation error handled by useApi");
    }
  };

  const handleDeleteType = async (typeId) => {
    try {
      await onDeleteType(typeId);
      message.success("Document type deleted successfully!");
    } catch (error) {
      console.log("Delete document type error handled by useApi");
    }
  };

  const handleCancel = () => {
    setIsAddingType(false);
    setEditingType(null);
    form.resetFields();
    onCancel();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) =>
        text || <span style={{ color: "#999" }}>No description</span>,
    },
    {
      title: "Required",
      dataIndex: "required",
      key: "required",
      render: (required) => <Switch checked={required} disabled size="small" />,
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
            onClick={() => handleEditType(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Document Type"
            description="Are you sure you want to delete this document type?"
            onConfirm={() => handleDeleteType(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Manage Document Types"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      {/* Add/Edit Form */}
      {(isAddingType || editingType) && (
        <Card style={{ marginBottom: 16 }}>
          <Form form={form} layout="vertical" onFinish={handleSubmitType}>
            <Form.Item
              name="name"
              label="Document Type Name"
              rules={[
                { required: true, message: "Please enter document type name!" },
                { min: 2, message: "Name must be at least 2 characters!" },
              ]}
            >
              <Input placeholder="Enter document type name" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea
                rows={2}
                placeholder="Enter description (optional)"
              />
            </Form.Item>

            <Form.Item
              name="required"
              label="Required Document"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingType ? "Update" : "Create"} Document Type
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingType(false);
                    setEditingType(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Add Button */}
      {!isAddingType && !editingType && (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddType}
          >
            Add New Document Type
          </Button>
        </div>
      )}

      <Divider />

      {/* Document Types Table */}
      <Table
        columns={columns}
        dataSource={documentTypes}
        rowKey="_id"
        loading={loadingTypes}
        pagination={{
          current: pagination.currentPage || 1,
          pageSize: 10,
          total: pagination.totalDocumentTypes || 0,
          onChange: onPageChange,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} document types`,
        }}
        locale={{
          emptyText: "No document types found",
        }}
      />
    </Modal>
  );
}
