import {
  Modal,
  Table,
  Button,
  Space,
  Select,
  message,
  Popconfirm,
  Upload,
  Avatar,
  Row,
  Col,
  Card,
  Divider,
  Form,
  Input,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useClassesContext } from "../../../context/ClassesContext";
import { teacherService, SERVER_URL } from "../../../services/index";

export default function TeacherDetailsModal({
  visible,
  onCancel,
  teacher,
  onRefresh,
}) {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [addingClass, setAddingClass] = useState(false);
  const [removingClass, setRemovingClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatingTeacher, setUpdatingTeacher] = useState(false);
  const { classes: allClasses } = useClassesContext();
  const [form] = Form.useForm();

  // Filter out classes already enrolled
  const availableClasses = allClasses.filter(
    (cls) => !enrolledClasses.some((enrolled) => enrolled._id === cls.value)
  );

  useEffect(() => {
    if (visible && teacher) {
      fetchTeacherDetails();
      // Populate form with teacher data
      form.setFieldsValue({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
      });
    }
  }, [visible, teacher, currentPage, form]);

  const fetchTeacherDetails = async () => {
    if (!teacher) return;

    setLoading(true);
    try {
      const response = await teacherService.getTeacherDetails(teacher._id, {
        page: currentPage,
        limit: 10,
      });
      const data = response.data || response;
      setEnrolledClasses(data.enrolledClasses || []);
      setPagination(data.pagination || {});
    } catch (error) {
      message.error("Failed to fetch teacher details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async () => {
    if (!selectedClassId) {
      message.warning("Please select a class to enroll");
      return;
    }

    setAddingClass(true);
    try {
      await teacherService.enrollTeacher(selectedClassId, {
        teacher_id: teacher._id,
      });
      message.success("Teacher enrolled in class successfully!");
      setSelectedClassId(null);
      fetchTeacherDetails();
      onRefresh(); // Refresh main table
    } catch (error) {
      message.error("Failed to enroll teacher in class");
    } finally {
      setAddingClass(false);
    }
  };

  const handleRemoveClass = async (classId) => {
    setRemovingClass(classId);
    try {
      await teacherService.removeTeacherFromClass(classId, teacher._id);
      message.success("Teacher removed from class successfully!");
      fetchTeacherDetails();
      onRefresh(); // Refresh main table
    } catch (error) {
      message.error("Failed to remove teacher from class");
    } finally {
      setRemovingClass(null);
    }
  };

  const handlePhotoUpload = async (file) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      await teacherService.updateTeacherPhoto(teacher._id, formData);
      message.success("Teacher photo updated successfully!");
      onRefresh(); // Refresh main table to show new photo
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error("Failed to upload teacher photo");
      return false;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form to original values
      form.setFieldsValue({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateTeacher = async (values) => {
    Modal.confirm({
      title: "Update Teacher Information",
      content: "Are you sure you want to update this teacher's information?",
      onOk: async () => {
        setUpdatingTeacher(true);
        try {
          await teacherService.updateTeacher(teacher._id, values);
          message.success("Teacher information updated successfully!");
          setIsEditing(false);
          onRefresh(); // Refresh main table and modal data
        } catch (error) {
          message.error("Failed to update teacher information");
        } finally {
          setUpdatingTeacher(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "No description",
      ellipsis: true,
    },
    {
      title: "Students",
      dataIndex: "studentCount",
      key: "studentCount",
      render: (count) => (
        <Space>
          <TeamOutlined style={{ color: "#1890ff" }} />
          {count || 0}
        </Space>
      ),
    },
    {
      title: "Teachers",
      dataIndex: "teacherCount",
      key: "teacherCount",
      render: (count) => (
        <Space>
          <UserOutlined style={{ color: "#52c41a" }} />
          {count || 0}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Remove from Class"
          description="Are you sure you want to remove this teacher from the class?"
          onConfirm={() => handleRemoveClass(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={removingClass === record._id}
            size="small"
            style={{ borderRadius: "4px" }}
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const getPhotoUrl = () => {
    if (teacher?.photoUrl) {
      // Use the SERVER_URL from environment variables
      return `${SERVER_URL}/${teacher.photoUrl}`;
    }
    return null;
  };

  return (
    <Modal
      title={`Teacher Details - ${teacher?.name || "Unknown"}`}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
      destroyOnHidden
    >
      {/* Teacher Info Section */}
      <Card
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={updatingTeacher}
                  onClick={() => form.submit()}
                  style={{ borderRadius: "4px" }}
                >
                  Save
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleEditToggle}
                  style={{ borderRadius: "4px" }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditToggle}
                style={{ borderRadius: "4px" }}
              >
                Edit Info
              </Button>
            )}
          </Space>
        }
      >
        <Row gutter={16} align="middle">
          <Col span={4}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={80}
                src={getPhotoUrl()}
                style={{ backgroundColor: "#1890ff", fontSize: "24px" }}
              >
                {teacher?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div style={{ marginTop: 8 }}>
                <Upload
                  beforeUpload={handlePhotoUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button
                    icon={<CameraOutlined />}
                    loading={uploadingPhoto}
                    size="small"
                    style={{ borderRadius: "4px" }}
                  >
                    {uploadingPhoto ? "Uploading..." : "Change Photo"}
                  </Button>
                </Upload>
              </div>
            </div>
          </Col>
          <Col span={20}>
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateTeacher}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter teacher name!",
                        },
                        {
                          min: 2,
                          message: "Name must be at least 2 characters!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter teacher name"
                        style={{
                          border: "2px solid #d9d9d9",
                          borderRadius: "6px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please enter email!" },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter email address"
                        style={{
                          border: "2px solid #d9d9d9",
                          borderRadius: "6px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label="Phone">
                      <Input
                        placeholder="Enter phone number"
                        style={{
                          border: "2px solid #d9d9d9",
                          borderRadius: "6px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="address" label="Address">
                      <Input
                        placeholder="Enter address"
                        style={{
                          border: "2px solid #d9d9d9",
                          borderRadius: "6px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ) : (
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <strong>Name:</strong> {teacher?.name}
                </Col>
                <Col span={12}>
                  <strong>Email:</strong> {teacher?.email}
                </Col>
                <Col span={12}>
                  <strong>Phone:</strong> {teacher?.phone || "N/A"}
                </Col>
                <Col span={12}>
                  <strong>Address:</strong> {teacher?.address || "N/A"}
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Card>

      <Divider>Enrolled Classes</Divider>

      {/* Add Class Section */}
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          backgroundColor: "#f5f5f5",
          borderRadius: "6px",
        }}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Select
            style={{ flex: 1 }}
            placeholder="Select a class to enroll teacher"
            value={selectedClassId}
            onChange={setSelectedClassId}
            showSearch
            optionFilterProp="label"
            options={availableClasses.map((cls) => ({
              value: cls.value,
              label: cls.label,
            }))}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClass}
            loading={addingClass}
            disabled={!selectedClassId}
            style={{ borderRadius: "0 6px 6px 0" }}
          >
            Enroll in Class
          </Button>
        </Space.Compact>
        {availableClasses.length === 0 && (
          <div style={{ marginTop: 8, color: "#666", fontSize: "12px" }}>
            Teacher is enrolled in all available classes
          </div>
        )}
      </div>

      {/* Classes Table */}
      <Table
        columns={columns}
        dataSource={enrolledClasses}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pagination.itemsPerPage || 10,
          total: pagination.totalItems || 0,
          onChange: setCurrentPage,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} classes`,
        }}
        locale={{
          emptyText: "Teacher is not enrolled in any classes",
        }}
      />

      {/* Footer */}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Button onClick={onCancel} style={{ borderRadius: "6px" }}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
