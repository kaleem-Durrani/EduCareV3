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
import { InboxOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useStudentsContext } from "../../../context/StudentsContext";
import { useClassesContext } from "../../../context/ClassesContext";
import { SERVER_URL } from "../../../services";

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
  const [imageFileList, setImageFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const { students } = useStudentsContext();
  const { classes } = useClassesContext();

  const isEditing = !!editingPost;

  // Handle editing mode - populate file lists with existing media
  useEffect(() => {
    if (isEditing && editingPost?.media) {
      const images = editingPost.media
        .filter((m) => m.type === "image")
        .map((media, index) => ({
          uid: `existing-image-${index}`,
          name: media.filename || `Image ${index + 1}`,
          status: "done",
          url: SERVER_URL + "/" + media.url,
        }));

      const videos = editingPost.media
        .filter((m) => m.type === "video")
        .map((media, index) => ({
          uid: `existing-video-${index}`,
          name: media.filename || `Video ${index + 1}`,
          status: "done",
          url: SERVER_URL + "/" + media.url,
        }));

      setImageFileList(images);
      setVideoFileList(videos);
    } else {
      setImageFileList([]);
      setVideoFileList([]);
    }
  }, [isEditing, editingPost]);
  const loading = creating || updating;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Create FormData for multiple file uploads
      const formData = new FormData();

      // Add form fields
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("teacherId", values.teacherId || "");
      formData.append(
        "audience",
        JSON.stringify(values.audience || { type: "class" })
      );

      // Add multiple images (only new files)
      imageFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      // Add multiple videos (only new files)
      videoFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("videos", file.originFileObj);
        }
      });

      // For editing: send existing media that should be preserved
      if (isEditing && editingPost?.media) {
        const existingMedia = [];

        // Add existing images that are still in the file list (not removed)
        imageFileList.forEach((file) => {
          if (!file.originFileObj && file.url) {
            existingMedia.push({
              type: 'image',
              url: file.url.replace(SERVER_URL + "/", ""),
              filename: file.name
            });
          }
        });

        // Add existing videos that are still in the file list (not removed)
        videoFileList.forEach((file) => {
          if (!file.originFileObj && file.url) {
            existingMedia.push({
              type: 'video',
              url: file.url.replace(SERVER_URL + "/", ""),
              filename: file.name
            });
          }
        });

        if (existingMedia.length > 0) {
          formData.append("existingMedia", JSON.stringify(existingMedia));
        }
      }

      await onSubmit(formData);
      form.resetFields();
      setImageFileList([]);
      setVideoFileList([]);
    } catch (error) {
      console.log("Form submit error handled by parent");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setUploadProgress(0);
    setUploading(false);
    setImageFileList([]);
    setVideoFileList([]);
    onCancel();
  };

  // Custom upload props for images
  const imageUploadProps = {
    name: "images",
    multiple: true,
    accept: "image/*",
    fileList: imageFileList,
    onChange: ({ fileList }) => setImageFileList(fileList),
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
    maxCount: 10, // Support up to 10 images
    listType: "picture-card",
    showUploadList: {
      showPreviewIcon: false, // Remove eye icon
      showRemoveIcon: true,
    },
  };

  // Custom upload props for videos
  const videoUploadProps = {
    name: "videos",
    multiple: true,
    accept: "video/*",
    fileList: videoFileList,
    onChange: ({ fileList }) => setVideoFileList(fileList),
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
    maxCount: 5, // Support up to 5 videos
    listType: "picture-card",
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: true,
    },
    iconRender: () => <div style={{ fontSize: "24px" }}>🎥</div>,
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
          audience: { type: "class" },
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
            <Option value="class">Multiple Classes</Option>
            <Option value="individual">Multiple Students</Option>
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
                  label="Select Classes"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one class",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select classes..."
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    options={classes}
                  />
                </Form.Item>
              );
            }

            if (audienceType === "individual") {
              return (
                <Form.Item
                  name={["audience", "student_ids"]}
                  label="Select Students"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one student",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select students..."
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    options={students}
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
