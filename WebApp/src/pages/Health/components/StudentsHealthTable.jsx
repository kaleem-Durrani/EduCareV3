import React from "react";
import { Table, Button, Space, Card, Tag, Avatar } from "antd";
import {
  HeartOutlined,
  LineChartOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";

export default function StudentsHealthTable({
  students,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewHealthInfo,
  onViewMetrics,
  onEditHealthInfo,
}) {
  const columns = [
    {
      title: "Student",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <Space>
          <Avatar
            size={40}
            src={record.photoUrl ? `${SERVER_URL}/${record.photoUrl}` : null}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Roll: {record.rollNum}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Class",
      dataIndex: "current_class",
      key: "current_class",
      render: (classInfo) =>
        classInfo ? (
          <Tag color="blue">{classInfo.name}</Tag>
        ) : (
          <Tag color="default">Not Assigned</Tag>
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
            icon={<HeartOutlined />}
            onClick={() => onViewHealthInfo(record)}
            size="small"
          >
            Health Info
          </Button>
          <Button
            type="default"
            icon={<LineChartOutlined />}
            onClick={() => onViewMetrics(record)}
            size="small"
          >
            Metrics
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditHealthInfo(record)}
            size="small"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Ensure students is always an array to prevent "rawData.some is not a function" error
  const studentsArray = Array.isArray(students) ? students : [];

  return (
    <Card title="Students Health Management">
      <Table
        columns={columns}
        dataSource={studentsArray}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: onPageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />
    </Card>
  );
}
