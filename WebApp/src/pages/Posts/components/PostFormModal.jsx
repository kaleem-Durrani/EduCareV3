import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Progress,
  message,
} from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useStudentsContext } from "../../../context/StudentsContext";
import { useClassesContext } from "../../../context/ClassesContext";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

export default function PostFormModal({
  visible,
  editingPost,
  form,
  onSubmit,
  onCancel,
  creating,
  updating,
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { students } = useStudentsContext();
  const { classes } = useClassesContext();

  const isEditing = !!editingPost;
  const loading = creating || updating;

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.log("Form submit error handled by parent");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setUploadProgress(0);
    setUploading(false);
    onCancel();
  };

  // Custom upload props for images
  const imageUploadProps = {
    name: "image",
    multiple: false,
    accept: "image/*",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Image must be smaller than 10MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      if (info.file.status === "uploading") {
        setUploading(true);
        setUploadProgress(info.file.percent || 0);
      } else if (info.file.status === "done") {
        setUploading(false);
        setUploadProgress(100);
        message.success("Image uploaded successfully!");
      } else if (info.file.status === "error") {
        setUploading(false);
        setUploadProgress(0);
        message.error("Image upload failed!");
      }
    },
  };

  // Custom upload props for videos
  const videoUploadProps = {
    name: "video",
    multiple: false,
    accept: "video/*",
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error("Video must be smaller than 100MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      if (info.file.status === "uploading") {
        setUploading(true);
        setUploadProgress(info.file.percent || 0);
      } else if (info.file.status === "done") {
        setUploading(false);
        setUploadProgress(100);
        message.success("Video uploaded successfully!");
      } else if (info.file.status === "error") {
        setUploading(false);
        setUploadProgress(0);
        message.error("Video upload failed!");
      }
    },
  };

  return (
    <Modal
      title={isEditing ? "Edit Post" : "Create New Post"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          audience: { type: "all" },
        }}
      >
        <Form.Item
          name="title"
          label="Post Title"
          rules={[{ required: true, message: "Please enter post title" }]}
        >
          <Input placeholder="Enter post title" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter post content" }]}
        >
          <TextArea rows={4} placeholder="Write your post content here..." />
        </Form.Item>

        <Form.Item name={["audience", "type"]} label="Audience">
          <Select placeholder="Select audience type">
            <Option value="all">Everyone</Option>
            <Option value="class">Specific Classes</Option>
            <Option value="individual">Individual Students</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.audience?.type !== currentValues.audience?.type
          }
        >
          {({ getFieldValue }) => {
            const audienceType = getFieldValue(["audience", "type"]);

            if (audienceType === "class") {
              return (
                <Form.Item
                  name={["audience", "class_ids"]}
                  label="Select Classes (Optional)"
                  extra="You can also manage audience later using 'Manage Audience' option"
                >
                  <Select
                    mode="multiple"
                    placeholder="Select classes (optional - can be managed later)"
                    options={classes}
                  />
                </Form.Item>
              );
            }

            if (audienceType === "individual") {
              return (
                <Form.Item
                  name={["audience", "student_ids"]}
                  label="Select Students (Optional)"
                  extra="You can also manage audience later using 'Manage Audience' option"
                >
                  <Select
                    mode="multiple"
                    placeholder="Select students (optional - can be managed later)"
                    options={students}
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              );
            }

            return null;
          }}
        </Form.Item>

        <Form.Item name="image" label="Upload Image (Optional)">
          <Dragger {...imageUploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to upload</p>
            <p className="ant-upload-hint">
              Support for single image upload. Max size: 10MB
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item name="video" label="Upload Video (Optional)">
          <Dragger {...videoUploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag video to upload</p>
            <p className="ant-upload-hint">
              Support for single video upload. Max size: 100MB
            </p>
          </Dragger>
        </Form.Item>

        {uploading && (
          <Form.Item>
            <Progress percent={uploadProgress} status="active" />
          </Form.Item>
        )}

        <Form.Item>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={uploading}
            >
              {isEditing ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
