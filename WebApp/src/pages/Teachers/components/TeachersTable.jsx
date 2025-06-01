import React from "react";
import { Table, Button, Space, Card } from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  DeleteOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export default function TeachersTable({
  teachers,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onAdd,
  onEnroll,
  onWithdraw,
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
      title: "Classes",
      dataIndex: "classes",
      key: "classes",
      render: (classes) => (
        <Space>
          <TeamOutlined />
          {classes?.length || 0}
        </Space>
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
            icon={<UserAddOutlined />}
            onClick={() => onEnroll(record)}
            size="small"
          >
            Enroll
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onWithdraw(record)}
            size="small"
          >
            Withdraw
          </Button>
        </Space>
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
