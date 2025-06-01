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
} from "antd";
import dayjs from "dayjs";
import DailyReportEditor from "./DailyReportEditor";

const { Title } = Typography;
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
    { day: "Monday", pee: "", poop: "", food: "", mood: "" },
    { day: "Tuesday", pee: "", poop: "", food: "", mood: "" },
    { day: "Wednesday", pee: "", poop: "", food: "", mood: "" },
    { day: "Thursday", pee: "", poop: "", food: "", mood: "" },
    { day: "Friday", pee: "", poop: "", food: "", mood: "" },
    { day: "Saturday", pee: "", poop: "", food: "", mood: "" },
    { day: "Sunday", pee: "", poop: "", food: "", mood: "" },
  ]);

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        // Set form values for edit mode
        form.setFieldsValue({
          student_id: initialData.student_id,
          dateRange: [
            dayjs(initialData.weekStart),
            dayjs(initialData.weekEnd),
          ],
        });
        
        // Set daily reports data
        setDailyReports(initialData.dailyReports || []);
      } else {
        // Reset for create mode
        form.resetFields();
        setDailyReports([
          { day: "Monday", pee: "", poop: "", food: "", mood: "" },
          { day: "Tuesday", pee: "", poop: "", food: "", mood: "" },
          { day: "Wednesday", pee: "", poop: "", food: "", mood: "" },
          { day: "Thursday", pee: "", poop: "", food: "", mood: "" },
          { day: "Friday", pee: "", poop: "", food: "", mood: "" },
          { day: "Saturday", pee: "", poop: "", food: "", mood: "" },
          { day: "Sunday", pee: "", poop: "", food: "", mood: "" },
        ]);
      }
    }
  }, [visible, mode, initialData, form]);

  const handleSubmit = async (values) => {
    const [weekStart, weekEnd] = values.dateRange;
    
    const formData = {
      student_id: values.student_id,
      weekStart: weekStart.format("YYYY-MM-DD"),
      weekEnd: weekEnd.format("YYYY-MM-DD"),
      dailyReports: dailyReports,
    };

    await onSubmit(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    setDailyReports([
      { day: "Monday", pee: "", poop: "", food: "", mood: "" },
      { day: "Tuesday", pee: "", poop: "", food: "", mood: "" },
      { day: "Wednesday", pee: "", poop: "", food: "", mood: "" },
      { day: "Thursday", pee: "", poop: "", food: "", mood: "" },
      { day: "Friday", pee: "", poop: "", food: "", mood: "" },
      { day: "Saturday", pee: "", poop: "", food: "", mood: "" },
      { day: "Sunday", pee: "", poop: "", food: "", mood: "" },
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
          name="dateRange"
          label="Week Period"
          rules={[
            { required: true, message: "Please select week period!" },
          ]}
        >
          <RangePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder={["Week Start", "Week End"]}
          />
        </Form.Item>

        <Divider>Daily Reports</Divider>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {dailyReports.map((dayReport) => (
            <div key={dayReport.day} style={{ marginBottom: 24 }}>
              <Title level={4}>{dayReport.day}</Title>
              <DailyReportEditor
                day={dayReport.day}
                report={dayReport}
                onReportChange={updateDailyReport}
              />
            </div>
          ))}
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
