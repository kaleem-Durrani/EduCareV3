import React from "react";
import { Table, Button, Space, Card } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";

export default function TeachersTable({
  teachers,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onAdd,
  onViewDetails,
}) {
  const columns = [
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

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add New Teacher
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teachers}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: onPageChange,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} teachers`,
        }}
      />
    </Card>
  );
}
