import React, { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Button,
  Space,
  Form,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Card,
  Statistic,
  message,
  Input,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function HealthMetricsModal({
  visible,
  onCancel,
  onSubmit,
  onUpdate,
  onDelete,
  loading,
  selectedStudent,
  metrics = [],
}) {
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      setIsAddingMetric(false);
      setEditingMetric(null);
      form.resetFields();
    }
  }, [visible, form]);

  const handleAddMetric = () => {
    setIsAddingMetric(true);
    setEditingMetric(null);
    form.resetFields();
  };

  const handleEditMetric = (metric) => {
    setEditingMetric(metric);
    setIsAddingMetric(false);

    // Set form values based on metric type
    const formValues = {
      date: dayjs(metric.date),
      notes: metric.notes || "",
    };

    // Set the appropriate field based on metric type
    if (metric.type === "height") {
      formValues.height = metric.value;
    } else {
      formValues.weight = metric.value;
    }

    form.setFieldsValue(formValues);
  };

  const handleSubmitMetric = async (values) => {
    try {
      const dateString = values.date.format("YYYY-MM-DD");

      if (editingMetric) {
        // For editing, we need to update the specific metric
        const formData = {
          type: editingMetric.type,
          value:
            editingMetric.type === "height" ? values.height : values.weight,
          date: dateString,
          notes: values.notes || "",
        };
        await onUpdate(editingMetric._id, formData);
        message.success("Metric updated successfully!");
      } else {
        // For creating, we need to create separate records for height and weight
        const promises = [];

        if (values.height) {
          promises.push(
            onSubmit({
              type: "height",
              value: values.height,
              date: dateString,
              notes: values.notes || "",
            })
          );
        }

        if (values.weight) {
          promises.push(
            onSubmit({
              type: "weight",
              value: values.weight,
              date: dateString,
              notes: values.notes || "",
            })
          );
        }

        await Promise.all(promises);
        message.success("Metrics added successfully!");
      }

      setIsAddingMetric(false);
      setEditingMetric(null);
      form.resetFields();
    } catch (error) {
      console.log("Metric operation error handled by useApi");
    }
  };

  const handleDeleteMetric = async (metricId) => {
    try {
      await onDelete(metricId);
      message.success("Metric deleted successfully!");
    } catch (error) {
      console.log("Delete metric error handled by useApi");
    }
  };

  const handleCancel = () => {
    setIsAddingMetric(false);
    setEditingMetric(null);
    form.resetFields();
    onCancel();
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => type.charAt(0).toUpperCase() + type.slice(1),
      filters: [
        { text: "Height", value: "height" },
        { text: "Weight", value: "weight" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value, record) => {
        const unit = record.type === "height" ? "cm" : "kg";
        return `${value} ${unit}`;
      },
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes) => notes || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEditMetric(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMetric(record._id)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Calculate latest metrics for stats
  const latestHeight = metrics
    .filter((m) => m.type === "height")
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())[0];

  const latestWeight = metrics
    .filter((m) => m.type === "weight")
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())[0];

  const latestBMI =
    latestHeight && latestWeight
      ? (latestWeight.value / Math.pow(latestHeight.value / 100, 2)).toFixed(1)
      : null;

  return (
    <Modal
      title={`Health Metrics - ${selectedStudent?.fullName}`}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>,
      ]}
      width={1000}
      destroyOnClose
    >
      {/* Stats Cards */}
      {(latestHeight || latestWeight) && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Latest Height"
                value={latestHeight?.value || "-"}
                suffix={latestHeight ? "cm" : ""}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Latest Weight"
                value={latestWeight?.value || "-"}
                suffix={latestWeight ? "kg" : ""}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Latest BMI"
                value={latestBMI || "-"}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Records"
                value={metrics.length}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Add/Edit Form */}
      {(isAddingMetric || editingMetric) && (
        <Card style={{ marginBottom: 16 }}>
          <Form form={form} layout="vertical" onFinish={handleSubmitMetric}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Please select date!" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              {!editingMetric && (
                <>
                  <Col span={6}>
                    <Form.Item
                      name="height"
                      label="Height (cm)"
                      rules={[
                        { required: false, message: "Please enter height!" },
                      ]}
                    >
                      <InputNumber
                        min={50}
                        max={250}
                        placeholder="Enter height"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="weight"
                      label="Weight (kg)"
                      rules={[
                        { required: false, message: "Please enter weight!" },
                      ]}
                    >
                      <InputNumber
                        min={10}
                        max={200}
                        step={0.1}
                        placeholder="Enter weight"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              {editingMetric && (
                <Col span={6}>
                  <Form.Item
                    name={editingMetric.type === "height" ? "height" : "weight"}
                    label={
                      editingMetric.type === "height"
                        ? "Height (cm)"
                        : "Weight (kg)"
                    }
                    rules={[
                      {
                        required: true,
                        message: `Please enter ${editingMetric.type}!`,
                      },
                    ]}
                  >
                    <InputNumber
                      min={editingMetric.type === "height" ? 50 : 10}
                      max={editingMetric.type === "height" ? 250 : 200}
                      step={editingMetric.type === "weight" ? 0.1 : 1}
                      placeholder={`Enter ${editingMetric.type}`}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={6}>
                <Form.Item name="notes" label="Notes">
                  <Input.TextArea
                    rows={2}
                    placeholder="Optional notes"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingMetric ? "Update" : "Add"} Metric
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingMetric(false);
                    setEditingMetric(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Add Button */}
      {!isAddingMetric && !editingMetric && (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMetric}
          >
            Add New Metric
          </Button>
        </div>
      )}

      {/* Metrics Table */}
      <Table
        columns={columns}
        dataSource={metrics}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: "No health metrics recorded yet",
        }}
      />
    </Modal>
  );
}
