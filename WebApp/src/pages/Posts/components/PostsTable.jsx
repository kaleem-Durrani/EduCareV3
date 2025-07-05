import {
  Table,
  Button,
  Tag,
  Dropdown,
  Popconfirm,
  Avatar,
  Image,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined,
  MoreOutlined,
  UserOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  FileImageOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";
import dayjs from "dayjs";

export default function PostsTable({
  posts,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onEdit,
  onDelete,
  onDetails,
  onManageAudience,
}) {
  const getAudienceDisplay = (audience) => {
    switch (audience.type) {
      case "all":
        return (
          <Tag color="green" icon={<GlobalOutlined />}>
            Everyone
          </Tag>
        );
      case "class":
        return (
          <Tag color="blue" icon={<TeamOutlined />}>
            {audience.class_ids?.length || 0} Classes
          </Tag>
        );
      case "individual":
        return (
          <Tag color="orange" icon={<UserOutlined />}>
            {audience.student_ids?.length || 0} Students
          </Tag>
        );
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const getMediaDisplay = (post) => {
    if (!post.media || post.media.length === 0) {
      return <span style={{ color: "#ccc" }}>No media</span>;
    }

    const images = post.media.filter(m => m.type === 'image');
    const videos = post.media.filter(m => m.type === 'video');

    return (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {images.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FileImageOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontSize: "12px", color: "#666" }}>{images.length}</span>
          </div>
        )}
        {videos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PlayCircleOutlined style={{ color: "#52c41a" }} />
            <span style={{ fontSize: "12px", color: "#666" }}>{videos.length}</span>
          </div>
        )}
      </div>
    );
  };
  const columns = [
    {
      title: "Media",
      dataIndex: "imageUrl",
      key: "media",
      width: 80,
      render: (imageUrl, record) => {
        if (imageUrl) {
          return (
            <Image
              width={50}
              height={50}
              src={`${SERVER_URL}/${imageUrl}`}
              alt={record.title}
              style={{ objectFit: "cover", borderRadius: 4 }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          );
        }
        return getMediaDisplay(record);
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
      ellipsis: true,
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: 200 }}>
          {text?.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: "Author",
      dataIndex: "teacherId",
      key: "author",
      render: (teacher) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            size={32}
            src={teacher?.photoUrl ? `${SERVER_URL}/${teacher.photoUrl}` : null}
            icon={<UserOutlined />}
          />
          <span>{teacher?.name}</span>
        </div>
      ),
    },
    {
      title: "Audience",
      dataIndex: "audience",
      key: "audience",
      render: (audience) => getAudienceDisplay(audience),
    },
    {
      title: "Created",
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
          ...(record.audience.type !== "all"
            ? [
                {
                  key: "audience",
                  label: "Manage Audience",
                  icon: <TeamOutlined />,
                  onClick: () => onManageAudience(record),
                },
              ]
            : []),
          {
            key: "delete",
            label: (
              <Popconfirm
                title="Delete Post"
                description="Are you sure you want to delete this post?"
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
      dataSource={posts}
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
          `${range[0]}-${range[1]} of ${total} posts`,
      }}
    />
  );
}
