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
import { Home, Apple, Users, BookOpen, Toilet } from "lucide-react";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    { day: "Sun", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "Mon", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "Tue", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "Wed", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "Thu", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "Fri", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    { day: "Sat", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
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
          weekRange: [dayjs(initialData.weekStart), dayjs(initialData.weekEnd)],
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
    // Extract dates from range picker
    const [startDate, endDate] = values.weekRange;
    const daysDiff = endDate.diff(startDate, 'day');

    if (daysDiff !== 6) {
      message.error("Week must be exactly 7 days (Sunday to Saturday)");
      return;
    }

    if (startDate.day() !== 0) {
      message.error("Week must start on Sunday");
      return;
    }

    if (endDate.day() !== 6) {
      message.error("Week must end on Saturday");
      return;
    }

    const formData = {
      student_id: values.student_id,
      weekStart: startDate.format("YYYY-MM-DD"),
      weekEnd: endDate.format("YYYY-MM-DD"),
      dailyReports: dailyReports,
    };

    await onSubmit(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    setDailyReports([
      { day: "Sun", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Mon", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Tue", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Wed", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Thu", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Fri", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Sat", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
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

        <Form.Item
          name="weekRange"
          label="Week Period (Sunday to Saturday)"
          rules={[
            { required: true, message: "Please select week period!" },
          ]}
        >
          <RangePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder={["Select Sunday", "Select Saturday"]}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const [start, end] = dates;
                // Validate that it's exactly 7 days and starts on Sunday
                const daysDiff = end.diff(start, 'day');
                if (daysDiff !== 6) {
                  message.error("Week must be exactly 7 days");
                  return;
                }
                if (start.day() !== 0) {
                  message.error("Week must start on Sunday");
                  return;
                }
                if (end.day() !== 6) {
                  message.error("Week must end on Saturday");
                  return;
                }
              }
            }}
          />
        </Form.Item>

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
                    <Toilet size={18} />
                    <span>Toilet</span>
                  </Space>
                ),
                dataIndex: "toilet",
                key: "toilet",
                render: (value, record) => (
                  <Input
                    value={value}
                    onChange={(e) => updateDailyReport(record.day, "toilet", e.target.value)}
                    placeholder="e.g., Pee 💧, Poop 💩, Both"
                    size="small"
                  />
                ),
              },
              {
                title: (
                  <Space>
                    <Apple size={18} />
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
                    <Users size={18} />
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
                    <BookOpen size={18} />
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
