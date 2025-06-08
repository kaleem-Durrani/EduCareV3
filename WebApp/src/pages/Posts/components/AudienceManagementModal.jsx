import { Modal, Tabs, Table, Button, Select, message, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import useApi from "../../../hooks/useApi";
import { postService } from "../../../services/index";
import { useStudentsContext } from "../../../context/StudentsContext";
import { useClassesContext } from "../../../context/ClassesContext";

const { Option } = Select;

export default function AudienceManagementModal({
  visible,
  post,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [studentsPage, setStudentsPage] = useState(1);
  const [classesPage, setClassesPage] = useState(1);
  
  const { students } = useStudentsContext();
  const { classes } = useClassesContext();

  // Fetch post students
  const {
    data: studentsData,
    request: fetchStudents,
    isLoading: loadingStudents,
  } = useApi(postService.getPostStudents);

  // Fetch post classes
  const {
    data: classesData,
    request: fetchClasses,
    isLoading: loadingClasses,
  } = useApi(postService.getPostClasses);

  // Add students API
  const { request: addStudents, isLoading: addingStudents } = useApi(
    postService.addStudentsToPost
  );

  // Remove students API
  const { request: removeStudents, isLoading: removingStudents } = useApi(
    postService.removeStudentsFromPost
  );

  // Add classes API
  const { request: addClasses, isLoading: addingClasses } = useApi(
    postService.addClassesToPost
  );

  // Remove classes API
  const { request: removeClasses, isLoading: removingClasses } = useApi(
    postService.removeClassesFromPost
  );

  useEffect(() => {
    if (visible && post) {
      if (post.audience?.type === "individual") {
        fetchStudents(post._id, { page: studentsPage, limit: 10 });
        setActiveTab("1");
      } else if (post.audience?.type === "class") {
        fetchClasses(post._id, { page: classesPage, limit: 10 });
        setActiveTab("2");
      }
    }
  }, [visible, post, studentsPage, classesPage]);

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) {
      message.warning("Please select students to add");
      return;
    }

    try {
      await addStudents(post._id, selectedStudents);
      message.success("Students added successfully!");
      setSelectedStudents([]);
      fetchStudents(post._id, { page: studentsPage, limit: 10 });
    } catch (error) {
      console.log("Add students error handled by useApi");
    }
  };

  const handleRemoveStudents = async (studentIds) => {
    try {
      await removeStudents(post._id, studentIds);
      message.success("Students removed successfully!");
      fetchStudents(post._id, { page: studentsPage, limit: 10 });
    } catch (error) {
      console.log("Remove students error handled by useApi");
    }
  };

  const handleAddClasses = async () => {
    if (selectedClasses.length === 0) {
      message.warning("Please select classes to add");
      return;
    }

    try {
      await addClasses(post._id, selectedClasses);
      message.success("Classes added successfully!");
      setSelectedClasses([]);
      fetchClasses(post._id, { page: classesPage, limit: 10 });
    } catch (error) {
      console.log("Add classes error handled by useApi");
    }
  };

  const handleRemoveClasses = async (classIds) => {
    try {
      await removeClasses(post._id, classIds);
      message.success("Classes removed successfully!");
      fetchClasses(post._id, { page: classesPage, limit: 10 });
    } catch (error) {
      console.log("Remove classes error handled by useApi");
    }
  };

  const studentsColumns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Enrollment #",
      dataIndex: "enrollmentNumber",
      key: "enrollmentNumber",
    },
    {
      title: "Class",
      dataIndex: "current_class",
      key: "class",
      render: (classInfo) => classInfo?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Remove Student"
          description="Remove this student from the post?"
          onConfirm={() => handleRemoveStudents([record._id])}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const classesColumns = [
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Remove Class"
          description="Remove this class from the post?"
          onConfirm={() => handleRemoveClasses([record._id])}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (!post || post.audience?.type === "all") {
    return null;
  }

  const tabItems = [];

  if (post.audience?.type === "individual") {
    tabItems.push({
      key: "1",
      label: (
        <span>
          <UserOutlined />
          Students ({studentsData?.pagination?.totalItems || 0})
        </span>
      ),
      children: (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Select
              mode="multiple"
              style={{ flex: 1 }}
              placeholder="Select students to add"
              value={selectedStudents}
              onChange={setSelectedStudents}
              options={students?.filter(
                (student) =>
                  !studentsData?.students?.some((s) => s._id === student.value)
              )}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddStudents}
              loading={addingStudents}
            >
              Add Students
            </Button>
          </div>

          <Table
            columns={studentsColumns}
            dataSource={studentsData?.students || []}
            loading={loadingStudents || removingStudents}
            rowKey="_id"
            pagination={{
              current: studentsPage,
              pageSize: 10,
              total: studentsData?.pagination?.totalItems || 0,
              onChange: setStudentsPage,
            }}
          />
        </Space>
      ),
    });
  }

  if (post.audience?.type === "class") {
    tabItems.push({
      key: "2",
      label: (
        <span>
          <TeamOutlined />
          Classes ({classesData?.pagination?.totalItems || 0})
        </span>
      ),
      children: (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Select
              mode="multiple"
              style={{ flex: 1 }}
              placeholder="Select classes to add"
              value={selectedClasses}
              onChange={setSelectedClasses}
              options={classes?.filter(
                (classItem) =>
                  !classesData?.classes?.some((c) => c._id === classItem.value)
              )}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddClasses}
              loading={addingClasses}
            >
              Add Classes
            </Button>
          </div>

          <Table
            columns={classesColumns}
            dataSource={classesData?.classes || []}
            loading={loadingClasses || removingClasses}
            rowKey="_id"
            pagination={{
              current: classesPage,
              pageSize: 10,
              total: classesData?.pagination?.totalItems || 0,
              onChange: setClassesPage,
            }}
          />
        </Space>
      ),
    });
  }

  return (
    <Modal
      title={`Manage Audience - ${post.title}`}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Modal>
  );
}
