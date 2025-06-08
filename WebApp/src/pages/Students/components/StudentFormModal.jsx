import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  message,
  Tag,
} from "antd";
import { ReloadOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { studentService } from "../../../services/index";

export default function StudentFormModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  title,
  mode,
  initialData,
}) {
  const [form] = Form.useForm();
  const [generatingEnrollment, setGeneratingEnrollment] = useState(false);
  const [likes, setLikes] = useState([]);
  const [currentLike, setCurrentLike] = useState("");

  useEffect(() => {
    if (visible) {
      console.log("Modal opened for create mode"); // Debug log
      form.resetFields();
      setLikes([]); // Reset likes array
      setCurrentLike(""); // Reset current like input
      // Auto-generate enrollment number for new students
      console.log("About to generate enrollment number for create mode"); // Debug log
      generateEnrollmentNumber();
    }
  }, [visible]); // Only depend on visible since we only use create mode

  const generateEnrollmentNumber = async () => {
    setGeneratingEnrollment(true);
    try {
      console.log("Generating enrollment number..."); // Debug log
      const response = await studentService.generateEnrollmentNumber();
      console.log("API Response:", response); // Debug log

      // Handle the response structure properly
      // API returns: { success: true, message: "...", data: { enrollmentNumber: 1 } }
      const enrollmentNumber = response?.data?.enrollmentNumber;
      console.log("Extracted enrollment number:", enrollmentNumber); // Debug log

      if (enrollmentNumber) {
        form.setFieldsValue({
          rollNum: enrollmentNumber,
        });
        message.success(`Generated enrollment number: ${enrollmentNumber}`);
      } else {
        throw new Error("No enrollment number received from server");
      }
    } catch (error) {
      console.error("Enrollment generation error:", error); // Debug log
      message.error("Failed to generate enrollment number: " + error.message);
    } finally {
      setGeneratingEnrollment(false);
    }
  };

  const addLike = () => {
    if (currentLike.trim() && !likes.includes(currentLike.trim())) {
      setLikes([...likes, currentLike.trim()]);
      setCurrentLike("");
    } else if (likes.includes(currentLike.trim())) {
      message.warning("This like already exists!");
    }
  };

  const removeLike = (likeToRemove) => {
    setLikes(likes.filter((like) => like !== likeToRemove));
  };

  const handleLikeInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLike();
    }
  };

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      rollNum: parseInt(values.rollNum), // Ensure rollNum is a number
      likes: likes, // Send likes array
      birthdate: values.birthdate
        ? values.birthdate.format("YYYY-MM-DD")
        : null,
    };
    await onSubmit(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    setLikes([]);
    setCurrentLike("");
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Enrollment Number - First field as requested */}
        <Form.Item
          name="rollNum"
          label="Enrollment #"
          rules={[
            { required: true, message: "Please enter enrollment number!" },
          ]}
        >
          <Input
            type="number"
            placeholder="Auto-generated enrollment number"
            disabled={true}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              backgroundColor: "#f5f5f5",
            }}
            addonAfter={
              <Button
                type="text"
                icon={<ReloadOutlined />}
                loading={generatingEnrollment}
                onClick={generateEnrollmentNumber}
                title="Refresh enrollment number"
              >
                Refresh
              </Button>
            }
          />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            { required: true, message: "Please enter full name!" },
            { min: 2, message: "Full name must be at least 2 characters!" },
          ]}
        >
          <Input
            placeholder="Enter full name (e.g., María José García López)"
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="birthdate"
          label="Date of Birth"
          rules={[{ required: true, message: "Please select date of birth!" }]}
        >
          <DatePicker
            style={{
              width: "100%",
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
          />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input
            placeholder="Enter address"
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
          />
        </Form.Item>

        <Form.Item label="Likes">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="Enter a like"
                value={currentLike}
                onChange={(e) => setCurrentLike(e.target.value)}
                onKeyPress={handleLikeInputKeyPress}
                style={{
                  border: "2px solid #d9d9d9",
                  borderRadius: "6px 0 0 6px",
                }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addLike}
                disabled={!currentLike.trim()}
                style={{
                  borderRadius: "0 6px 6px 0",
                }}
              >
                Add Like
              </Button>
            </Space.Compact>

            {likes.length > 0 && (
              <Space wrap style={{ marginTop: 8 }}>
                {likes.map((like, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => removeLike(like)}
                    color="blue"
                    style={{ marginBottom: 4 }}
                  >
                    {like}
                  </Tag>
                ))}
              </Space>
            )}
          </Space>
        </Form.Item>

        <Form.Item name="additionalInfo" label="Additional Information">
          <Input.TextArea
            rows={3}
            placeholder="Enter additional information"
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Student
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
