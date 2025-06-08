import { Modal, Table, Button, Space, Select, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useStudentsContext } from "../../../context/StudentsContext";
import { classService } from "../../../services/index";

export default function StudentsModal({
  visible,
  onCancel,
  classData,
  students,
  onRefresh,
}) {
  const [addingStudent, setAddingStudent] = useState(false);
  const [removingStudent, setRemovingStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { students: allStudents } = useStudentsContext();

  // Filter out students already in the class
  const availableStudents = allStudents.filter(
    (student) => !students.some((classStudent) => classStudent._id === student.value)
  );

  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      message.warning("Please select a student to add");
      return;
    }

    setAddingStudent(true);
    try {
      await classService.addStudentToClass(classData._id, {
        student_id: selectedStudentId,
      });
      message.success("Student added to class successfully!");
      setSelectedStudentId(null);
      onRefresh(); // Refresh the class data
    } catch (error) {
      message.error("Failed to add student to class");
    } finally {
      setAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    setRemovingStudent(studentId);
    try {
      await classService.removeStudentFromClass(classData._id, studentId);
      message.success("Student removed from class successfully!");
      onRefresh(); // Refresh the class data
    } catch (error) {
      message.error("Failed to remove student from class");
    } finally {
      setRemovingStudent(null);
    }
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "Roll Number",
      dataIndex: "rollNum",
      key: "rollNum",
    },
    {
      title: "Birth Date",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Remove Student"
          description="Are you sure you want to remove this student from the class?"
          onConfirm={() => handleRemoveStudent(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={removingStudent === record._id}
            size="small"
            style={{ borderRadius: "4px" }}
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title={`Students in ${classData?.name || "Class"}`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnHidden
    >
      {/* Add Student Section */}
      <div style={{ marginBottom: 16, padding: 16, backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
        <Space.Compact style={{ width: "100%" }}>
          <Select
            style={{ flex: 1 }}
            placeholder="Select a student to add"
            value={selectedStudentId}
            onChange={setSelectedStudentId}
            showSearch
            optionFilterProp="label"
            options={availableStudents.map((student) => ({
              value: student.value,
              label: student.label,
            }))}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddStudent}
            loading={addingStudent}
            disabled={!selectedStudentId}
            style={{ borderRadius: "0 6px 6px 0" }}
          >
            Add Student
          </Button>
        </Space.Compact>
        {availableStudents.length === 0 && (
          <div style={{ marginTop: 8, color: "#666", fontSize: "12px" }}>
            All students are already enrolled in this class
          </div>
        )}
      </div>

      {/* Students Table */}
      <Table
        columns={columns}
        dataSource={students}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
        }}
        locale={{
          emptyText: "No students enrolled in this class",
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
