import { Modal, Form, Input, Upload, Button, Space, Avatar } from "antd";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function ParentFormModal({
  visible,
  editingParent,
  form,
  onSubmit,
  onCancel,
  creating,
  updating,
}) {
  const isEditing = !!editingParent;
  const loading = creating || updating;

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={isEditing ? "Edit Parent" : "Add Parent"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Photo Upload */}
        <Form.Item label="Photo">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {isEditing && editingParent?.photoUrl && (
              <Avatar
                size={80}
                src={`${SERVER_URL}/${editingParent.photoUrl}`}
                icon={<UserOutlined />}
                style={{ border: "1px solid #d9d9d9" }}
              />
            )}
            <Form.Item name="photo" style={{ margin: 0, flex: 1 }}>
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={() => false}
                accept="image/*"
                style={{ padding: "20px" }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag photo to upload</p>
                <p className="ant-upload-hint">
                  Support for single image upload (JPG, PNG, GIF)
                </p>
              </Dragger>
            </Form.Item>
          </div>
        </Form.Item>

        {/* Name */}
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: "Please enter parent's full name!" },
            { min: 2, message: "Name must be at least 2 characters!" },
          ]}
        >
          <Input placeholder="Enter parent's full name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter phone number!" },
            { min: 10, message: "Phone number must be at least 10 digits!" },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        {/* Address */}
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter address!" }]}
        >
          <TextArea rows={3} placeholder="Enter full address" />
        </Form.Item>

        {/* Password - only for new parents */}
        {!isEditing && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

        {/* Password - optional for editing */}
        {isEditing && (
          <Form.Item
            name="password"
            label="New Password (optional)"
            rules={[
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter new password (leave blank to keep current)" />
          </Form.Item>
        )}

        {/* Form Actions */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Update" : "Create"} Parent
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
