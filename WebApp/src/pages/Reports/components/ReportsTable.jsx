import React from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { EditOutlined, CalendarOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function ReportsTable({ reports, loading, onEdit, onDelete, onViewDetails, isTeacher, pagination, onTableChange }) {
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
      render: (dailyReports, record) => (
        <Space size={[0, 4]} wrap>
          {dailyReports?.map((report, index) => (
            <Tag key={index} color="blue" style={{ margin: "2px" }}>
              {report.day}
            </Tag>
          )) || <span style={{ color: "#999" }}>No daily reports</span>}
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails && onViewDetails(record)}
            size="small"
          >
            View Details
          </Button>
        </Space>
      ),
    },
    {
      title: "Completion",
      key: "completion",
      render: (_, record) => {
        const totalDays = record.dailyReports?.length || 0;
        const completedDays = record.dailyReports?.filter(day =>
          day.toilet || day.food_intake || day.friends_interaction || day.studies_mood
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
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => onEdit && onEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Report"
            description="Are you sure you want to delete this weekly report?"
            onConfirm={() => onDelete && onDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              ghost
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={reports}
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
                `${range[0]}-${range[1]} of ${total} reports`,
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
              pageSizeOptions: ["5", "10", "20", "50"],
            }
          : {
              pageSize: 10,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} reports`,
            }
      }
      expandable={{
        expandedRowRender: (record) => (
          <div style={{ padding: "16px", backgroundColor: "#fafafa" }}>
            <h4 style={{ marginBottom: 16 }}>Daily Report Details</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {record.dailyReports?.map((day, index) => (
                <div key={`${record._id}-${day.day}`} style={{
                  padding: "12px", 
                  backgroundColor: "white", 
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9"
                }}>
                  <h5 style={{ marginBottom: 8, color: "#1890ff" }}>{day.day}</h5>
                  <div style={{ fontSize: "12px" }}>
                    <div><strong>Toilet:</strong> {day.toilet || "Not recorded"}</div>
                    <div><strong>Food Intake:</strong> {day.food_intake || "Not recorded"}</div>
                    <div><strong>Friends Interaction:</strong> {day.friends_interaction || "Not recorded"}</div>
                    <div><strong>Studies Mood:</strong> {day.studies_mood || "Not recorded"}</div>
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
