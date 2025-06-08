import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Space } from "antd";

const { TextArea } = Input;

export default function ClassFormModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  title,
  mode,
  initialData,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue({
          name: initialData.name,
          description: initialData.description || "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, initialData, form]);

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
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
        <Form.Item
          name="name"
          label="Class Name"
          rules={[
            { required: true, message: "Please enter class name!" },
            {
              min: 2,
              message: "Class name must be at least 2 characters!",
            },
          ]}
        >
          <Input
            placeholder="Enter class name (e.g., Red Class, Blue Class)"
            size="large"
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 500, message: "Description cannot exceed 500 characters!" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Enter class description (optional)"
            showCount
            maxLength={500}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                borderRadius: "6px",
                height: "40px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {mode === "edit" ? "Update" : "Create"} Class
            </Button>
            <Button
              onClick={handleCancel}
              style={{
                borderRadius: "6px",
                height: "40px",
                fontSize: "14px",
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <style>{`
        .ant-input:hover,
        .ant-input:focus,
        .ant-input-focused {
          border-color: #40a9ff !important;
          box-shadow: 0 4px 8px rgba(64, 169, 255, 0.2) !important;
        }

        .ant-input:focus,
        .ant-input-focused {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </Modal>
  );
}
