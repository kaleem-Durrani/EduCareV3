import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Space,
  Button,
  Typography,
  Divider,
  Input,
  Table,
  message,
} from "antd";
import {
  RestOutlined,
  UtensilsOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

export default function ReportFormModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  title,
  mode,
  students,
  initialData,
}) {
  const [form] = Form.useForm();
  const [dailyReports, setDailyReports] = useState([
    { day: "M", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "T", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "W", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "Th", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "F", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
  ]);

  const dayNames = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    Th: "Thursday",
    F: "Friday",
  };

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        // Set form values for edit mode
        form.setFieldsValue({
          student_id: initialData.student_id?._id || initialData.student_id,
          weekStart: dayjs(initialData.weekStart),
          weekEnd: dayjs(initialData.weekEnd),
        });
        
        // Set daily reports data
        setDailyReports(initialData.dailyReports || [
          { day: "M", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "T", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "W", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "Th", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "F", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
        ]);
      } else {
        // Reset for create mode
        form.resetFields();
        setDailyReports([
          { day: "M", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "T", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "W", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "Th", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
          { day: "F", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
        ]);
      }
    }
  }, [visible, mode, initialData, form]);

  const handleSubmit = async (values) => {
    // Validate that week dates are exactly 7 days apart
    const startDate = dayjs(values.weekStart);
    const endDate = dayjs(values.weekEnd);
    const daysDiff = endDate.diff(startDate, 'day');

    if (daysDiff !== 6) {
      message.error("Week must be exactly 7 days (Monday to Sunday)");
      return;
    }

    const formData = {
      student_id: values.student_id,
      weekStart: values.weekStart.format("YYYY-MM-DD"),
      weekEnd: values.weekEnd.format("YYYY-MM-DD"),
      dailyReports: dailyReports,
    };

    await onSubmit(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    setDailyReports([
      { day: "M", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "T", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "W", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Th", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "F", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    ]);
    onCancel();
  };

  const updateDailyReport = (day, field, value) => {
    setDailyReports(prevReports =>
      prevReports.map(report =>
        report.day === day ? { ...report, [field]: value } : report
      )
    );
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={900}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="student_id"
          label="Student"
          rules={[
            { required: true, message: "Please select a student!" },
          ]}
        >
          <Select
            placeholder="Choose a student"
            showSearch
            optionFilterProp="children"
          >
            {students?.map((student) => (
              <Option key={student._id} value={student._id}>
                {student.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Space style={{ width: "100%" }}>
          <Form.Item
            name="weekStart"
            label="Week Start (Monday)"
            rules={[
              { required: true, message: "Please select week start date!" },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Select Monday"
            />
          </Form.Item>

          <Form.Item
            name="weekEnd"
            label="Week End (Sunday)"
            rules={[
              { required: true, message: "Please select week end date!" },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Select Sunday"
            />
          </Form.Item>
        </Space>

        <Divider>Daily Reports</Divider>

        <div style={{ marginBottom: 24 }}>
          <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
            Fill in the daily reports for each weekday. You can use words or emojis.
          </Text>

          <Table
            dataSource={dailyReports}
            pagination={false}
            size="small"
            bordered
            rowKey="day"
            columns={[
              {
                title: "Day",
                dataIndex: "day",
                key: "day",
                width: 80,
                render: (day) => (
                  <Space direction="vertical" size={0}>
                    <Text strong>{dayNames[day]}</Text>
                    <Text type="secondary">{day}</Text>
                  </Space>
                ),
              },
              {
                title: (
                  <Space>
                    <RestOutlined />
                    <span>Toilet</span>
                  </Space>
                ),
                dataIndex: "toilet",
                key: "toilet",
                render: (value, record) => (
                  <Input
                    value={value}
                    onChange={(e) => updateDailyReport(record.day, "toilet", e.target.value)}
                    placeholder="e.g., Good, 😊, Normal"
                    size="small"
                  />
                ),
              },
              {
                title: (
                  <Space>
                    <UtensilsOutlined />
                    <span>Food Intake</span>
                  </Space>
                ),
                dataIndex: "food_intake",
                key: "food_intake",
                render: (value, record) => (
                  <Input
                    value={value}
                    onChange={(e) => updateDailyReport(record.day, "food_intake", e.target.value)}
                    placeholder="e.g., Ate well, 🍎, Picky"
                    size="small"
                  />
                ),
              },
              {
                title: (
                  <Space>
                    <TeamOutlined />
                    <span>Friends Interaction</span>
                  </Space>
                ),
                dataIndex: "friends_interaction",
                key: "friends_interaction",
                render: (value, record) => (
                  <Input
                    value={value}
                    onChange={(e) => updateDailyReport(record.day, "friends_interaction", e.target.value)}
                    placeholder="e.g., Played well, 🤝, Shy"
                    size="small"
                  />
                ),
              },
              {
                title: (
                  <Space>
                    <BookOutlined />
                    <span>Studies Mood</span>
                  </Space>
                ),
                dataIndex: "studies_mood",
                key: "studies_mood",
                render: (value, record) => (
                  <Input
                    value={value}
                    onChange={(e) => updateDailyReport(record.day, "studies_mood", e.target.value)}
                    placeholder="e.g., Focused, 📚, Distracted"
                    size="small"
                  />
                ),
              },
            ]}
          />
        </div>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {mode === "edit" ? "Update Report" : "Create Report"}
            </Button>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
