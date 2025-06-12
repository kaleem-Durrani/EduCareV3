import {
  Modal,
  Tabs,
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Upload,
  Switch,
  Tag,
  message,
  Spin,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { studentService, SERVER_URL } from "../../../services/index";
import useApi from "../../../hooks/useApi";
import { handleApiError } from "../../../utils/errorHandler";
import { useStudentsContext } from "../../../context/StudentsContext";
import StudentBasicInfo from "./StudentBasicInfo";
import StudentContactsManager from "./StudentContactsManager";

export default function StudentDetailsModal({
  visible,
  onCancel,
  student,
  onRefresh,
}) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Get context refresh function
  const { refreshStudents } = useStudentsContext();

  // Use the useApi hook for fetching student data
  const {
    request: fetchStudentData,
    isLoading: loading,
    data: currentStudent,
    error: fetchError,
  } = useApi(studentService.getStudentById);

  // Smart refresh function for modal data
  const refreshModalData = () => {
    if (student?._id) {
      fetchStudentData(student._id);
    }
  };

  useEffect(() => {
    if (visible && student?._id) {
      fetchStudentData(student._id);
    }
  }, [visible, student?._id]);

  // Show error message if fetch fails
  useEffect(() => {
    if (fetchError) {
      message.error("Failed to load student details");
    }
  }, [fetchError]);

  const getPhotoUrl = () => {
    if (currentStudent?.photoUrl) {
      return `${SERVER_URL}/${currentStudent.photoUrl}`;
    }
    return null;
  };

  const handlePhotoUpload = async (file) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      await studentService.updateStudentPhoto(currentStudent._id, formData);
      message.success("Student photo updated successfully!");

      // Refresh both modal and main table data
      refreshModalData(); // Refresh modal data
      onRefresh(); // Refresh main table
      refreshStudents(); // Update context for dropdowns
      return false; // Prevent default upload behavior
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleStatusToggle = async (active) => {
    Modal.confirm({
      title: `${active ? "Activate" : "Deactivate"} Student`,
      content: `Are you sure you want to ${
        active ? "activate" : "deactivate"
      } this student?`,
      onOk: async () => {
        setUpdatingStatus(true);
        try {
          await studentService.updateStudentActiveStatus(currentStudent._id, {
            active,
          });
          message.success(
            `Student ${active ? "activated" : "deactivated"} successfully!`
          );

          // Refresh both modal and main table data
          refreshModalData(); // Refresh modal data
          onRefresh(); // Refresh main table
          refreshStudents(); // Update context for dropdowns
        } catch (error) {
          handleApiError(error);
        } finally {
          setUpdatingStatus(false);
        }
      },
    });
  };

  const tabItems = [
    {
      key: "basic",
      label: "Basic Information",
      children: (
        <StudentBasicInfo
          student={currentStudent}
          onUpdate={() => {
            refreshModalData(); // Refresh modal data
            onRefresh(); // Refresh main table
            refreshStudents(); // Update context for dropdowns
          }}
        />
      ),
    },
    {
      key: "contacts",
      label: "Contacts",
      children: (
        <StudentContactsManager
          student={currentStudent}
          onUpdate={() => {
            refreshModalData(); // Refresh modal data
            onRefresh(); // Refresh main table
            refreshStudents(); // Update context for dropdowns
          }}
        />
      ),
    },
    // Commented out as per client request
    // {
    //   key: "enrollment",
    //   label: "Enrollment History",
    //   children: (
    //     <StudentEnrollmentHistory
    //       student={currentStudent}
    //     />
    //   ),
    // },
  ];

  return (
    <Modal
      title={`Student Details - ${currentStudent?.fullName || "Unknown"}`}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading student details...</div>
        </div>
      ) : (
        <>
          {/* Student Header Section */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col span={4}>
                <div style={{ textAlign: "center" }}>
                  <Avatar
                    size={80}
                    src={getPhotoUrl()}
                    style={{ backgroundColor: "#1890ff", fontSize: "24px" }}
                  >
                    {currentStudent?.fullName?.charAt(0)?.toUpperCase()}
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
              <Col span={16}>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <strong>Name:</strong> {currentStudent?.fullName}
                  </Col>
                  <Col span={12}>
                    <strong>Enrollment #:</strong> {currentStudent?.rollNum}
                  </Col>
                  <Col span={12}>
                    <strong>Date of Birth:</strong>{" "}
                    {currentStudent?.birthdate
                      ? new Date(currentStudent.birthdate).toLocaleDateString()
                      : "N/A"}
                  </Col>
                  <Col span={12}>
                    <strong>Current Class:</strong>{" "}
                    {currentStudent?.current_class?.name || "Not Assigned"}
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: 8 }}>
                    <Tag color={currentStudent?.active ? "green" : "red"}>
                      {currentStudent?.active ? "Active" : "Inactive"}
                    </Tag>
                  </div>
                  <Switch
                    checked={currentStudent?.active}
                    loading={updatingStatus}
                    onChange={handleStatusToggle}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </div>
              </Col>
            </Row>
          </Card>

          {/* Tabs Section */}
          <Tabs items={tabItems} />
        </>
      )}
    </Modal>
  );
}
