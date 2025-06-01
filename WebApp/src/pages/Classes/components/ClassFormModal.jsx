import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Select,
  DatePicker,
} from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export default function ClassFormModal({
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
        // Parse academic year if it exists (format: YYYY-YYYY)
        let startYear = null;
        let endYear = null;

        if (
          initialData.academic_year &&
          initialData.academic_year.includes("-")
        ) {
          const [start, end] = initialData.academic_year.split("-");
          startYear = dayjs().year(parseInt(start));
          endYear = dayjs().year(parseInt(end));
        }

        form.setFieldsValue({
          name: initialData.name,
          description: initialData.description || "",
          grade: initialData.grade,
          section: initialData.section,
          startYear: startYear,
          endYear: endYear,
        });
      } else {
        form.resetFields();
        // Set default values for new class
        const currentYear = dayjs();
        form.setFieldsValue({
          grade: "N/A",
          section: "N/A",
          startYear: currentYear,
          endYear: currentYear.add(1, "year"),
        });
      }
    }
  }, [visible, mode, initialData, form]);

  const handleSubmit = async (values) => {
    // Format academic year from the DatePickers
    const formattedValues = {
      ...values,
      academic_year:
        values.startYear && values.endYear
          ? `${values.startYear.year()}-${values.endYear.year()}`
          : null,
    };

    // Remove the DatePicker fields from the final data
    delete formattedValues.startYear;
    delete formattedValues.endYear;

    await onSubmit(formattedValues);
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
          <Col span={24}>
            <Form.Item
              name="name"
              label="Class Name"
              rules={[
                { required: true, message: "Please enter class name!" },
                {
                  min: 2,
                  message: "Class name must be at least 2 characters!",
                },
              ]}
            >
              <Input placeholder="Enter class name (e.g., Mathematics 101)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="grade"
              label="Grade"
              rules={[{ required: true, message: "Please select grade!" }]}
            >
              <Select placeholder="Select grade">
                <Option value="Pre-K">Pre-K</Option>
                <Option value="K">Kindergarten</Option>
                <Option value="1">Grade 1</Option>
                <Option value="2">Grade 2</Option>
                <Option value="3">Grade 3</Option>
                <Option value="4">Grade 4</Option>
                <Option value="5">Grade 5</Option>
                <Option value="6">Grade 6</Option>
                <Option value="7">Grade 7</Option>
                <Option value="8">Grade 8</Option>
                <Option value="9">Grade 9</Option>
                <Option value="10">Grade 10</Option>
                <Option value="11">Grade 11</Option>
                <Option value="12">Grade 12</Option>
                <Option value="N/A">Not Applicable</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="section"
              label="Section"
              rules={[{ required: true, message: "Please enter section!" }]}
            >
              <Input placeholder="e.g., A, B, C" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Academic Year" required>
              <Space.Compact style={{ width: "100%" }}>
                <Form.Item
                  name="startYear"
                  style={{ width: "45%", marginBottom: 0 }}
                  rules={[
                    { required: true, message: "Please select start year!" },
                  ]}
                >
                  <DatePicker
                    picker="year"
                    placeholder="Start Year"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Input
                  style={{
                    width: "10%",
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                  }}
                  placeholder="-"
                  disabled
                  value="-"
                />
                <Form.Item
                  name="endYear"
                  style={{ width: "45%", marginBottom: 0 }}
                  rules={[
                    { required: true, message: "Please select end year!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startYear = getFieldValue("startYear");
                        if (!value || !startYear) {
                          return Promise.resolve();
                        }
                        if (value.year() <= startYear.year()) {
                          return Promise.reject(
                            new Error("End year must be after start year!")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    picker="year"
                    placeholder="End Year"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Enter class description (optional)" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === "edit" ? "Update" : "Create"} Class
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
