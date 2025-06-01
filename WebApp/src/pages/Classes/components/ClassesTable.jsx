import React from "react";
import { Table, Button, Space, Card } from "antd";
import { PlusOutlined, EditOutlined, TeamOutlined } from "@ant-design/icons";

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
}) {
  const columns = [
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Academic Year",
      dataIndex: "academic_year",
      key: "academic_year",
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      key: "studentCount",
      render: (count) => (
        <Space>
          <TeamOutlined />
          {count || 0}
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
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<TeamOutlined />}
            onClick={() => onViewStudents(record)}
            size="small"
          >
            Students
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
