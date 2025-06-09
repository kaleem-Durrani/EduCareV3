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
  Spin,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useClassesContext } from "../../../context/ClassesContext";
import { teacherService, SERVER_URL } from "../../../services/index";
import useApi from "../../../hooks/useApi";
import { handleApiError } from "../../../utils/errorHandler";

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

  // Use the useApi hook for fetching teacher data
  const {
    request: fetchTeacherData,
    isLoading: teacherLoading,
    data: currentTeacher,
    error: fetchError,
  } = useApi(teacherService.getTeacherById);

  // Smart refresh function for modal data
  const refreshModalData = () => {
    if (teacher?._id) {
      fetchTeacherData(teacher._id);
    }
  };

  // Filter out classes already enrolled
  const availableClasses = allClasses.filter(
    (cls) => !enrolledClasses.some((enrolled) => enrolled._id === cls.value)
  );

  useEffect(() => {
    if (visible && teacher?._id) {
      fetchTeacherData(teacher._id);
      fetchTeacherDetails();
    }
  }, [visible, teacher?._id, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show error message if fetch fails
  useEffect(() => {
    if (fetchError) {
      message.error("Failed to load teacher details");
    }
  }, [fetchError]);

  // Update form when teacher data is loaded
  useEffect(() => {
    if (currentTeacher) {
      form.setFieldsValue({
        name: currentTeacher.name || "",
        email: currentTeacher.email || "",
        phone: currentTeacher.phone || "",
        address: currentTeacher.address || "",
      });
    }
  }, [currentTeacher, form]);

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
      refreshModalData(); // Refresh modal data
      onRefresh(); // Refresh main table
    } catch (error) {
      handleApiError(error);
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
      refreshModalData(); // Refresh modal data
      onRefresh(); // Refresh main table
    } catch (error) {
      handleApiError(error);
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
      refreshModalData(); // Refresh modal data
      onRefresh(); // Refresh main table to show new photo
      return false; // Prevent default upload behavior
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form to original values
      form.setFieldsValue({
        name: currentTeacher?.name || "",
        email: currentTeacher?.email || "",
        phone: currentTeacher?.phone || "",
        address: currentTeacher?.address || "",
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
          refreshModalData(); // Refresh modal data
          onRefresh(); // Refresh main table
        } catch (error) {
          handleApiError(error);
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
    if (currentTeacher?.photoUrl) {
      // Use the SERVER_URL from environment variables
      return `${SERVER_URL}/${currentTeacher.photoUrl}`;
    }
    return null;
  };

  return (
    <Modal
      title={`Teacher Details - ${
        currentTeacher?.name || teacher?.name || "Unknown"
      }`}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
      destroyOnHidden
    >
      {teacherLoading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading teacher details...</div>
        </div>
      ) : (
        <>
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
                    {currentTeacher?.name?.charAt(0)?.toUpperCase()}
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
                      <strong>Name:</strong> {currentTeacher?.name}
                    </Col>
                    <Col span={12}>
                      <strong>Email:</strong> {currentTeacher?.email}
                    </Col>
                    <Col span={12}>
                      <strong>Phone:</strong> {currentTeacher?.phone || "N/A"}
                    </Col>
                    <Col span={12}>
                      <strong>Address:</strong>{" "}
                      {currentTeacher?.address || "N/A"}
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
        </>
      )}
    </Modal>
  );
}
