import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Space, Row, Col, InputNumber } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default function HealthInfoModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedStudent,
  mode = "view", // "view", "edit", "create"
  initialData = null,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue(initialData);
      } else if (mode === "create") {
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

  const isReadOnly = mode === "view";
  const title = mode === "view" 
    ? `Health Information - ${selectedStudent?.fullName}` 
    : mode === "edit" 
    ? `Edit Health Information - ${selectedStudent?.fullName}`
    : `Add Health Information - ${selectedStudent?.fullName}`;

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={isReadOnly ? [
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>
      ] : null}
      width={800}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        disabled={isReadOnly}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="bloodGroup"
              label="Blood Group"
              rules={[
                { required: true, message: "Please select blood group!" },
              ]}
            >
              <Select placeholder="Select blood group">
                <Option value="A+">A+</Option>
                <Option value="A-">A-</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
                <Option value="O+">O+</Option>
                <Option value="O-">O-</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="heartRate"
              label="Heart Rate (BPM)"
            >
              <InputNumber 
                min={40} 
                max={200} 
                placeholder="Enter heart rate"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="eyeCondition"
              label="Eye Condition"
            >
              <Select placeholder="Select eye condition" allowClear>
                <Option value="Normal">Normal</Option>
                <Option value="Myopia">Myopia (Nearsighted)</Option>
                <Option value="Hyperopia">Hyperopia (Farsighted)</Option>
                <Option value="Astigmatism">Astigmatism</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="earCondition"
              label="Ear Condition"
            >
              <Select placeholder="Select ear condition" allowClear>
                <Option value="Normal">Normal</Option>
                <Option value="Hearing Loss">Hearing Loss</Option>
                <Option value="Ear Infection">Ear Infection</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="allergies"
          label="Allergies"
        >
          <TextArea 
            rows={3} 
            placeholder="List any allergies (separate with commas)"
          />
        </Form.Item>

        <Form.Item
          name="medicalHistory"
          label="Medical History"
        >
          <TextArea 
            rows={4} 
            placeholder="Enter medical history and notes"
          />
        </Form.Item>

        {!isReadOnly && (
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {mode === "edit" ? "Update" : "Save"} Health Info
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
