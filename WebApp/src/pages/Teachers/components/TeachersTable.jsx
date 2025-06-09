import React from "react";
import { Table, Button, Space, Card, Select, Avatar } from "antd";
import { PlusOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";

export default function TeachersTable({
  teachers,
  loading,
  pagination,
  statusFilter,
  onAdd,
  onViewDetails,
  onTableChange,
}) {
  const getPhotoUrl = (teacher) => {
    if (teacher?.photoUrl) {
      return `${SERVER_URL}/${teacher.photoUrl}`;
    }
    return null;
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (_, record) => (
        <Avatar
          size={40}
          src={getPhotoUrl(record)}
          style={{ backgroundColor: "#1890ff" }}
          icon={!getPhotoUrl(record) ? <UserOutlined /> : null}
        >
          {!getPhotoUrl(record) && record.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onViewDetails(record)}
          size="small"
          style={{ borderRadius: "4px" }}
        >
          Details
        </Button>
      ),
    },
  ];

  const handleStatusChange = (value) => {
    if (onTableChange) {
      onTableChange({
        page: 1,
        pageSize: pagination?.itemsPerPage || 10,
        status: value,
      });
    }
  };

  return (
    <Card>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Add New Teacher
          </Button>
        </div>
        <div>
          <Space>
            <span>Status:</span>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              style={{ width: 120 }}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "all", label: "All" },
              ]}
            />
          </Space>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={teachers}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: pagination?.currentPage || 1,
          pageSize: pagination?.itemsPerPage || 10,
          total: pagination?.totalItems || 0,
          onChange: (page, pageSize) => {
            if (onTableChange) {
              onTableChange({ page, pageSize });
            }
          },
          onShowSizeChange: (_, size) => {
            if (onTableChange) {
              onTableChange({ page: 1, pageSize: size });
            }
          },
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} teachers`,
        }}
      />
    </Card>
  );
}
