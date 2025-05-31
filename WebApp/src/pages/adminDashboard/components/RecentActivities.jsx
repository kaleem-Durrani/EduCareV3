import React from 'react';
import { Card, List, Avatar, Typography, Tag } from 'antd';
import { 
  FaUserPlus, 
  FaFileAlt, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaBell 
} from 'react-icons/fa';

const { Title, Text } = Typography;

const RecentActivities = () => {
  // Mock data for recent activities - in real app, this would come from an API
  const activities = [
    {
      id: 1,
      type: 'student_enrolled',
      title: 'New Student Enrolled',
      description: 'John Doe has been enrolled in Class A',
      time: '2 hours ago',
      icon: <FaUserPlus style={{ color: '#1890ff' }} />,
      tag: { text: 'New', color: 'blue' },
    },
    {
      id: 2,
      type: 'report_submitted',
      title: 'Weekly Report Submitted',
      description: 'Class B weekly report has been submitted by Ms. Smith',
      time: '4 hours ago',
      icon: <FaFileAlt style={{ color: '#52c41a' }} />,
      tag: { text: 'Report', color: 'green' },
    },
    {
      id: 3,
      type: 'fee_payment',
      title: 'Fee Payment Received',
      description: 'Payment of $500 received from Jane Smith',
      time: '1 day ago',
      icon: <FaMoneyBillWave style={{ color: '#fa8c16' }} />,
      tag: { text: 'Payment', color: 'orange' },
    },
    {
      id: 4,
      type: 'monthly_plan',
      title: 'Monthly Plan Updated',
      description: 'October monthly plan has been updated for Class C',
      time: '2 days ago',
      icon: <FaCalendarAlt style={{ color: '#722ed1' }} />,
      tag: { text: 'Plan', color: 'purple' },
    },
    {
      id: 5,
      type: 'announcement',
      title: 'New Announcement',
      description: 'Parent-teacher meeting scheduled for next week',
      time: '3 days ago',
      icon: <FaBell style={{ color: '#eb2f96' }} />,
      tag: { text: 'Notice', color: 'magenta' },
    },
  ];

  return (
    <Card 
      title={<Title level={4}>Recent Activities</Title>}
      extra={<Text type="secondary">Last 7 days</Text>}
    >
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={item.icon}
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text strong>{item.title}</Text>
                  <Tag color={item.tag.color} size="small">
                    {item.tag.text}
                  </Tag>
                </div>
              }
              description={
                <div>
                  <Text>{item.description}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {item.time}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivities;
