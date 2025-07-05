import React, { useState } from "react";
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

export default function CreatePostModal({
  visible,
  onCancel,
  onSubmit,
  loading,
}) {
  const [form] = Form.useForm();
  const [imageFileList, setImageFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Create FormData for multiple file uploads
      const formData = new FormData();

      // Add form fields
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('teacherId', values.teacherId || '');
      formData.append('audience', JSON.stringify(values.audience || { type: 'all' }));

      // Add multiple images
      imageFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      // Add multiple videos
      videoFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('videos', file.originFileObj);
        }
      });

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

  // Image upload props - support multiple images
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
    maxCount: 10, // Support up to 10 images
    multiple: true,
  };

  // Video upload props - support multiple videos
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
    maxCount: 5, // Support up to 5 videos
    multiple: true,
  };

  return (
    <Modal
      title="Create New Post"
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
          Create Post
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          audience: { type: "class" },
        }}
      >
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
                  <Option value="class">Multiple Classes</Option>
                  <Option value="individual">Multiple Students</Option>
                </Select>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={`Images (${imageFileList.length}/10)`}>
              <Upload {...imageUploadProps}>
                {imageFileList.length < 10 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload Images</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`Videos (${videoFileList.length}/5)`}>
              <Upload {...videoUploadProps}>
                <Button icon={<VideoCameraOutlined />}>
                  Upload Videos
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
