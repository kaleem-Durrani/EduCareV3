import { Modal, Form, Input, Button, Space } from "antd";
import ImageUpload from "./ImageUpload";

const { TextArea } = Input;

export default function PlanModal({
  isVisible,
  editingPlan,
  form,
  selectedMonth,
  uploading,
  creating,
  updating,
  onSubmit,
  onCancel,
  onFileSelect,
  onFileChange,
  getMonthName
}) {
  return (
    <Modal
      title={editingPlan ? "Edit Monthly Plan" : "Create Monthly Plan"}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {/* 1. Month (Display only - text format) */}
        <Form.Item label="Month">
          <Input
            value={getMonthName(selectedMonth)}
            disabled
            style={{
              backgroundColor: "#f0f2f5",
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#1890ff",
            }}
          />
        </Form.Item>

        {/* 2. Image Upload */}
        <Form.Item
          name="image"
          label="Plan Image"
        >
          <ImageUpload
            editingPlan={editingPlan}
            uploading={uploading}
            onFileSelect={onFileSelect}
            onFileChange={onFileChange}
          />
        </Form.Item>

        {/* 3. Description/Text box */}
        <Form.Item
          name="description"
          label="Description (Yellow Box Content)"
          rules={[
            { required: true, message: "Please enter plan description!" },
            {
              max: 1000,
              message: "Description cannot exceed 1000 characters!",
            },
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Enter monthly plan description (will be shown in yellow box in parent view)"
            showCount
            maxLength={1000}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating || updating || uploading}
              style={{
                borderRadius: "6px",
                height: "40px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {uploading
                ? "Uploading..."
                : editingPlan
                ? "Update"
                : "Create"}{" "}
              Plan
            </Button>
            <Button
              onClick={onCancel}
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
    </Modal>
  );
}
