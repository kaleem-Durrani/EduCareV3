import {
  Table,
  Button,
  Space,
  Image,
  Tag,
  Avatar,
  Dropdown,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
  UserOutlined,
  CheckCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";
import dayjs from "dayjs";

export default function LostItemsTable({
  items,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onEdit,
  onDelete,
  onClaim,
}) {
  // Component for delete action with Popconfirm
  const DeleteAction = ({ record }) => (
    <Popconfirm
      title="Delete Lost Item"
      description="Are you sure you want to delete this lost item?"
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
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl, record) =>
        imageUrl ? (
          <Image
            width={60}
            height={60}
            src={`${SERVER_URL}/${imageUrl}`}
            alt={record.title}
            style={{ objectFit: "cover", borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            <FileImageOutlined style={{ color: "#ccc" }} />
          </div>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Date Found",
      dataIndex: "dateFound",
      key: "dateFound",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "claimed" ? "green" : "orange"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Claimed By",
      dataIndex: "claimedBy",
      key: "claimedBy",
      render: (claimedBy) =>
        claimedBy ? (
          <Space>
            <Avatar
              size={32}
              src={
                claimedBy.photoUrl
                  ? `${SERVER_URL}/${claimedBy.photoUrl}`
                  : null
              }
              icon={<UserOutlined />}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{claimedBy.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {claimedBy.email}
              </div>
            </div>
          </Space>
        ) : (
          <span style={{ color: "#999" }}>Not claimed</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => {
        const menuItems = [
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            onClick: () => onEdit(record),
          },
          ...(record.status === "unclaimed"
            ? [
                {
                  key: "claim",
                  label: "Claim",
                  icon: <CheckCircleOutlined />,
                  onClick: () => onClaim(record),
                },
              ]
            : []),
          {
            key: "delete",
            label: <DeleteAction record={record} />,
            onClick: (e) => {
              // Prevent dropdown from closing when clicking delete
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
      dataSource={items}
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
          `${range[0]}-${range[1]} of ${total} items`,
      }}
    />
  );
}
