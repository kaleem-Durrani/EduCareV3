import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useStudentsContext } from "../../../context/StudentsContext";

const { TextArea } = Input;

export default function FeeModal({
  visible,
  onCancel,
  onSubmit,
  form,
  loading,
  editingFee,
}) {
  const { students } = useStudentsContext();
  const isEditing = !!editingFee;

  return (
    <Modal
      title={isEditing ? "Edit Fee" : "Add New Fee"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="student_id"
          label="Student"
          rules={[{ required: true, message: "Please select a student!" }]}
        >
          <Select
            placeholder="Choose a student"
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            size="large"
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
            options={students}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Fee Title"
          rules={[
            { required: true, message: "Please enter fee title!" },
            { max: 100, message: "Title cannot exceed 100 characters!" },
          ]}
        >
          <Input
            placeholder="Enter fee title (e.g., Tuition Fee, Activity Fee)"
            size="large"
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: "Please enter amount!" },
            { type: "number", min: 0, message: "Amount must be positive!" },
          ]}
        >
          <InputNumber
            style={{
              width: "100%",
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
            placeholder="Enter fee amount"
            min={0}
            precision={2}
            size="large"
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
          />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Payment Deadline"
          rules={[{ required: true, message: "Please select deadline!" }]}
        >
          <DatePicker
            style={{
              width: "100%",
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
            }}
            size="large"
            placeholder="Select payment deadline"
            format="YYYY-MM-DD"
            prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description (Optional)"
          rules={[
            { max: 500, message: "Description cannot exceed 500 characters!" },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Enter additional details about this fee"
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
              {isEditing ? "Update Fee" : "Create Fee"}
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

      <style>{`
        .ant-input:hover,
        .ant-input-number:hover,
        .ant-picker:hover,
        .ant-select:hover .ant-select-selector {
          border-color: #40a9ff !important;
          box-shadow: 0 4px 8px rgba(64, 169, 255, 0.2) !important;
        }

        .ant-input:focus,
        .ant-input-focused,
        .ant-input-number:focus,
        .ant-input-number-focused,
        .ant-picker:focus,
        .ant-picker-focused,
        .ant-select:focus .ant-select-selector,
        .ant-select-focused .ant-select-selector {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </Modal>
  );
}
