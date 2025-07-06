import React from "react";
import { Modal, Table, Typography, Space, Tag } from "antd";
import {
  RestOutlined,
  UtensilsOutlined,
  TeamOutlined,
  BookOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DailyReportDetailsModal = ({ visible, onCancel, report }) => {
  const dayNames = {
    M: "Monday",
    T: "Tuesday", 
    W: "Wednesday",
    Th: "Thursday",
    F: "Friday",
  };

  const columns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      render: (day) => (
        <Space direction="vertical" size={0}>
          <Text strong>{dayNames[day] || day}</Text>
          <Tag color="blue">{day}</Tag>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <RestOutlined />
          <span>Toilet</span>
        </Space>
      ),
      dataIndex: "toilet",
      key: "toilet",
      render: (text) => text || <Text type="secondary">Not recorded</Text>,
    },
    {
      title: (
        <Space>
          <UtensilsOutlined />
          <span>Food Intake</span>
        </Space>
      ),
      dataIndex: "food_intake",
      key: "food_intake",
      render: (text) => text || <Text type="secondary">Not recorded</Text>,
    },
    {
      title: (
        <Space>
          <TeamOutlined />
          <span>Friends Interaction</span>
        </Space>
      ),
      dataIndex: "friends_interaction",
      key: "friends_interaction",
      render: (text) => text || <Text type="secondary">Not recorded</Text>,
    },
    {
      title: (
        <Space>
          <BookOutlined />
          <span>Studies Mood</span>
        </Space>
      ),
      dataIndex: "studies_mood",
      key: "studies_mood",
      render: (text) => text || <Text type="secondary">Not recorded</Text>,
    },
  ];

  const dailyReports = report?.dailyReports || [];

  return (
    <Modal
      title={
        <Space direction="vertical" size={0}>
          <Title level={4} style={{ margin: 0 }}>
            Daily Report Details
          </Title>
          {report && (
            <Text type="secondary">
              Week: {dayjs(report.weekStart).format("MMM DD")} - {dayjs(report.weekEnd).format("MMM DD, YYYY")}
              {report.student_id && ` • Student: ${report.student_id.fullName}`}
            </Text>
          )}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={dailyReports}
          rowKey="day"
          pagination={false}
          size="middle"
          bordered
          scroll={{ x: 800 }}
          locale={{
            emptyText: "No daily reports available for this week",
          }}
        />
        
        {report?.createdBy && (
          <div style={{ marginTop: 16, padding: 12, backgroundColor: "#f5f5f5", borderRadius: 6 }}>
            <Text type="secondary">
              Created by: {report.createdBy.name} ({report.createdBy.email})
              {report.updatedBy && (
                <span> • Last updated by: {report.updatedBy.name}</span>
              )}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DailyReportDetailsModal;
