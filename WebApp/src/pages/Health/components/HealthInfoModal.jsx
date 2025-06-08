import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  InputNumber,
  Card,
  Typography,
  Divider,
} from "antd";
import {
  HeartOutlined,
  EyeOutlined,
  SoundOutlined,
  MedicineBoxOutlined,
  AlertOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

// Beautiful card-based view component for displaying health info
const HealthInfoView = ({ data }) => {
  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      "A+": "#f56565",
      "A-": "#fc8181",
      "B+": "#4299e1",
      "B-": "#63b3ed",
      "AB+": "#9f7aea",
      "AB-": "#b794f6",
      "O+": "#48bb78",
      "O-": "#68d391",
    };
    return colors[bloodGroup] || "#718096";
  };

  const InfoCard = ({ icon, title, value, color = "#1890ff" }) => (
    <Card
      size="small"
      style={{
        height: "100%",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #f0f0f0",
      }}
    >
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div
          style={{
            fontSize: "24px",
            color: color,
            marginBottom: "8px",
          }}
        >
          {icon}
        </div>
        <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
          {title}
        </Text>
        <Text
          strong
          style={{
            fontSize: "16px",
            color: "#262626",
            display: "block",
            marginTop: "4px",
          }}
        >
          {value || "Not specified"}
        </Text>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: "8px 0" }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <InfoCard
            icon={<MedicineBoxOutlined />}
            title="Blood Group"
            value={data?.blood_group}
            color={getBloodGroupColor(data?.blood_group)}
          />
        </Col>
        <Col span={8}>
          <InfoCard
            icon={<HeartOutlined />}
            title="Heart Rate"
            value={data?.heart_rate ? `${data.heart_rate} BPM` : "Not measured"}
            color="#ff4d4f"
          />
        </Col>
        <Col span={8}>
          <InfoCard
            icon={<EyeOutlined />}
            title="Eye Condition"
            value={data?.eye_condition}
            color="#52c41a"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col span={12}>
          <InfoCard
            icon={<SoundOutlined />}
            title="Ear Condition"
            value={data?.ear_condition}
            color="#722ed1"
          />
        </Col>
        <Col span={12}>
          <Card
            size="small"
            style={{
              height: "100%",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "1px solid #f0f0f0",
            }}
          >
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div
                style={{
                  fontSize: "24px",
                  color: "#fa8c16",
                  marginBottom: "8px",
                }}
              >
                <AlertOutlined />
              </div>
              <Text
                type="secondary"
                style={{ fontSize: "12px", display: "block" }}
              >
                Allergies
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#262626",
                  display: "block",
                  marginTop: "4px",
                  textAlign: "left",
                  padding: "0 8px",
                }}
              >
                {data?.allergy || "No known allergies"}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default function HealthInfoModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedStudent,
  mode = "view", // "view", "edit", "create"
  initialData = null,
  form, // Accept form as prop to avoid the warning
  onEdit, // Function to switch to edit mode
}) {
  // Use provided form or create new one as fallback
  const [internalForm] = Form.useForm();
  const formInstance = form || internalForm;

  useEffect(() => {
    if (visible) {
      if ((mode === "edit" || mode === "view") && initialData) {
        // Map backend field names to frontend field names
        const mappedData = {
          bloodGroup: initialData.blood_group,
          allergies: initialData.allergy,
          eyeCondition: initialData.eye_condition,
          heartRate: initialData.heart_rate,
          earCondition: initialData.ear_condition,
        };
        formInstance.setFieldsValue(mappedData);
      } else if (mode === "create") {
        formInstance.resetFields();
      }
    }
  }, [visible, mode, initialData, formInstance]);

  const handleSubmit = async (values) => {
    // Map frontend field names to backend field names
    const mappedValues = {
      blood_group: values.bloodGroup,
      allergy: values.allergies,
      eye_condition: values.eyeCondition,
      heart_rate: values.heartRate,
      ear_condition: values.earCondition,
    };
    await onSubmit(mappedValues);
  };

  const handleCancel = () => {
    formInstance.resetFields();
    onCancel();
  };

  const isReadOnly = mode === "view";
  const title =
    mode === "view"
      ? `Health Information - ${selectedStudent?.fullName}`
      : mode === "edit"
      ? `Edit Health Information - ${selectedStudent?.fullName}`
      : `Add Health Information - ${selectedStudent?.fullName}`;

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={
        isReadOnly
          ? [
              <Button
                key="edit"
                type="primary"
                icon={<EditOutlined />}
                onClick={onEdit}
              >
                Edit Health Info
              </Button>,
              <Button key="close" onClick={handleCancel}>
                Close
              </Button>,
            ]
          : null
      }
      width={800}
      destroyOnClose
    >
      {isReadOnly ? (
        // Beautiful card view for read-only mode
        <HealthInfoView data={initialData} />
      ) : (
        // Form for edit/create modes
        <Form
          form={formInstance}
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
              <Form.Item name="heartRate" label="Heart Rate (BPM)">
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
              <Form.Item name="eyeCondition" label="Eye Condition">
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
              <Form.Item name="earCondition" label="Ear Condition">
                <Select placeholder="Select ear condition" allowClear>
                  <Option value="Normal">Normal</Option>
                  <Option value="Hearing Loss">Hearing Loss</Option>
                  <Option value="Ear Infection">Ear Infection</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="allergies" label="Allergies">
            <TextArea
              rows={3}
              placeholder="List any allergies (separate with commas)"
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
      )}
    </Modal>
  );
}
