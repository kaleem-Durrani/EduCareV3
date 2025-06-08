import React from "react";
import { Table, Button, Space, Card } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function ClassesTable({
  classes,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onAdd,
  onEdit,
  onViewStudents,
  onViewTeachers,
}) {
  const columns = [
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "No description",
      ellipsis: true,
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      key: "studentCount",
      render: (count) => (
        <Space>
          <TeamOutlined style={{ color: "#1890ff" }} />
          {count || 0}
        </Space>
      ),
      sorter: (a, b) => (a.studentCount || 0) - (b.studentCount || 0),
      width: 130,
    },
    {
      title: "Teachers",
      dataIndex: "teacherCount",
      key: "teacherCount",
      render: (count) => (
        <Space>
          <UserOutlined style={{ color: "#52c41a" }} />
          {count || 0}
        </Space>
      ),
      sorter: (a, b) => (a.teacherCount || 0) - (b.teacherCount || 0),
      width: 130,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
            style={{ borderRadius: "4px" }}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<TeamOutlined />}
            onClick={() => onViewStudents(record)}
            size="small"
            style={{ borderRadius: "4px" }}
          >
            Students
          </Button>
          <Button
            type="default"
            icon={<UserOutlined />}
            onClick={() => onViewTeachers(record)}
            size="small"
            style={{ borderRadius: "4px" }}
          >
            Teachers
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add New Class
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={classes}
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
            `${range[0]}-${range[1]} of ${total} classes`,
        }}
      />
    </Card>
  );
}
