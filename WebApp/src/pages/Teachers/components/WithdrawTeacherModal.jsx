import React, { useEffect } from "react";
import { Modal, Form, Select, Button, Space, Alert } from "antd";
import { useClassesContext } from "../../../context/ClassesContext";

export default function WithdrawTeacherModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedTeacher,
}) {
  const { classes: allClasses } = useClassesContext();
  const [form] = Form.useForm();

  // For now, we'll show all classes and let the backend handle validation
  // In the future, we could add a separate API to get teacher's enrolled classes
  const teacherClasses = allClasses;

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
      title={`Withdraw ${selectedTeacher?.name || "Teacher"} from Class`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Alert
          message="Select Class to Withdraw From"
          description={`Choose which class to withdraw ${
            selectedTeacher?.name || "this teacher"
          } from. If the teacher is not enrolled in the selected class, the operation will fail.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form.Item
          name="class_id"
          label="Select Class"
          rules={[{ required: true, message: "Please select a class!" }]}
        >
          <Select
            placeholder="Choose a class to withdraw from"
            showSearch
            optionFilterProp="label"
            options={teacherClasses.map((cls) => ({
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
            <Button type="primary" danger htmlType="submit" loading={loading}>
              Withdraw Teacher
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
