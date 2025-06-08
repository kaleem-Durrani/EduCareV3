import { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Card,
  Descriptions,
  Avatar,
  Tag,
  Button,
  Table,
  Space,
  Dropdown,
  Popconfirm,
  message,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";
import { parentService } from "../../../services/index";
import useApi from "../../../hooks/useApi";
import dayjs from "dayjs";

export default function ParentDetailsModal({
  visible,
  parent,
  onCancel,
  onAddRelation,
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [childrenData, setChildrenData] = useState(null);

  // Fetch parent's children
  const { request: fetchChildren, isLoading: loadingChildren } = useApi(
    parentService.getParentChildren
  );

  // Update relationship
  const { request: updateRelation } = useApi(
    parentService.updateParentStudentRelation
  );

  // Delete relationship
  const { request: deleteRelation } = useApi(
    parentService.deleteParentStudentRelation
  );

  useEffect(() => {
    if (visible && parent?._id) {
      fetchChildrenData();
    }
  }, [visible, parent]);

  const fetchChildrenData = async () => {
    if (!parent?._id) return;
    try {
      const data = await fetchChildren(parent._id, { page: 1, limit: 50 });
      setChildrenData(data);
    } catch (error) {
      console.log("Fetch children error handled by useApi");
    }
  };

  const handleUpdateRelation = async (relationId, data) => {
    try {
      await updateRelation(relationId, data);
      message.success("Relationship updated successfully!");
      fetchChildrenData();
    } catch (error) {
      console.log("Update relation error handled by useApi");
    }
  };

  const handleDeleteRelation = async (relationId) => {
    try {
      await deleteRelation(relationId);
      message.success("Relationship deleted successfully!");
      fetchChildrenData();
    } catch (error) {
      console.log("Delete relation error handled by useApi");
    }
  };

  if (!parent) return null;

  const childrenColumns = [
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      render: (student) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div style={{ fontWeight: 500 }}>{student?.fullName}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Roll: {student?.rollNum} | Class: {student?.class}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Relationship",
      dataIndex: "relationshipType",
      key: "relationshipType",
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>,
    },
    {
      title: "Added",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => {
        const menuItems = [
          // {
          //   key: "edit",
          //   label: "Edit Relationship",
          //   icon: <EditOutlined />,
          //   onClick: () => {
          //     // For now, just toggle between parent/guardian
          //     const newType =
          //       record.relationshipType === "parent" ? "guardian" : "parent";
          //     handleUpdateRelation(record.relationId, {
          //       relationshipType: newType,
          //     });
          //   },
          // },
          {
            key: "delete",
            label: (
              <Popconfirm
                title="Remove Relationship"
                description="Are you sure you want to remove this relationship?"
                onConfirm={() => handleDeleteRelation(record.relationId)}
                okText="Yes"
                cancelText="No"
                placement="left"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  style={{ width: "100%", textAlign: "left", border: "none" }}
                >
                  Remove
                </Button>
              </Popconfirm>
            ),
            onClick: (e) => {
              e.domEvent.stopPropagation();
            },
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              style={{ border: "none" }}
            />
          </Dropdown>
        );
      },
    },
  ];

  const tabItems = [
    {
      key: "details",
      label: "Parent Details",
      children: (
        <Card>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          >
            <Avatar
              size={80}
              src={parent.photoUrl ? `${SERVER_URL}/${parent.photoUrl}` : null}
              icon={<UserOutlined />}
              style={{ border: "1px solid #d9d9d9", marginRight: 16 }}
            />
            <div>
              <h3 style={{ margin: 0 }}>{parent.name}</h3>
              <Tag color={parent.is_active ? "green" : "red"}>
                {parent.is_active ? "ACTIVE" : "INACTIVE"}
              </Tag>
            </div>
          </div>

          <Descriptions bordered column={2}>
            <Descriptions.Item label="Full Name">
              {parent.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{parent.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{parent.phone}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={parent.is_active ? "green" : "red"}>
                {parent.is_active ? "ACTIVE" : "INACTIVE"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {parent.address}
            </Descriptions.Item>
            <Descriptions.Item label="Children Count">
              <Tag color="blue" icon={<TeamOutlined />}>
                {parent.childrenCount || 0} Children
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Joined">
              {dayjs(parent.createdAt).format("MMMM DD, YYYY")}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: "children",
      label: `Children (${childrenData?.relationships?.length || 0})`,
      children: (
        <Card>
          {/* <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onAddRelation(parent)}
            >
              Add Child Relationship
            </Button>
          </div> */}

          <Table
            columns={childrenColumns}
            dataSource={childrenData?.relationships || []}
            loading={loadingChildren}
            rowKey={(record) => record.relationId}
            pagination={false}
            locale={{
              emptyText: "No children relationships found",
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <Modal
      title={`Parent Details - ${parent.name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </Modal>
  );
}
