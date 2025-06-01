import React, { useEffect } from "react";
import { Modal, Form, Select, Button, Space, Alert } from "antd";

const { Option } = Select;

export default function WithdrawTeacherModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedTeacher,
  classes,
}) {
  const [form] = Form.useForm();

  // Get classes where this teacher is enrolled
  const teacherClasses = classes.filter(
    (cls) =>
      cls.teachers &&
      cls.teachers.some(
        (teacher) =>
          teacher._id === selectedTeacher?._id ||
          teacher === selectedTeacher?._id
      )
  );

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
      {teacherClasses.length === 0 ? (
        <Alert
          message="No Classes Found"
          description={`${
            selectedTeacher?.name || "This teacher"
          } is not enrolled in any classes.`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Alert
            message="Select Class to Withdraw From"
            description={`Choose which class to withdraw ${
              selectedTeacher?.name || "this teacher"
            } from.`}
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
              optionLabelProp="label"
              dropdownStyle={{ maxHeight: 400 }}
            >
              {teacherClasses.map((cls) => (
                <Option
                  key={cls._id}
                  value={cls._id}
                  label={cls.name}
                  style={{
                    height: "auto",
                    minHeight: "60px",
                    padding: "8px 12px",
                  }}
                >
                  <div style={{ lineHeight: "1.4" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      {cls.name}
                    </div>
                    <div style={{ color: "#666", fontSize: "12px" }}>
                      {cls.grade} {cls.section} • {cls.academic_year}
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={loading}
                disabled={teacherClasses.length === 0}
              >
                Withdraw Teacher
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {teacherClasses.length === 0 && (
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button onClick={handleCancel}>Close</Button>
        </div>
      )}
    </Modal>
  );
}
