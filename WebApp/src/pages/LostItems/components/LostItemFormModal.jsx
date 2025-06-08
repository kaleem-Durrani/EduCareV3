import React from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Space,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function LostItemFormModal({
  visible,
  editingItem,
  form,
  onSubmit,
  onCancel,
  creating,
  updating,
}) {
  return (
    <Modal
      title={editingItem ? "Edit Lost Item" : "Add Lost Item"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter item title!" }]}
        >
          <Input placeholder="Enter item title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description!" }]}
        >
          <TextArea rows={3} placeholder="Enter item description" />
        </Form.Item>

        <Form.Item
          name="dateFound"
          label="Date Found"
          rules={[{ required: true, message: "Please select date found!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="image" label="Image">
          <Dragger
            name="file"
            multiple={false}
            beforeUpload={() => false}
            accept="image/*"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to upload</p>
            <p className="ant-upload-hint">Support for single image upload</p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating || updating}
            >
              {editingItem ? "Update" : "Create"} Item
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
