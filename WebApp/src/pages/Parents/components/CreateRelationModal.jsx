import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Space } from "antd";

export default function CreateRelationModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  initialParentEmail = null,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialParentEmail) {
        form.setFieldsValue({ parent_email: initialParentEmail });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialParentEmail, form]);

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Create Parent-Student Relation"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="parent_email"
          label="Parent Email"
          rules={[
            { required: true, message: "Please enter parent email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter parent email address" />
        </Form.Item>

        <Form.Item
          name="student_rollNum"
          label="Student Enrollment Number"
          rules={[
            { required: true, message: "Please enter student enrollment number!" },
          ]}
        >
          <Input placeholder="Enter student enrollment number" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Relation
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
