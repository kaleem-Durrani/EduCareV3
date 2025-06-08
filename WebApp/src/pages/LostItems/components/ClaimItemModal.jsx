import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";

export default function ClaimItemModal({
  visible,
  claimingItem,
  form,
  onSubmit,
  onCancel,
  claiming,
}) {
  return (
    <Modal
      title="Claim Lost Item"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="parentEmail"
          label="Parent Email"
          rules={[
            { required: true, message: "Please enter parent email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter parent email address" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={claiming}>
              Claim Item
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
