import React, { useEffect } from "react";
import { Modal, Form, Select, Button, Space } from "antd";

const { Option } = Select;

export default function EnrollTeacherModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedTeacher,
  classes,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`Enroll ${selectedTeacher?.name || "Teacher"} in Class`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="class_id"
          label="Select Class"
          rules={[{ required: true, message: "Please select a class!" }]}
        >
          <Select placeholder="Choose a class">
            {classes.map((cls, index) => (
              <Option key={cls._id || `class-${index}`} value={cls._id}>
                {cls.name} - {cls.grade} {cls.section}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Enroll Teacher
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
