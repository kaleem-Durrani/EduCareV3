import React from "react";
import { Table, Button, Space, Card, Tag, Avatar } from "antd";
import { 
  HeartOutlined, 
  LineChartOutlined, 
  EditOutlined,
  UserOutlined 
} from "@ant-design/icons";

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
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
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
      render: (classInfo) => (
        classInfo ? (
          <Tag color="blue">{classInfo.name}</Tag>
        ) : (
          <Tag color="default">Not Assigned</Tag>
        )
      ),
    },
    {
      title: "Health Info",
      key: "healthInfo",
      render: (_, record) => {
        const hasHealthInfo = record.healthInfo;
        return (
          <Tag color={hasHealthInfo ? "green" : "red"}>
            {hasHealthInfo ? "Complete" : "Missing"}
          </Tag>
        );
      },
    },
    {
      title: "Metrics Count",
      key: "metricsCount",
      render: (_, record) => (
        <span>{record.metricsCount || 0} records</span>
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
