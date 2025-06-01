import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

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

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue({
          ...initialData,
          birthdate: initialData.birthdate
            ? dayjs(initialData.birthdate)
            : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, initialData, form]);

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      birthdate: values.birthdate
        ? values.birthdate.format("YYYY-MM-DD")
        : null,
    };
    await onSubmit(formData);
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rollNum"
              label="Roll Number"
              rules={[{ required: true, message: "Please enter roll number!" }]}
            >
              <Input
                placeholder="Enter roll number"
                disabled={mode === "edit"}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter student name!" },
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="birthdate"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please select date of birth!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select placeholder="Select gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="address" label="Address">
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item name="additionalInfo" label="Additional Information">
          <Input.TextArea rows={3} placeholder="Enter additional information" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === "edit" ? "Update" : "Create"} Student
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
