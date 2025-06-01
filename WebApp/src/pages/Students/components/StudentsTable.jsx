import React from "react";
import { Table, Button, Space, Tag, Card, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function StudentsTable({
  students,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: "Roll Number",
      dataIndex: "rollNum",
      key: "rollNum",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
    },
    {
      title: "Date of Birth",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Current Class",
      dataIndex: ["currentClass", "name"],
      key: "currentClass",
      render: (className) => className || "Not Assigned",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (status) => (
        <Tag color={status === true ? "green" : "red"}>
          {status === true ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (student) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      content: `This will permanently delete ${student.fullName}'s record.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => onDelete(student),
    });
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add New Student
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={students}
        loading={loading}
        rowKey="rollNum"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
        }}
      />
    </Card>
  );
}
