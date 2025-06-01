import React from "react";
import { Table, Button, Space, Card, Tag, Avatar, Progress } from "antd";
import {
  UserOutlined,
  InboxOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

export default function StudentsBoxTable({
  students,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewBoxStatus,
  onEditBoxStatus,
}) {
  const columns = [
    {
      title: "Student",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
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
      title: "Box Status",
      key: "boxStatus",
      render: (_, record) => {
        const stats = record.boxStats;
        if (!stats) {
          return <Tag color="red">Not Set</Tag>;
        }

        const { totalItems, checkedItems, completionPercentage } = stats;

        return (
          <div style={{ minWidth: "120px" }}>
            <Progress
              percent={completionPercentage}
              size="small"
              status={
                completionPercentage === 100
                  ? "success"
                  : completionPercentage > 50
                  ? "active"
                  : "exception"
              }
            />
            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              {checkedItems}/{totalItems} items
            </div>
          </div>
        );
      },
    },
    {
      title: "Last Updated",
      key: "lastUpdated",
      render: (_, record) => {
        const stats = record.boxStats;
        if (!stats || !stats.lastUpdated) {
          return <span style={{ color: "#999" }}>Never</span>;
        }

        const date = new Date(stats.lastUpdated);
        return (
          <div>
            <div>{date.toLocaleDateString()}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => onViewBoxStatus(record)}
            size="small"
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditBoxStatus(record)}
            size="small"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={students}
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
            `${range[0]}-${range[1]} of ${total} students`,
        }}
      />
    </Card>
  );
}
