import { Table, Card, Space, Button, Tag, Popconfirm, Empty } from "antd";
import {
  DollarOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useStudentsContext } from "../../../context/StudentsContext";
import dayjs from "dayjs";

export default function FeesTable({
  selectedStudentId,
  fees,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onUpdateStatus,
  onDeleteFee,
  updating,
  deleting,
}) {
  const { students } = useStudentsContext();

  // Find the selected student from context
  const selectedStudent = students.find((s) => s.value === selectedStudentId);
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Space>
          <DollarOutlined />${parseFloat(amount).toFixed(2)}
        </Space>
      ),
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date, record) => {
        // Handle DD/MM/YYYY format from backend
        let parsedDate;
        if (typeof date === "string" && date.includes("/")) {
          // Parse DD/MM/YYYY format
          const [day, month, year] = date.split("/");
          parsedDate = dayjs(`${year}-${month}-${day}`);
        } else {
          // Handle other date formats
          parsedDate = dayjs(date);
        }

        if (!parsedDate.isValid()) {
          return <span style={{ color: "#cf1322" }}>Invalid Date</span>;
        }

        const formattedDate = parsedDate.format("MMM DD, YYYY");
        const isOverdue =
          parsedDate.isBefore(dayjs()) && record.status !== "paid";

        return (
          <span style={{ color: isOverdue ? "#cf1322" : "#262626" }}>
            {formattedDate}
            {isOverdue && <span style={{ marginLeft: 4 }}>(Overdue)</span>}
          </span>
        );
      },
      sorter: (a, b) => {
        // Handle sorting for DD/MM/YYYY format
        const parseDate = (date) => {
          if (typeof date === "string" && date.includes("/")) {
            const [day, month, year] = date.split("/");
            return dayjs(`${year}-${month}-${day}`);
          }
          return dayjs(date);
        };
        return parseDate(a.deadline).unix() - parseDate(b.deadline).unix();
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        // Handle both frontend and backend status formats
        const normalizedStatus = status?.toLowerCase();
        const displayStatus = normalizedStatus === "paid" ? "Paid" : "Unpaid";
        const color = normalizedStatus === "paid" ? "green" : "orange";

        return <Tag color={color}>{displayStatus.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "Paid", value: "paid" },
        { text: "Unpaid", value: "pending" },
      ],
      onFilter: (value, record) => record.status?.toLowerCase() === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type={
              record.status?.toLowerCase() === "paid" ? "default" : "primary"
            }
            onClick={() =>
              onUpdateStatus(record.id || record._id, record.status)
            }
            loading={updating}
            size="small"
            style={{
              borderRadius: "4px",
            }}
          >
            {record.status?.toLowerCase() === "paid"
              ? "Mark Unpaid"
              : "Mark Paid"}
          </Button>
          <Popconfirm
            title="Delete Fee"
            description="Are you sure you want to delete this fee?"
            onConfirm={() => onDeleteFee(record.id || record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={deleting}
              size="small"
              style={{
                borderRadius: "4px",
              }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {selectedStudent ? (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <UserOutlined style={{ color: "#1890ff" }} />
              <span style={{ fontWeight: 500, fontSize: "16px" }}>
                Fees for: {selectedStudent.label}
              </span>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={fees}
            loading={loading}
            rowKey={(record) => record.id || record._id}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              onChange: onPageChange,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} fees`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            scroll={{ x: 800 }}
          />
        </div>
      ) : (
        <Empty
          description="Please select a student to view fees"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
}
