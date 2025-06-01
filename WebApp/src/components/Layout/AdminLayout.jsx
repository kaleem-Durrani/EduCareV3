import React, { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  theme,
  Space,
  Typography,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  HeartOutlined,
  DollarOutlined,
  InboxOutlined,
  FileOutlined,
  NotificationOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "../../constants/routes";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items configuration
  const menuItems = [
    {
      key: PROTECTED_ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: PROTECTED_ROUTES.STUDENTS,
      icon: <UserOutlined />,
      label: "Students",
    },
    {
      key: PROTECTED_ROUTES.TEACHERS,
      icon: <TeamOutlined />,
      label: "Teachers",
    },
    {
      key: PROTECTED_ROUTES.PARENTS,
      icon: <TeamOutlined />,
      label: "Parents",
    },
    {
      key: PROTECTED_ROUTES.CLASSES,
      icon: <BookOutlined />,
      label: "Classes",
    },
    {
      key: PROTECTED_ROUTES.REPORTS,
      icon: <FileTextOutlined />,
      label: "Reports",
    },
    {
      key: PROTECTED_ROUTES.MONTHLY_PLANS,
      icon: <CalendarOutlined />,
      label: "Monthly Plans",
    },
    {
      key: PROTECTED_ROUTES.FOOD_MENU,
      icon: <CalendarOutlined />,
      label: "Food Menu",
    },
    {
      key: PROTECTED_ROUTES.HEALTH,
      icon: <HeartOutlined />,
      label: "Health",
    },
    {
      key: PROTECTED_ROUTES.FEES,
      icon: <DollarOutlined />,
      label: "Fees",
    },
    {
      key: PROTECTED_ROUTES.BOX_ITEMS,
      icon: <InboxOutlined />,
      label: "Box Items",
    },
    {
      key: PROTECTED_ROUTES.DOCUMENTS,
      icon: <FileOutlined />,
      label: "Documents",
    },
    {
      key: PROTECTED_ROUTES.POSTS,
      icon: <NotificationOutlined />,
      label: "Posts",
    },
    {
      key: PROTECTED_ROUTES.LOST_ITEMS,
      icon: <SearchOutlined />,
      label: "Lost Items",
    },
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate(PROTECTED_ROUTES.PROFILE),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate(PROTECTED_ROUTES.SETTINGS),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    const pathname = location.pathname;
    // Find the menu item that matches the current path
    const matchedItem = menuItems.find((item) => pathname.startsWith(item.key));
    return matchedItem ? [matchedItem.key] : [];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          {!collapsed ? (
            <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
              EduCare
            </Text>
          ) : (
            <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
              EC
            </Text>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <Space>
            <Text>Welcome, {user?.name || user?.email}</Text>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Avatar
                style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: "16px",
            maxHeight: "89vh",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
