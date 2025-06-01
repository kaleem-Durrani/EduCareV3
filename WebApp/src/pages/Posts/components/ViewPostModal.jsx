import React from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Avatar,
  Image,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { Paragraph, Title } = Typography;

export default function ViewPostModal({ visible, onCancel, post }) {
  if (!post) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderAudience = (audience) => {
    if (!audience || audience.type === "all") {
      return <Tag color="blue" icon={<TeamOutlined />}>All Students</Tag>;
    }
    if (audience.type === "class") {
      return (
        <Space direction="vertical" size="small">
          <Tag color="green" icon={<TeamOutlined />}>
            Classes ({audience.class_ids?.length || 0})
          </Tag>
          {audience.class_ids?.map((classItem) => (
            <Tag key={classItem._id} color="green">
              {classItem.name}
            </Tag>
          ))}
        </Space>
      );
    }
    if (audience.type === "individual") {
      return (
        <Space direction="vertical" size="small">
          <Tag color="orange" icon={<UserOutlined />}>
            Students ({audience.student_ids?.length || 0})
          </Tag>
          {audience.student_ids?.map((student) => (
            <Tag key={student._id} color="orange">
              {student.fullName} ({student.rollNum})
            </Tag>
          ))}
        </Space>
      );
    }
    return <Tag>Unknown</Tag>;
  };

  return (
    <Modal
      title="View Post"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Post Title */}
        <Title level={3} style={{ margin: 0 }}>
          {post.title}
        </Title>

        {/* Post Details */}
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item
            label={
              <Space>
                <UserOutlined />
                Teacher
              </Space>
            }
            span={2}
          >
            <Space>
              <Avatar
                src={post.teacherId?.photoUrl}
                size="small"
              >
                {post.teacherId?.name?.charAt(0)}
              </Avatar>
              <div>
                <div style={{ fontWeight: "500" }}>
                  {post.teacherId?.name}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {post.teacherId?.email}
                </div>
              </div>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined />
                Created
              </Space>
            }
          >
            {formatDate(post.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined />
                Updated
              </Space>
            }
          >
            {post.updatedAt ? formatDate(post.updatedAt) : "Never"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <TeamOutlined />
                Audience
              </Space>
            }
            span={2}
          >
            {renderAudience(post.audience)}
          </Descriptions.Item>
        </Descriptions>

        {/* Post Content */}
        <div>
          <Title level={4}>Content</Title>
          <Paragraph
            style={{
              backgroundColor: "#f5f5f5",
              padding: "16px",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            {post.content}
          </Paragraph>
        </div>

        {/* Media */}
        {(post.imageUrl || post.videoUrl) && (
          <>
            <Divider />
            <div>
              <Title level={4}>Media</Title>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {post.imageUrl && (
                  <div>
                    <Space>
                      <PictureOutlined />
                      <span style={{ fontWeight: "500" }}>Image:</span>
                    </Space>
                    <div style={{ marginTop: "8px" }}>
                      <Image
                        src={post.imageUrl}
                        alt="Post image"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                    </div>
                  </div>
                )}

                {post.videoUrl && (
                  <div>
                    <Space>
                      <VideoCameraOutlined />
                      <span style={{ fontWeight: "500" }}>Video:</span>
                    </Space>
                    <div style={{ marginTop: "8px" }}>
                      <video
                        src={post.videoUrl}
                        controls
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </Space>
            </div>
          </>
        )}

        {/* Created/Updated By */}
        {(post.createdBy || post.updatedBy) && (
          <>
            <Divider />
            <Descriptions column={2} size="small">
              {post.createdBy && (
                <Descriptions.Item label="Created By">
                  <Space>
                    <Avatar size="small">
                      {post.createdBy?.name?.charAt(0)}
                    </Avatar>
                    {post.createdBy?.name}
                  </Space>
                </Descriptions.Item>
              )}
              {post.updatedBy && (
                <Descriptions.Item label="Updated By">
                  <Space>
                    <Avatar size="small">
                      {post.updatedBy?.name?.charAt(0)}
                    </Avatar>
                    {post.updatedBy?.name}
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
          </>
        )}
      </Space>
    </Modal>
  );
}
