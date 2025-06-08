import { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Space, message } from "antd";
import { useStudentsContext } from "../../../context/StudentsContext";
import { useParentsContext } from "../../../context/ParentsContext";

const { Option } = Select;

export default function AddRelationModal({
  visible,
  selectedParent,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form] = Form.useForm();
  const { students, refreshStudents } = useStudentsContext();
  const { parents, refreshParents } = useParentsContext();

  useEffect(() => {
    if (visible) {
      // Fetch fresh data when modal opens
      refreshStudents();
      if (!selectedParent) {
        refreshParents();
      }
    }
  }, [visible]);

  useEffect(() => {
    if (selectedParent) {
      form.setFieldsValue({
        parent_id: selectedParent._id,
      });
    } else {
      form.resetFields();
    }
  }, [selectedParent, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add Parent-Student Relationship"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Parent Selection */}
        <Form.Item
          name="parent_id"
          label="Parent"
          rules={[{ required: true, message: "Please select a parent!" }]}
        >
          <Select
            placeholder="Select parent"
            showSearch
            optionFilterProp="children"
            disabled={!!selectedParent}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {selectedParent ? (
              <Option value={selectedParent._id}>
                {selectedParent.name} ({selectedParent.email})
              </Option>
            ) : (
              parents.map((parent) => (
                <Option key={parent.value} value={parent.value}>
                  {parent.label}
                </Option>
              ))
            )}
          </Select>
        </Form.Item>

        {/* Student Selection */}
        <Form.Item
          name="student_id"
          label="Student"
          rules={[{ required: true, message: "Please select a student!" }]}
        >
          <Select
            placeholder="Select student"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {students.map((student) => (
              <Option key={student.value} value={student.value}>
                {student.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Relationship Type */}
        <Form.Item
          name="relationshipType"
          label="Relationship Type"
          rules={[
            { required: true, message: "Please select relationship type!" },
          ]}
          initialValue="parent"
        >
          <Select placeholder="Select relationship type">
            <Option value="parent">Parent</Option>
            <Option value="guardian">Guardian</Option>
            <Option value="father">Father</Option>
            <Option value="mother">Mother</Option>
            <Option value="stepfather">Step Father</Option>
            <Option value="stepmother">Step Mother</Option>
            <Option value="grandfather">Grandfather</Option>
            <Option value="grandmother">Grandmother</Option>
            <Option value="uncle">Uncle</Option>
            <Option value="aunt">Aunt</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        {/* Form Actions */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Relationship
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
