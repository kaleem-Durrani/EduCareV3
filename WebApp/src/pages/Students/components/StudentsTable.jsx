import { Table, Button, Space, Tag, Card, Modal, Avatar, Select } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { SERVER_URL } from "../../../services/index";

export default function StudentsTable({
  students,
  loading,
  pagination,
  statusFilter,
  onAdd,
  onDelete,
  onViewDetails,
  onTableChange,
}) {
  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            src={record.photoUrl ? `${SERVER_URL}/${record.photoUrl}` : null}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>{record.fullName}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Enrollment #: {record.rollNum}
            </div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Date of Birth",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Current Class",
      dataIndex: ["current_class", "name"],
      key: "current_class",
      render: (className) => className || "Not Assigned",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
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
            icon={<EyeOutlined />}
            onClick={() => onViewDetails && onViewDetails(record)}
          >
            Details
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
            Add New Student
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
        dataSource={students}
        loading={loading}
        rowKey="_id"
        pagination={
          pagination
            ? {
                current: pagination.currentPage,
                total: pagination.totalItems,
                pageSize: pagination.itemsPerPage,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} students`,
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
              }
            : {
                pageSize: 10,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} students`,
              }
        }
        onChange={(paginationInfo, filters, sorter) => {
          // Handle table changes (sorting, filtering, etc.)
          if (onTableChange) {
            onTableChange({
              page: paginationInfo.current,
              pageSize: paginationInfo.pageSize,
              sorter,
              filters,
            });
          }
        }}
      />
    </Card>
  );
}
