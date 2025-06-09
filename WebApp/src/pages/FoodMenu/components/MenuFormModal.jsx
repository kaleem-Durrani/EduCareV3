import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  DatePicker,
  Space,
  Button,
  Typography,
  Divider,
  Input,
  Select,
  Tag,
} from "antd";
import dayjs from "dayjs";
import DayMenuEditor from "./DayMenuEditor";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function MenuFormModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  title,
  mode,
  initialData,
}) {
  const [form] = Form.useForm();
  const [menuData, setMenuData] = useState([
    { day: "Monday", items: [] },
    { day: "Tuesday", items: [] },
    { day: "Wednesday", items: [] },
    { day: "Thursday", items: [] },
    { day: "Friday", items: [] },
  ]);

  useEffect(() => {
    if (visible) {
      if ((mode === "edit" || mode === "view") && initialData) {
        // Set form values for edit/view mode
        form.setFieldsValue({
          title: initialData.title || "",
          description: initialData.description || "",
          status: initialData.status || "draft",
          dateRange: [dayjs(initialData.startDate), dayjs(initialData.endDate)],
        });

        // Filter out weekends and set menu data
        const filteredMenuData =
          initialData.menuData?.filter(
            (item) => item.day !== "Saturday" && item.day !== "Sunday"
          ) || [];
        setMenuData(
          filteredMenuData.length > 0
            ? filteredMenuData
            : [
                { day: "Monday", items: [] },
                { day: "Tuesday", items: [] },
                { day: "Wednesday", items: [] },
                { day: "Thursday", items: [] },
                { day: "Friday", items: [] },
              ]
        );
      } else {
        // Reset for create mode
        form.resetFields();
        setMenuData([
          { day: "Monday", items: [] },
          { day: "Tuesday", items: [] },
          { day: "Wednesday", items: [] },
          { day: "Thursday", items: [] },
          { day: "Friday", items: [] },
        ]);
      }
    }
  }, [visible, mode, initialData, form]);

  const handleSubmit = async (values) => {
    const [startDate, endDate] = values.dateRange;

    const formData = {
      title: values.title,
      description: values.description,
      status: values.status || "draft",
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      menuData: menuData,
    };

    await onSubmit(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    setMenuData([
      { day: "Monday", items: [] },
      { day: "Tuesday", items: [] },
      { day: "Wednesday", items: [] },
      { day: "Thursday", items: [] },
      { day: "Friday", items: [] },
    ]);
    onCancel();
  };

  const updateDayMenu = (day, items) => {
    setMenuData((prevData) =>
      prevData.map((dayMenu) =>
        dayMenu.day === day ? { ...dayMenu, items } : dayMenu
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
          name="title"
          label="Menu Title"
          rules={[{ required: true, message: "Please enter menu title!" }]}
        >
          <Input
            placeholder="Enter menu title (e.g., 'Week 1 - January 2024')"
            disabled={mode === "view"}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "14px",
              padding: "8px 12px",
              height: "45px",
            }}
          />
        </Form.Item>

        <Form.Item name="description" label="Description (Optional)">
          <TextArea
            placeholder="Enter menu description..."
            disabled={mode === "view"}
            rows={3}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
        </Form.Item>

        <Space style={{ width: "100%" }} size="large">
          <Form.Item
            name="dateRange"
            label="Menu Period"
            rules={[{ required: true, message: "Please select menu period!" }]}
            style={{ flex: 1 }}
          >
            <RangePicker
              disabled={mode === "view"}
              style={{
                width: "100%",
                border: "2px solid #d9d9d9",
                borderRadius: "6px",
                fontSize: "14px",
                padding: "8px 12px",
                height: "45px",
              }}
              format="YYYY-MM-DD"
              placeholder={["Start Date", "End Date"]}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
            style={{ minWidth: 150 }}
          >
            <Select
              disabled={mode === "view"}
              style={{
                border: "2px solid #d9d9d9",
                borderRadius: "6px",
                height: "45px",
              }}
              options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </Form.Item>
        </Space>

        <Divider>Daily Menu Items</Divider>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {menuData.map((dayMenu) => (
            <div key={dayMenu.day} style={{ marginBottom: 24 }}>
              <Title
                level={4}
                style={{
                  backgroundColor: "#f0f2f5",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                  marginBottom: "12px",
                  color: "#1890ff",
                }}
              >
                {dayMenu.day}
              </Title>
              <DayMenuEditor
                day={dayMenu.day}
                items={dayMenu.items}
                onItemsChange={(items) => updateDayMenu(dayMenu.day, items)}
                disabled={mode === "view"}
              />
            </div>
          ))}
        </div>

        {mode !== "view" && (
          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {mode === "edit" ? "Update Menu" : "Create Menu"}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        )}

        {mode === "view" && (
          <div style={{ marginTop: 24, textAlign: "right" }}>
            <Button onClick={handleCancel}>Close</Button>
          </div>
        )}
      </Form>
    </Modal>
  );
}
