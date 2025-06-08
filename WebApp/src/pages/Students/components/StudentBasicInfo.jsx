import {
  Card,
  Form,
  Input,
  DatePicker,
  Switch,
  Button,
  Row,
  Col,
  Space,
  Tag,
  message,
  Modal,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { studentService } from "../../../services/index";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function StudentBasicInfo({ student, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const [editLikes, setEditLikes] = useState([]);
  const [currentEditLike, setCurrentEditLike] = useState("");

  const addEditLike = () => {
    if (currentEditLike.trim() && !editLikes.includes(currentEditLike.trim())) {
      setEditLikes([...editLikes, currentEditLike.trim()]);
      setCurrentEditLike("");
    } else if (editLikes.includes(currentEditLike.trim())) {
      message.warning("This like already exists!");
    }
  };

  const removeEditLike = (likeToRemove) => {
    setEditLikes(editLikes.filter((like) => like !== likeToRemove));
  };

  const handleEditLikeInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEditLike();
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form to original values
      form.setFieldsValue({
        fullName: student.fullName || "",
        rollNum: student.rollNum || "",
        birthdate: student.birthdate ? dayjs(student.birthdate) : null,
        allergies: student.allergies?.join(", ") || "",
        likes: student.likes || [], // Keep as array
        additionalInfo: student.additionalInfo || "",
        authorizedPhotos: student.authorizedPhotos || false,
        schedule: {
          time: student.schedule?.time || "",
          days: student.schedule?.days || "",
        },
      });
      setEditLikes(student.likes || []);
      setCurrentEditLike("");
    } else {
      // Start editing - populate form and likes
      form.setFieldsValue({
        fullName: student.fullName || "",
        rollNum: student.rollNum || "",
        birthdate: student.birthdate ? dayjs(student.birthdate) : null,
        allergies: student.allergies?.join(", ") || "",
        additionalInfo: student.additionalInfo || "",
        authorizedPhotos: student.authorizedPhotos || false,
        schedule: {
          time: student.schedule?.time || "",
          days: student.schedule?.days || "",
        },
      });
      setEditLikes(student.likes || []);
      setCurrentEditLike("");
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateStudent = async (values) => {
    Modal.confirm({
      title: "Update Student Information",
      content: "Are you sure you want to update this student's information?",
      onOk: async () => {
        setUpdating(true);
        try {
          // Process form data
          const updateData = {
            ...values,
            rollNum: parseInt(values.rollNum), // Ensure rollNum is a number
            birthdate: values.birthdate ? values.birthdate.toISOString() : null,
            allergies: values.allergies
              ? values.allergies
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : [],
            likes: editLikes, // Use editLikes array
          };

          const updatedStudent = await studentService.updateStudent(
            student._id,
            updateData
          );
          message.success("Student information updated successfully!");
          setIsEditing(false);
          onUpdate(updatedStudent);
        } catch (error) {
          message.error("Failed to update student information");
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  return (
    <Card
      title="Basic Information"
      extra={
        <Space>
          {isEditing ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={updating}
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
      {isEditing ? (
        <Form form={form} layout="vertical" onFinish={handleUpdateStudent}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter student name!" },
                  { min: 2, message: "Name must be at least 2 characters!" },
                ]}
              >
                <Input
                  placeholder="Enter student full name"
                  style={{
                    border: "2px solid #d9d9d9",
                    borderRadius: "6px",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rollNum"
                label="Enrollment #"
                rules={[
                  {
                    required: true,
                    message: "Please enter enrollment number!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter enrollment number"
                  disabled={true} // Non-editable in edit mode as per client request
                  style={{
                    border: "2px solid #d9d9d9",
                    borderRadius: "6px",
                    backgroundColor: "#f5f5f5", // Show it's disabled
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="birthdate"
                label="Date of Birth"
                rules={[
                  { required: true, message: "Please select birth date!" },
                ]}
              >
                <DatePicker
                  style={{
                    width: "100%",
                    border: "2px solid #d9d9d9",
                    borderRadius: "6px",
                  }}
                />
              </Form.Item>
            </Col>
            {/* Commented out as per client request */}
            {/* <Col span={12}>
              <Form.Item
                name="authorizedPhotos"
                label="Authorized Photos"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item name="allergies" label="Allergies (comma separated)">
                <Input
                  placeholder="Enter allergies separated by commas"
                  style={{
                    border: "2px solid #d9d9d9",
                    borderRadius: "6px",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Likes">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      placeholder="Enter a like"
                      value={currentEditLike}
                      onChange={(e) => setCurrentEditLike(e.target.value)}
                      onKeyPress={handleEditLikeInputKeyPress}
                      style={{
                        border: "2px solid #d9d9d9",
                        borderRadius: "6px 0 0 6px",
                      }}
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addEditLike}
                      disabled={!currentEditLike.trim()}
                      style={{
                        borderRadius: "0 6px 6px 0",
                      }}
                    >
                      Add Like
                    </Button>
                  </Space.Compact>

                  {editLikes.length > 0 && (
                    <Space wrap style={{ marginTop: 8 }}>
                      {editLikes.map((like, index) => (
                        <Tag
                          key={index}
                          closable
                          onClose={() => removeEditLike(like)}
                          color="blue"
                          style={{ marginBottom: 4 }}
                        >
                          {like}
                        </Tag>
                      ))}
                    </Space>
                  )}
                </Space>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="additionalInfo" label="Additional Information">
                <TextArea
                  rows={3}
                  placeholder="Enter additional information"
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
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <strong>Full Name:</strong> {student?.fullName}
          </Col>
          <Col span={12}>
            <strong>Enrollment #:</strong> {student?.rollNum}
          </Col>
          <Col span={12}>
            <strong>Date of Birth:</strong>{" "}
            {student?.birthdate
              ? new Date(student.birthdate).toLocaleDateString()
              : "N/A"}
          </Col>
          {/* Commented out as per client request */}
          {/* <Col span={12}>
            <strong>Authorized Photos:</strong>{" "}
            <Tag color={student?.authorizedPhotos ? "green" : "red"}>
              {student?.authorizedPhotos ? "Yes" : "No"}
            </Tag>
          </Col> */}
          <Col span={12}>
            <strong>Allergies:</strong>{" "}
            {student?.allergies?.length > 0 ? (
              <Space wrap>
                {student.allergies.map((allergy, index) => (
                  <Tag key={index} color="orange">
                    {allergy}
                  </Tag>
                ))}
              </Space>
            ) : (
              "None"
            )}
          </Col>
          <Col span={12}>
            <strong>Likes:</strong>{" "}
            {student?.likes?.length > 0 ? (
              <Space wrap>
                {student.likes.map((like, index) => (
                  <Tag key={index} color="blue">
                    {like}
                  </Tag>
                ))}
              </Space>
            ) : (
              "None"
            )}
          </Col>
          <Col span={24}>
            <strong>Additional Information:</strong>{" "}
            {student?.additionalInfo || "None"}
          </Col>
        </Row>
      )}
    </Card>
  );
}
