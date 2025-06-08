import React, { useEffect } from "react";
import { Modal, Form, Select, Button, Space } from "antd";
import { useClassesContext } from "../../../context/ClassesContext";

export default function EnrollTeacherModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedTeacher,
}) {
  const { classes } = useClassesContext();
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
          <Select
            placeholder="Choose a class"
            showSearch
            optionFilterProp="label"
            options={classes.map((cls) => ({
              value: cls.value,
              label: cls.label,
            }))}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
          />
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
