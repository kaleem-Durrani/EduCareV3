import { Card, Row, Col, Statistic, Skeleton } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  UserDeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export default function ParentsStatistics({ statistics, loading }) {
  if (loading) {
    return (
      <Row gutter={16}>
        {[...Array(6)].map((_, index) => (
          <Col span={4} key={index}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (!statistics) {
    return null;
  }

  const stats = [
    {
      title: "Total Parents",
      value: statistics.totalParents,
      prefix: <UserOutlined />,
      color: "#3f8600",
    },
    {
      title: "Active Parents",
      value: statistics.activeParents,
      prefix: <CheckCircleOutlined />,
      color: "#1890ff",
    },
    {
      title: "Inactive Parents",
      value: statistics.inactiveParents,
      prefix: <CloseCircleOutlined />,
      color: "#cf1322",
    },
    {
      title: "With Children",
      value: statistics.parentsWithChildren,
      prefix: <TeamOutlined />,
      color: "#722ed1",
    },
    {
      title: "Without Children",
      value: statistics.parentsWithoutChildren,
      prefix: <UserDeleteOutlined />,
      color: "#fa8c16",
    },
    {
      title: "Recent (30 days)",
      value: statistics.recentRegistrations,
      prefix: <CalendarOutlined />,
      color: "#52c41a",
    },
  ];

  return (
    <Row gutter={16}>
      {stats.map((stat, index) => (
        <Col span={4} key={index}>
          <Card>
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.prefix}
              valueStyle={{ color: stat.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
