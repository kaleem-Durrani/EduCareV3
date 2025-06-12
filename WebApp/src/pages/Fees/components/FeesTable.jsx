import {
  Table,
  Card,
  Space,
  Button,
  Tag,
  Popconfirm,
  Select,
  DatePicker,
  Input,
} from "antd";
import {
  DollarOutlined,
  UserOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useStudentsContext } from "../../../context/StudentsContext";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Search } = Input;

export default function FeesTable({
  fees,
  loading,
  pagination,
  statusFilter,
  studentFilter,
  dateRange,
  onAdd,
  onUpdateStatus,
  onDeleteFee,
  onTableChange,
  onRefresh,
  updating,
  deleting,
}) {
  const { students } = useStudentsContext();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
      sorter: true,
    },
    {
      title: "Student",
      dataIndex: ["student_id", "fullName"],
      key: "student",
      render: (_, record) => (
        <Space>
          <UserOutlined />
          <span>{record.student_id?.fullName || "Unknown"}</span>
          {record.student_id?.rollNum && (
            <Tag color="blue">#{record.student_id.rollNum}</Tag>
          )}
        </Space>
      ),
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
      sorter: true,
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
      sorter: true,
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
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
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
      {/* Header with Add Button and Filters */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0 }}>All Fees</h3>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              Add New Fee
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>
              Refresh
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Space wrap style={{ marginBottom: 16 }}>
          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={(value) => onTableChange({ filters: { status: value } })}
            allowClear
          >
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="paid">Paid</Select.Option>
            <Select.Option value="pending">Unpaid</Select.Option>
          </Select>

          <Select
            placeholder="Filter by Student"
            style={{ width: 200 }}
            value={studentFilter || undefined}
            onChange={(value) =>
              onTableChange({ filters: { student: value || "" } })
            }
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {students.map((student) => (
              <Select.Option key={student.value} value={student.value}>
                {student.label}
              </Select.Option>
            ))}
          </Select>

          <RangePicker
            placeholder={["Start Date", "End Date"]}
            value={dateRange}
            onChange={(dates) =>
              onTableChange({ filters: { dateRange: dates } })
            }
            style={{ width: 250 }}
          />
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={fees}
        loading={loading}
        rowKey={(record) => record.id || record._id}
        pagination={{
          current: pagination.currentPage || 1,
          pageSize: pagination.itemsPerPage || 10,
          total: pagination.totalItems || 0,
          onChange: (page, pageSize) => onTableChange({ page, pageSize }),
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} fees`,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={(pagination, filters, sorter) => {
          onTableChange({
            page: pagination.current,
            pageSize: pagination.pageSize,
            sorter: {
              field: sorter.field,
              order: sorter.order,
            },
          });
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
}
