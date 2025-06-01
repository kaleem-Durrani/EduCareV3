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
  message
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
    form.setFieldsValue({
      ...metric,
      date: dayjs(metric.date),
    });
  };

  const handleSubmitMetric = async (values) => {
    try {
      const formData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (editingMetric) {
        await onUpdate(editingMetric._id, formData);
        message.success("Metric updated successfully!");
      } else {
        await onSubmit(formData);
        message.success("Metric added successfully!");
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
      title: "Height (cm)",
      dataIndex: "height",
      key: "height",
      render: (height) => height ? `${height} cm` : "-",
    },
    {
      title: "Weight (kg)",
      dataIndex: "weight",
      key: "weight",
      render: (weight) => weight ? `${weight} kg` : "-",
    },
    {
      title: "BMI",
      key: "bmi",
      render: (_, record) => {
        if (record.height && record.weight) {
          const heightInM = record.height / 100;
          const bmi = (record.weight / (heightInM * heightInM)).toFixed(1);
          return bmi;
        }
        return "-";
      },
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
  const latestMetric = metrics.length > 0 
    ? metrics.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())[0]
    : null;

  return (
    <Modal
      title={`Health Metrics - ${selectedStudent?.fullName}`}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>
      ]}
      width={1000}
      destroyOnClose
    >
      {/* Stats Cards */}
      {latestMetric && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Latest Height"
                value={latestMetric.height}
                suffix="cm"
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Latest Weight"
                value={latestMetric.weight}
                suffix="kg"
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Latest BMI"
                value={
                  latestMetric.height && latestMetric.weight
                    ? ((latestMetric.weight / Math.pow(latestMetric.height / 100, 2)).toFixed(1))
                    : 0
                }
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
              <Col span={8}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Please select date!" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="height"
                  label="Height (cm)"
                  rules={[{ required: true, message: "Please enter height!" }]}
                >
                  <InputNumber
                    min={50}
                    max={250}
                    placeholder="Enter height"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="weight"
                  label="Weight (kg)"
                  rules={[{ required: true, message: "Please enter weight!" }]}
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
            </Row>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingMetric ? "Update" : "Add"} Metric
                </Button>
                <Button onClick={() => {
                  setIsAddingMetric(false);
                  setEditingMetric(null);
                  form.resetFields();
                }}>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMetric}>
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
          emptyText: "No health metrics recorded yet"
        }}
      />
    </Modal>
  );
}
