import React from "react";
import { Table, Button, Space, Tag } from "antd";
import { EditOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function ReportsTable({ reports, loading, onEdit, isTeacher }) {
  const columns = [
    {
      title: "Week Period",
      key: "period",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <div style={{ fontWeight: 500 }}>
            {dayjs(record.weekStart).format("MMM DD")} - {dayjs(record.weekEnd).format("MMM DD, YYYY")}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {dayjs(record.weekEnd).diff(dayjs(record.weekStart), "day") + 1} days
          </div>
        </Space>
      ),
    },
    {
      title: "Daily Reports",
      dataIndex: "dailyReports",
      key: "dailyReports",
      render: (dailyReports) => (
        <Space size={[0, 4]} wrap>
          {dailyReports?.map((report, index) => (
            <Tag key={index} color="blue" style={{ margin: "2px" }}>
              {report.day}
            </Tag>
          )) || <span style={{ color: "#999" }}>No daily reports</span>}
        </Space>
      ),
    },
    {
      title: "Completion",
      key: "completion",
      render: (_, record) => {
        const totalDays = record.dailyReports?.length || 0;
        const completedDays = record.dailyReports?.filter(day => 
          day.pee || day.poop || day.food || day.mood
        ).length || 0;
        const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
        
        return (
          <Space direction="vertical" size={0}>
            <Tag color={percentage >= 80 ? "green" : percentage >= 50 ? "orange" : "red"}>
              {percentage}% Complete
            </Tag>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {completedDays}/{totalDays} days
            </div>
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {isTeacher && (
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={reports}
      loading={loading}
      rowKey="reportId"
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} reports`,
      }}
      expandable={{
        expandedRowRender: (record) => (
          <div style={{ padding: "16px", backgroundColor: "#fafafa" }}>
            <h4 style={{ marginBottom: 16 }}>Daily Report Details</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {record.dailyReports?.map((day, index) => (
                <div key={index} style={{ 
                  padding: "12px", 
                  backgroundColor: "white", 
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9"
                }}>
                  <h5 style={{ marginBottom: 8, color: "#1890ff" }}>{day.day}</h5>
                  <div style={{ fontSize: "12px" }}>
                    <div><strong>Pee:</strong> {day.pee || "Not recorded"}</div>
                    <div><strong>Poop:</strong> {day.poop || "Not recorded"}</div>
                    <div><strong>Food:</strong> {day.food || "Not recorded"}</div>
                    <div><strong>Mood:</strong> {day.mood || "Not recorded"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        rowExpandable: (record) => record.dailyReports && record.dailyReports.length > 0,
      }}
    />
  );
}
