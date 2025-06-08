import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Avatar,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { studentService, SERVER_URL } from "../../../services/index";

export default function StudentContactsManager({ student, onUpdate }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [form] = Form.useForm();

  const contacts = student?.contacts || [];

  const columns = [
    {
      title: "Photo",
      dataIndex: "photoUrl",
      key: "photo",
      width: 60,
      render: (photoUrl, record) => (
        <Avatar
          size={40}
          src={photoUrl ? `${SERVER_URL}/uploads/${photoUrl}` : null}
          style={{ backgroundColor: "#1890ff" }}
        >
          {record.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Relationship",
      dataIndex: "relationship",
      key: "relationship",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
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
          <Popconfirm
            title="Are you sure you want to delete this contact?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingContact(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    form.setFieldsValue(contact);
    setIsModalVisible(true);
  };

  const handleDelete = async (contactId) => {
    setLoading(true);
    try {
      await studentService.deleteStudentContact(student._id, contactId);
      message.success("Contact deleted successfully!");

      // Update student data
      const updatedStudent = {
        ...student,
        contacts: student.contacts.filter((c) => c._id !== contactId),
      };
      onUpdate(updatedStudent);
    } catch (error) {
      message.error("Failed to delete contact");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Add photo if uploaded
      if (uploadedPhoto) {
        formData.append("photo", uploadedPhoto);
      }

      if (editingContact) {
        // Update existing contact
        const updatedContact = await studentService.updateStudentContact(
          student._id,
          editingContact._id,
          formData
        );
        message.success("Contact updated successfully!");

        // Update student data
        const updatedStudent = {
          ...student,
          contacts: student.contacts.map((c) =>
            c._id === editingContact._id ? updatedContact : c
          ),
        };
        onUpdate(updatedStudent);
      } else {
        // Add new contact
        const newContact = await studentService.addStudentContact(
          student._id,
          formData
        );
        message.success("Contact added successfully!");

        // Update student data
        const updatedStudent = {
          ...student,
          contacts: [...student.contacts, newContact],
        };
        onUpdate(updatedStudent);
      }

      setIsModalVisible(false);
      form.resetFields();
      setUploadedPhoto(null);
    } catch (error) {
      message.error(`Failed to ${editingContact ? "update" : "add"} contact`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingContact(null);
    form.resetFields();
    setUploadedPhoto(null);
  };

  const handlePhotoUpload = (file) => {
    setUploadedPhoto(file);
    return false; // Prevent default upload behavior
  };

  return (
    <>
      <Card
        title="Emergency Contacts"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ borderRadius: "4px" }}
          >
            Add Contact
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={contacts}
          loading={loading}
          rowKey="_id"
          pagination={false}
          locale={{
            emptyText: "No contacts added yet",
          }}
        />
      </Card>

      <Modal
        title={editingContact ? "Edit Contact" : "Add New Contact"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter contact name!" },
              { min: 2, message: "Name must be at least 2 characters!" },
            ]}
          >
            <Input
              placeholder="Enter contact name"
              style={{
                border: "2px solid #d9d9d9",
                borderRadius: "6px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="relationship"
            label="Relationship"
            rules={[{ required: true, message: "Please enter relationship!" }]}
          >
            <Input
              placeholder="e.g., Mother, Father, Guardian"
              style={{
                border: "2px solid #d9d9d9",
                borderRadius: "6px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number!" }]}
          >
            <Input
              placeholder="Enter phone number"
              style={{
                border: "2px solid #d9d9d9",
                borderRadius: "6px",
              }}
            />
          </Form.Item>

          <Form.Item label="Photo (Optional)">
            <Upload
              beforeUpload={handlePhotoUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button
                icon={<UploadOutlined />}
                style={{
                  border: "2px solid #d9d9d9",
                  borderRadius: "6px",
                  width: "100%",
                }}
              >
                {uploadedPhoto ? uploadedPhoto.name : "Upload Photo"}
              </Button>
            </Upload>
            {uploadedPhoto && (
              <div style={{ marginTop: 8, color: "#52c41a" }}>
                ✓ Photo selected: {uploadedPhoto.name}
              </div>
            )}
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ borderRadius: "4px" }}
              >
                {editingContact ? "Update" : "Add"} Contact
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
