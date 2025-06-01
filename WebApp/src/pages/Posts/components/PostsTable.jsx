import React from "react";
import { Table, Button, Space, Tag, Avatar, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export default function PostsTable({
  posts,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onViewPost,
  onEditPost,
  onDeletePost,
}) {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div>
            <div style={{ fontWeight: "500" }}>{title}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.content?.substring(0, 50)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Teacher",
      key: "teacher",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar
            src={record.teacherId?.photoUrl}
            size="small"
          >
            {record.teacherId?.name?.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: "500" }}>{record.teacherId?.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.teacherId?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Audience",
      key: "audience",
      render: (_, record) => {
        const audience = record.audience;
        if (!audience || audience.type === "all") {
          return <Tag color="blue">All Students</Tag>;
        }
        if (audience.type === "class") {
          return (
            <Tag color="green">
              Classes ({audience.class_ids?.length || 0})
            </Tag>
          );
        }
        if (audience.type === "individual") {
          return (
            <Tag color="orange">
              Students ({audience.student_ids?.length || 0})
            </Tag>
          );
        }
        return <Tag>Unknown</Tag>;
      },
    },
    {
      title: "Media",
      key: "media",
      render: (_, record) => (
        <Space>
          {record.imageUrl && (
            <Tag icon={<PictureOutlined />} color="cyan">
              Image
            </Tag>
          )}
          {record.videoUrl && (
            <Tag icon={<VideoCameraOutlined />} color="purple">
              Video
            </Tag>
          )}
          {!record.imageUrl && !record.videoUrl && (
            <span style={{ color: "#999" }}>Text Only</span>
          )}
        </Space>
      ),
    },
    {
      title: "Created",
      key: "created",
      render: (_, record) => {
        const date = new Date(record.createdAt);
        return (
          <div>
            <div>{date.toLocaleDateString()}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewPost(record)}
            size="small"
          >
            View
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEditPost(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Post"
            description="Are you sure you want to delete this post?"
            onConfirm={() => onDeletePost(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
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
      dataSource={posts}
      rowKey="_id"
      loading={loading}
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
      locale={{
        emptyText: "No posts found",
      }}
    />
  );
}
