import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Tag,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { feeService, studentService } from "../../services/index";
import AdminLayout from "../../components/Layout/AdminLayout";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function FeesScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [form] = Form.useForm();
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Fetch students data
  const {
    data: studentsData,
    request: fetchStudents,
  } = useApi(studentService.getAllStudents);

  // Fetch fees data
  const {
    data: feesData,
    isLoading: loading,
    request: fetchFees,
  } = useApi((studentId) => feeService.getStudentFees(studentId));

  // Create fee API
  const { request: createFeeRequest, isLoading: creating } = useApi(
    feeService.createFee
  );

  // Update fee status API
  const { request: updateFeeStatusRequest, isLoading: updating } = useApi(
    ({ id, status }) => feeService.updateFeeStatus(id, status)
  );

  // Delete fee API
  const { request: deleteFeeRequest, isLoading: deleting } = useApi(
    feeService.deleteFee
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchFees(selectedStudentId);
    }
  }, [selectedStudentId]);

  const handleCreateFee = async (values) => {
    try {
      const feeData = {
        ...values,
        deadline: values.deadline.format("YYYY-MM-DD"),
        student_id: values.student_id,
        status: "Unpaid",
      };
      await createFeeRequest(feeData);
      message.success("Fee created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      if (selectedStudentId) {
        fetchFees(selectedStudentId);
      }
    } catch (error) {
      message.error("Failed to create fee");
    }
  };

  const handleUpdateFeeStatus = async (feeId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
      await updateFeeStatusRequest({ id: feeId, status: newStatus });
      message.success(`Fee marked as ${newStatus.toLowerCase()}!`);
      if (selectedStudentId) {
        fetchFees(selectedStudentId);
      }
    } catch (error) {
      message.error("Failed to update fee status");
    }
  };

  const handleDeleteFee = async (feeId) => {
    try {
      await deleteFeeRequest(feeId);
      message.success("Fee deleted successfully!");
      if (selectedStudentId) {
        fetchFees(selectedStudentId);
      }
    } catch (error) {
      message.error("Failed to delete fee");
    }
  };

  const handleAdd = () => {
    setEditingFee(null);
    form.resetFields();
    if (selectedStudentId) {
      form.setFieldsValue({ student_id: selectedStudentId });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingFee(null);
    form.resetFields();
  };

  const handleStudentChange = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Space>
          <DollarOutlined />
          {amount}
        </Space>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "orange"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type={record.status === "Paid" ? "default" : "primary"}
            onClick={() => handleUpdateFeeStatus(record.id || record._id, record.status)}
            loading={updating}
            size="small"
          >
            {record.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
          </Button>
          <Popconfirm
            title="Delete Fee"
            description="Are you sure you want to delete this fee?"
            onConfirm={() => handleDeleteFee(record.id || record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={deleting}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const students = studentsData?.students || [];
  const fees = feesData || [];
  const totalFees = fees.length;
  const paidFees = fees.filter(fee => fee.status === "Paid").length;
  const unpaidFees = totalFees - paidFees;
  const totalAmount = fees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);

  const selectedStudent = students.find(s => s._id === selectedStudentId);

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Fees Management</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Fees"
                value={totalFees}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Paid Fees"
                value={paidFees}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Unpaid Fees"
                value={unpaidFees}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Amount"
                value={totalAmount}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#722ed1" }}
                precision={2}
              />
            </Card>
          </Col>
        </Row>

        {/* Student Selection */}
        <Card title="Select Student">
          <Row gutter={16}>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Choose a student to view fees"
                value={selectedStudentId}
                onChange={handleStudentChange}
                showSearch
                optionFilterProp="children"
              >
                {students.map((student) => (
                  <Option key={student._id} value={student._id}>
                    {student.fullName}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              {selectedStudent && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Add Fee for {selectedStudent.fullName}
                </Button>
              )}
            </Col>
          </Row>
        </Card>

        {/* Fees Table */}
        <Card>
          {selectedStudent ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <UserOutlined />
                  <span style={{ fontWeight: 500 }}>
                    Fees for: {selectedStudent.fullName}
                  </span>
                </Space>
              </div>
              
              <Table
                columns={columns}
                dataSource={fees}
                loading={loading}
                rowKey={(record) => record.id || record._id}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} fees`,
                }}
              />
            </div>
          ) : (
            <Empty
              description="Please select a student to view fees"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Add Fee Modal */}
        <Modal
          title="Add New Fee"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateFee}>
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
                {students.map((student) => (
                  <Option key={student._id} value={student._id}>
                    {student.fullName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="title"
              label="Fee Title"
              rules={[
                { required: true, message: "Please enter fee title!" },
              ]}
            >
              <Input placeholder="Enter fee title (e.g., Tuition Fee, Activity Fee)" />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[
                { required: true, message: "Please enter amount!" },
                { type: "number", min: 0, message: "Amount must be positive!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter fee amount"
                min={0}
                precision={2}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="deadline"
              label="Payment Deadline"
              rules={[
                { required: true, message: "Please select deadline!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={creating}
                >
                  Create Fee
                </Button>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AdminLayout>
  );
}
