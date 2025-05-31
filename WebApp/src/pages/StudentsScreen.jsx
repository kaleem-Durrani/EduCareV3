import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useApiQuery, useApiMutation } from "../hooks/useApi";
import { studentService } from "../services/index";
import AdminLayout from "../components/Layout/AdminLayout";

const { Title } = Typography;
const { Option } = Select;

export default function StudentsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  // Fetch students data
  const {
    data: students,
    loading,
    refetch,
  } = useApiQuery(studentService.getAllStudents, {
    showErrorMessage: true,
  });

  // Create student mutation
  const { mutate: createStudent, loading: creating } = useApiMutation(
    studentService.createStudent,
    {
      onSuccess: () => {
        setIsModalVisible(false);
        form.resetFields();
        refetch();
      },
      successMessage: "Student created successfully!",
    }
  );

  // Update student mutation
  const { mutate: updateStudent, loading: updating } = useApiMutation(
    ({ id, data }) => studentService.updateStudent(id, data),
    {
      onSuccess: () => {
        setIsModalVisible(false);
        setEditingStudent(null);
        form.resetFields();
        refetch();
      },
      successMessage: "Student updated successfully!",
    }
  );

  const columns = [
    {
      title: "Roll Number",
      dataIndex: "rollNum",
      key: "rollNum",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Current Class",
      dataIndex: ["currentClass", "name"],
      key: "currentClass",
      render: (className) => className || "Not Assigned",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      ...student,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (student) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      content: `This will permanently delete ${student.name}'s record.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        // Implement delete functionality
        console.log("Delete student:", student);
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        await updateStudent({
          id: editingStudent.rollNum,
          data: values,
        });
      } else {
        await createStudent(values);
      }
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const studentsData = students?.data || [];
  const totalStudents = studentsData.length;
  const activeStudents = studentsData.filter(
    (s) => s.status === "active"
  ).length;

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Students Management</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Students"
                value={totalStudents}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Active Students"
                value={activeStudents}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Inactive Students"
                value={totalStudents - activeStudents}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add New Student
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={studentsData}
            loading={loading}
            rowKey="rollNum"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} students`,
            }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingStudent ? "Edit Student" : "Add New Student"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingStudent(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="rollNum"
                  label="Roll Number"
                  rules={[
                    { required: true, message: "Please enter roll number!" },
                  ]}
                >
                  <Input
                    placeholder="Enter roll number"
                    disabled={!!editingStudent}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter student name!" },
                  ]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[
                    { required: true, message: "Please select date of birth!" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: "Please select gender!" }]}
                >
                  <Select placeholder="Select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="address" label="Address">
              <Input.TextArea rows={3} placeholder="Enter address" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={creating || updating}
                >
                  {editingStudent ? "Update" : "Create"} Student
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingStudent(null);
                    form.resetFields();
                  }}
                >
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
