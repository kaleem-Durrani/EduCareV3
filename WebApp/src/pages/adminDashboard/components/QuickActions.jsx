import React from 'react';
import { Card, Button, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaChalkboard, 
  FaFileAlt, 
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave 
} from 'react-icons/fa';
import { PROTECTED_ROUTES } from '../../../constants/routes';

const { Title } = Typography;

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Student',
      icon: <FaUserPlus />,
      color: '#1890ff',
      onClick: () => navigate(PROTECTED_ROUTES.STUDENTS),
    },
    {
      title: 'Manage Classes',
      icon: <FaChalkboard />,
      color: '#52c41a',
      onClick: () => navigate(PROTECTED_ROUTES.CLASSES),
    },
    {
      title: 'View Reports',
      icon: <FaFileAlt />,
      color: '#722ed1',
      onClick: () => navigate(PROTECTED_ROUTES.REPORTS),
    },
    {
      title: 'Monthly Plans',
      icon: <FaCalendarAlt />,
      color: '#fa8c16',
      onClick: () => navigate(PROTECTED_ROUTES.MONTHLY_PLANS),
    },
    {
      title: 'Manage Teachers',
      icon: <FaUsers />,
      color: '#13c2c2',
      onClick: () => navigate(PROTECTED_ROUTES.TEACHERS),
    },
    {
      title: 'Fee Management',
      icon: <FaMoneyBillWave />,
      color: '#eb2f96',
      onClick: () => navigate(PROTECTED_ROUTES.FEES),
    },
  ];

  return (
    <Card title={<Title level={4}>Quick Actions</Title>}>
      <Row gutter={[12, 12]}>
        {actions.map((action, index) => (
          <Col xs={12} sm={8} key={index}>
            <Button
              type="dashed"
              block
              size="large"
              icon={action.icon}
              onClick={action.onClick}
              style={{
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: action.color,
                borderColor: action.color,
              }}
            >
              {action.title}
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;
