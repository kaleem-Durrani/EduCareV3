import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

export default function EditPostModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  post,
}) {
  const [form] = Form.useForm();
  const [imageFileList, setImageFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);

  useEffect(() => {
    if (visible && post) {
      form.setFieldsValue({
        title: post.title,
        content: post.content,
        audience: post.audience || { type: "all" },
      });

      // Set existing media files
      const imageFiles = post.imageUrl
        ? [
            {
              uid: "-1",
              name: "image.jpg",
              status: "done",
              url: post.imageUrl,
            },
          ]
        : [];
      
      const videoFiles = post.videoUrl
        ? [
            {
              uid: "-1",
              name: "video.mp4",
              status: "done",
              url: post.videoUrl,
            },
          ]
        : [];

      setImageFileList(imageFiles);
      setVideoFileList(videoFiles);
    }
  }, [visible, post, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Handle file uploads (simplified - in real app, upload to cloud storage)
      const formData = {
        ...values,
        imageUrl: imageFileList.length > 0 ? imageFileList[0].url || imageFileList[0].thumbUrl : null,
        videoUrl: videoFileList.length > 0 ? videoFileList[0].url || videoFileList[0].thumbUrl : null,
      };

      await onSubmit(formData);
      form.resetFields();
      setImageFileList([]);
      setVideoFileList([]);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageFileList([]);
    setVideoFileList([]);
    onCancel();
  };

  // Image upload props
  const imageUploadProps = {
    listType: "picture-card",
    fileList: imageFileList,
    onChange: ({ fileList }) => setImageFileList(fileList),
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    maxCount: 1,
  };

  // Video upload props
  const videoUploadProps = {
    fileList: videoFileList,
    onChange: ({ fileList }) => setVideoFileList(fileList),
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('You can only upload video files!');
        return false;
      }
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('Video must be smaller than 50MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    maxCount: 1,
  };

  return (
    <Modal
      title="Edit Post"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Update Post
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: "Please enter post title" },
            { max: 200, message: "Title cannot exceed 200 characters" },
          ]}
        >
          <Input placeholder="Enter post title" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[
            { required: true, message: "Please enter post content" },
            { max: 5000, message: "Content cannot exceed 5000 characters" },
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Enter post content"
            showCount
            maxLength={5000}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Audience Type">
              <Form.Item name={["audience", "type"]} noStyle>
                <Select placeholder="Select audience">
                  <Option value="all">All Students</Option>
                  <Option value="class">Specific Classes</Option>
                  <Option value="individual">Individual Students</Option>
                </Select>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Image">
              <Upload {...imageUploadProps}>
                {imageFileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload Image</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Video">
              <Upload {...videoUploadProps}>
                <Button icon={<VideoCameraOutlined />}>
                  Upload Video
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
