import { Card, Table, Tag, Space } from "antd";
import { useState, useEffect } from "react";
import { studentService } from "../../../services/index";

export default function StudentEnrollmentHistory({ student }) {
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student?._id) {
      fetchEnrollmentHistory();
    }
  }, [student]);

  const fetchEnrollmentHistory = async () => {
    setLoading(true);
    try {
      const response = await studentService.getEnrollmentHistory(student._id);
      // Ensure we always have an array
      const history = Array.isArray(response) ? response : response?.data || [];
      setEnrollmentHistory(history);
    } catch (error) {
      console.error("Failed to fetch enrollment history:", error);
      setEnrollmentHistory([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Class",
      dataIndex: ["class_id", "name"],
      key: "className",
      render: (className) => className || "N/A",
    },
    {
      title: "Academic Year",
      dataIndex: "academic_year",
      key: "academic_year",
    },
    {
      title: "Enrollment Date",
      dataIndex: "enrollment_date",
      key: "enrollment_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "active") color = "green";
        else if (status === "transferred") color = "orange";
        else if (status === "withdrawn") color = "red";

        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Transfer Date",
      dataIndex: "transfer_date",
      key: "transfer_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Withdrawal Date",
      dataIndex: "withdrawal_date",
      key: "withdrawal_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
  ];

  return (
    <Card title="Enrollment History">
      <Table
        columns={columns}
        dataSource={enrollmentHistory}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} records`,
        }}
        locale={{
          emptyText: "No enrollment history found",
        }}
      />
    </Card>
  );
}
