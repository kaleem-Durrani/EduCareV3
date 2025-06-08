import { Table, Button, Avatar, Tag, Dropdown, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserAddOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";
import dayjs from "dayjs";

export default function ParentsTable({
  parents,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onEdit,
  onDelete,
  onDetails,
  onAddRelation,
}) {
  const columns = [
    {
      title: "Photo",
      dataIndex: "photoUrl",
      key: "photoUrl",
      width: 80,
      render: (photoUrl, record) => (
        <Avatar
          size={50}
          src={photoUrl ? `${SERVER_URL}/${photoUrl}` : null}
          icon={<UserOutlined />}
          style={{ border: "1px solid #d9d9d9" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Children",
      dataIndex: "childrenCount",
      key: "childrenCount",
      render: (count) => (
        <Tag color={count > 0 ? "green" : "orange"}>
          {count} {count === 1 ? "Child" : "Children"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => {
        const menuItems = [
          {
            key: "details",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => onDetails(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            onClick: () => onEdit(record),
          },
          {
            key: "addRelation",
            label: "Add Child",
            icon: <UserAddOutlined />,
            onClick: () => onAddRelation(record),
          },
          {
            key: "delete",
            label: (
              <Popconfirm
                title="Delete Parent"
                description="Are you sure you want to delete this parent?"
                onConfirm={() => onDelete(record._id)}
                okText="Yes"
                cancelText="No"
                placement="left"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  style={{ width: "100%", textAlign: "left", border: "none" }}
                >
                  Delete
                </Button>
              </Popconfirm>
            ),
            onClick: (e) => {
              e.domEvent.stopPropagation();
            },
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              style={{ border: "none" }}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={parents}
      loading={loading}
      rowKey={(record) => record._id}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} parents`,
      }}
    />
  );
}
