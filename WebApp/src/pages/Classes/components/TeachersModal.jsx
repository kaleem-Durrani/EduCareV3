import { Modal, Table, Button, Space, Select, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTeachersContext } from "../../../context/TeachersContext";
import { classService } from "../../../services/index";
import { handleApiError } from "../../../utils/errorHandler";

export default function TeachersModal({
  visible,
  onCancel,
  classData,
  teachers,
  onRefresh,
}) {
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [removingTeacher, setRemovingTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const { teachers: allTeachers } = useTeachersContext();

  // Filter out teachers already in the class
  const availableTeachers = allTeachers.filter(
    (teacher) =>
      !teachers.some((classTeacher) => classTeacher._id === teacher.value)
  );

  const handleAddTeacher = async () => {
    if (!selectedTeacherId) {
      message.warning("Please select a teacher to add");
      return;
    }

    setAddingTeacher(true);
    try {
      await classService.enrollTeacher(classData._id, {
        teacher_id: selectedTeacherId,
      });
      message.success("Teacher added to class successfully!");
      setSelectedTeacherId(null);
      onRefresh(); // Refresh the class data
    } catch (error) {
      // Use the error handler to display the actual error message from the API
      handleApiError(error);
    } finally {
      setAddingTeacher(false);
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    setRemovingTeacher(teacherId);
    try {
      await classService.removeTeacherFromClass(classData._id, teacherId);
      message.success("Teacher removed from class successfully!");
      onRefresh(); // Refresh the class data
    } catch (error) {
      // Use the error handler to display the actual error message from the API
      handleApiError(error);
    } finally {
      setRemovingTeacher(null);
    }
  };

  const columns = [
    {
      title: "Teacher Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: "#52c41a" }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Remove Teacher"
          description="Are you sure you want to remove this teacher from the class?"
          onConfirm={() => handleRemoveTeacher(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={removingTeacher === record._id}
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
      title={`Teachers in ${classData?.name || "Class"}`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnHidden
    >
      {/* Add Teacher Section */}
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
            placeholder="Select a teacher to add"
            value={selectedTeacherId}
            onChange={setSelectedTeacherId}
            showSearch
            optionFilterProp="label"
            options={availableTeachers.map((teacher) => ({
              value: teacher.value,
              label: teacher.label,
            }))}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTeacher}
            loading={addingTeacher}
            disabled={!selectedTeacherId}
            style={{ borderRadius: "0 6px 6px 0" }}
          >
            Add Teacher
          </Button>
        </Space.Compact>
        {availableTeachers.length === 0 && (
          <div style={{ marginTop: 8, color: "#666", fontSize: "12px" }}>
            All teachers are already assigned to this class
          </div>
        )}
      </div>

      {/* Teachers Table */}
      <Table
        columns={columns}
        dataSource={teachers}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} teachers`,
        }}
        locale={{
          emptyText: "No teachers assigned to this class",
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
