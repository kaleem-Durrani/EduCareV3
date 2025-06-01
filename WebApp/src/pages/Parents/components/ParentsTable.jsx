import React from "react";
import { Table, Button, Space, Card } from "antd";
import { PlusOutlined, UserAddOutlined, TeamOutlined } from "@ant-design/icons";

export default function ParentsTable({
  parents,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onAddParent,
  onAddRelation,
  onAddChildToParent,
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
      title: "Children",
      dataIndex: "children",
      key: "children",
      render: (children) => (
        <Space>
          <TeamOutlined />
          {children?.length || 0}
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
            onClick={() => onAddChildToParent(record)}
            size="small"
          >
            Add Child
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddParent}>
            Add New Parent
          </Button>
          <Button type="default" icon={<UserAddOutlined />} onClick={onAddRelation}>
            Add Relation
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={parents}
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
            `${range[0]}-${range[1]} of ${total} parents`,
        }}
      />
    </Card>
  );
}
