import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Button,
  Space,
  List,
  Avatar,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  PlusOutlined,
  FileTextOutlined,
  UploadOutlined,
  TrophyOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import useApi from "../hooks/useApi";
import { adminService } from "../services/index";
import AdminLayout from "../components/Layout/AdminLayout";

const { Title, Text } = Typography;

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch dashboard statistics
  const {
    data: stats,
    isLoading: statsLoading,
    request,
  } = useApi(adminService.getNumbers);

  useEffect(() => {
    request();
  }, []);

  const quickActions = [
    {
      title: "Add New Student",
      icon: <UserOutlined />,
      action: () => console.log("Add student"),
    },
    {
      title: "Create Class",
      icon: <BookOutlined />,
      action: () => console.log("Create class"),
    },
    {
      title: "View Reports",
      icon: <FileTextOutlined />,
      action: () => console.log("View reports"),
    },
    {
      title: "Upload Documents",
      icon: <UploadOutlined />,
      action: () => console.log("Upload documents"),
    },
  ];

  const recentActivities = [
    {
      title: "New student enrolled",
      description: "John Doe has been enrolled in Class A",
      time: "2 hours ago",
      avatar: <UserOutlined />,
    },
    {
      title: "Weekly report submitted",
      description: "Class B weekly report has been submitted",
      time: "4 hours ago",
      avatar: <FileTextOutlined />,
    },
    {
      title: "Fee payment received",
      description: "Payment received from Jane Smith",
      time: "1 day ago",
      avatar: <DollarOutlined />,
    },
  ];

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Welcome Header */}
        <div>
          <Title level={2}>Welcome back, {user?.name || user?.email}!</Title>
          <Text type="secondary">
            Here's what's happening in your school today.
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Students"
                value={stats?.students || 0}
                loading={statsLoading}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Teachers"
                value={stats?.teachers || 0}
                loading={statsLoading}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Classes"
                value={stats?.classes || 0}
                loading={statsLoading}
                prefix={<BookOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Parents"
                value={stats?.parents || 0}
                loading={statsLoading}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#eb2f96" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          {/* Quick Actions */}
          <Col xs={24} lg={12}>
            <Card title="Quick Actions" extra={<PlusOutlined />}>
              <Row gutter={[8, 8]}>
                {quickActions.map((action, index) => (
                  <Col xs={12} key={index}>
                    <Button
                      type="dashed"
                      icon={action.icon}
                      onClick={action.action}
                      style={{ width: "100%", height: "60px" }}
                    >
                      {action.title}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* Recent Activities */}
          <Col xs={24} lg={12}>
            <Card title="Recent Activities" extra={<CalendarOutlined />}>
              <List
                itemLayout="horizontal"
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: "#1890ff" }}
                          icon={item.avatar}
                        />
                      }
                      title={item.title}
                      description={
                        <div>
                          <div>{item.description}</div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {item.time}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </AdminLayout>
  );
}
