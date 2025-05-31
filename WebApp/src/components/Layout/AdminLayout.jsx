import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme, Space, Typography } from 'antd';
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
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/students',
      icon: <UserOutlined />,
      label: 'Students',
    },
    {
      key: '/teachers',
      icon: <TeamOutlined />,
      label: 'Teachers',
    },
    {
      key: '/parents',
      icon: <TeamOutlined />,
      label: 'Parents',
    },
    {
      key: '/classes',
      icon: <BookOutlined />,
      label: 'Classes',
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
    {
      key: '/monthly-plans',
      icon: <CalendarOutlined />,
      label: 'Monthly Plans',
    },
    {
      key: '/food-menu',
      icon: <CalendarOutlined />,
      label: 'Food Menu',
    },
    {
      key: '/health',
      icon: <HeartOutlined />,
      label: 'Health',
    },
    {
      key: '/fees',
      icon: <DollarOutlined />,
      label: 'Fees',
    },
    {
      key: '/box-items',
      icon: <InboxOutlined />,
      label: 'Box Items',
    },
    {
      key: '/documents',
      icon: <FileOutlined />,
      label: 'Documents',
    },
    {
      key: '/posts',
      icon: <NotificationOutlined />,
      label: 'Posts',
    },
    {
      key: '/lost-items',
      icon: <SearchOutlined />,
      label: 'Lost Items',
    },
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    const pathname = location.pathname;
    // Find the menu item that matches the current path
    const matchedItem = menuItems.find(item => pathname.startsWith(item.key));
    return matchedItem ? [matchedItem.key] : [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          {!collapsed ? (
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              EduCare
            </Text>
          ) : (
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
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
            padding: '0 16px',
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
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
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>
        
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
