import React from "react";
import {
  Table,
  Tag,
  Space,
  Typography,
  Button,
  Card,
  Select,
  Input,
  Dropdown,
  Popconfirm,
  message,
} from "antd";
import {
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;
const { Search } = Input;

export default function MenuTable({
  menus,
  loading,
  pagination,
  statusFilter,
  onAdd,
  onEdit,
  onView,
  onViewCurrentMenu,
  onDelete,
  onUpdateStatus,
  onTableChange,
  onRefresh,
  loadingCurrentMenu,
}) {
  const handleStatusChange = (value) => {
    if (onTableChange) {
      onTableChange({
        page: 1,
        pageSize: pagination?.itemsPerPage || 10,
        status: value,
      });
    }
  };

  const handleSearch = (value) => {
    if (onTableChange) {
      onTableChange({
        page: 1,
        pageSize: pagination?.itemsPerPage || 10,
        search: value,
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "draft":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "archived":
        return <InboxOutlined style={{ color: "#8c8c8c" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const getActionItems = (record) => [
    {
      key: "view",
      label: "View Details",
      icon: <EyeOutlined />,
      onClick: () => onView(record),
    },
    {
      key: "edit",
      label: "Edit Menu",
      icon: <EditOutlined />,
      onClick: () => onEdit(record),
    },
    {
      type: "divider",
    },
    {
      key: "activate",
      label: "Set Active",
      icon: <CheckCircleOutlined />,
      onClick: () => onUpdateStatus(record._id, "active"),
      disabled: record.status === "active",
    },
    {
      key: "draft",
      label: "Set Draft",
      icon: <ClockCircleOutlined />,
      onClick: () => onUpdateStatus(record._id, "draft"),
      disabled: record.status === "draft",
    },
    {
      key: "archive",
      label: "Archive",
      icon: <InboxOutlined />,
      onClick: () => onUpdateStatus(record._id, "archived"),
      disabled: record.status === "archived",
    },
  ];

  const handleDeleteClick = (record) => {
    // This will be handled by the Popconfirm in the dropdown
    onDelete(record._id);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.description}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Period",
      key: "period",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <CalendarOutlined />
            <Text>{dayjs(record.startDate).format("MMM DD")}</Text>
            <Text>-</Text>
            <Text>{dayjs(record.endDate).format("MMM DD, YYYY")}</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {dayjs(record.endDate).diff(dayjs(record.startDate), "day") + 1}{" "}
            days
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Items",
      dataIndex: "totalItems",
      key: "totalItems",
      width: 100,
      render: (totalItems) => (
        <Tag color={totalItems > 0 ? "blue" : "default"}>
          {totalItems || 0} items
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => (
        <Text type="secondary">{dayjs(date).format("MMM DD, YYYY")}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              ...getActionItems(record),
              {
                type: "divider",
              },
              {
                key: "delete",
                label: (
                  <Popconfirm
                    title="Delete Menu"
                    description="Are you sure you want to delete this menu?"
                    onConfirm={() => handleDeleteClick(record)}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                  >
                    <span style={{ color: "#ff4d4f" }}>
                      <DeleteOutlined style={{ marginRight: 8 }} />
                      Delete Menu
                    </span>
                  </Popconfirm>
                ),
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

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
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              Add New Menu
            </Button>
            <Button
              icon={<CalendarOutlined />}
              onClick={onViewCurrentMenu}
              loading={loadingCurrentMenu}
            >
              View Current Menu
            </Button>
          </Space>
        </div>
        <div>
          <Space>
            <Search
              placeholder="Search menus..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
              enterButton={<SearchOutlined />}
            />
            <span>Status:</span>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              style={{ width: 120 }}
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "draft", label: "Draft" },
                { value: "archived", label: "Archived" },
              ]}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              title="Refresh"
            />
          </Space>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={menus}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: pagination?.currentPage || 1,
          pageSize: pagination?.itemsPerPage || 10,
          total: pagination?.totalItems || 0,
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
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} menus`,
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
}
