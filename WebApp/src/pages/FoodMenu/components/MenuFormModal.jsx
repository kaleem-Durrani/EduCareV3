import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  DatePicker,
  Space,
  Button,
  Typography,
  Divider,
} from "antd";
import dayjs from "dayjs";
import DayMenuEditor from "./DayMenuEditor";

const { Title } = Typography;
const { RangePicker } = DatePicker;

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
      if (mode === "edit" && initialData) {
        // Set form values for edit mode
        form.setFieldsValue({
          dateRange: [
            dayjs(initialData.startDate),
            dayjs(initialData.endDate),
          ],
        });
        
        // Filter out weekends and set menu data
        const filteredMenuData = initialData.menuData?.filter(
          (item) => item.day !== "Saturday" && item.day !== "Sunday"
        ) || [];
        setMenuData(filteredMenuData);
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
    setMenuData(prevData =>
      prevData.map(dayMenu =>
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
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="dateRange"
          label="Menu Period"
          rules={[
            { required: true, message: "Please select menu period!" },
          ]}
        >
          <RangePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder={["Start Date", "End Date"]}
          />
        </Form.Item>

        <Divider>Daily Menu Items</Divider>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {menuData.map((dayMenu) => (
            <div key={dayMenu.day} style={{ marginBottom: 24 }}>
              <Title level={4}>{dayMenu.day}</Title>
              <DayMenuEditor
                day={dayMenu.day}
                items={dayMenu.items}
                onItemsChange={(items) => updateDayMenu(dayMenu.day, items)}
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
              {mode === "edit" ? "Update Menu" : "Create Menu"}
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
