import { Modal, Descriptions, Tag, Button, Image, Avatar, Space } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";
import dayjs from "dayjs";

export default function PostDetailsModal({
  visible,
  post,
  onCancel,
  onManageAudience,
}) {
  if (!post) return null;

  const getAudienceDisplay = () => {
    switch (post.audience?.type) {
      case "all":
        return (
          <Tag color="green" icon={<GlobalOutlined />}>
            Everyone
          </Tag>
        );
      case "class":
        return (
          <Tag color="blue" icon={<TeamOutlined />}>
            {post.audience.class_ids?.length || 0} Classes
          </Tag>
        );
      case "individual":
        return (
          <Tag color="orange" icon={<UserOutlined />}>
            {post.audience.student_ids?.length || 0} Students
          </Tag>
        );
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const renderMedia = () => {
    const hasImage = post.imageUrl;
    const hasVideo = post.videoUrl;

    if (!hasImage && !hasVideo) {
      return <span style={{ color: "#999" }}>No media attached</span>;
    }

    return (
      <Space direction="vertical" size="middle">
        {hasImage && (
          <div>
            <h4>Image:</h4>
            <Image
              width={300}
              src={`${SERVER_URL}/${post.imageUrl}`}
              alt={post.title}
              style={{ borderRadius: 8 }}
            />
          </div>
        )}
        {hasVideo && (
          <div>
            <h4>Video:</h4>
            <video width={300} controls style={{ borderRadius: 8 }}>
              <source src={`${SERVER_URL}/${post.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Space>
    );
  };

  const renderAudienceDetails = () => {
    if (
      post.audience?.type === "class" &&
      post.audience.class_ids?.length > 0
    ) {
      return (
        <div>
          <h4>Classes:</h4>
          <Space wrap>
            {post.audience.class_ids.map((classItem) => (
              <Tag key={classItem._id || classItem} color="blue">
                {classItem.name || classItem}
              </Tag>
            ))}
          </Space>
        </div>
      );
    }

    if (
      post.audience?.type === "individual" &&
      post.audience.student_ids?.length > 0
    ) {
      return (
        <div>
          <h4>Students:</h4>
          <Space wrap>
            {post.audience.student_ids.map((student) => (
              <Tag key={student._id || student} color="orange">
                {student.fullName || student}
              </Tag>
            ))}
          </Space>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal
      title="Post Details"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Close
        </Button>,
        ...(post.audience?.type !== "all"
          ? [
              <Button
                key="manage"
                type="primary"
                icon={<SettingOutlined />}
                onClick={() => onManageAudience(post)}
              >
                Manage Audience
              </Button>,
            ]
          : []),
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Descriptions title="Post Information" bordered column={1}>
          <Descriptions.Item label="Title">
            <strong>{post.title}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Content">
            <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
          </Descriptions.Item>

          <Descriptions.Item label="Author">
            <Space>
              <Avatar
                size={32}
                src={
                  post.teacherId?.photoUrl
                    ? `${SERVER_URL}/${post.teacherId.photoUrl}`
                    : null
                }
                icon={<UserOutlined />}
              />
              <div>
                <div>{post.teacherId?.name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {post.teacherId?.email}
                </div>
              </div>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Audience">
            {getAudienceDisplay()}
          </Descriptions.Item>

          <Descriptions.Item label="Created">
            {dayjs(post.createdAt).format("MMMM DD, YYYY [at] HH:mm")}
          </Descriptions.Item>

          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <Descriptions.Item label="Last Updated">
              {dayjs(post.updatedAt).format("MMMM DD, YYYY [at] HH:mm")}
            </Descriptions.Item>
          )}
        </Descriptions>

        {renderMedia()}

        {renderAudienceDetails()}
      </Space>
    </Modal>
  );
}
