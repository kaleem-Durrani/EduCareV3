import { Card, Row, Col, Statistic, Skeleton } from "antd";
import {
  FileTextOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
} from "@ant-design/icons";

export default function PostsStatistics({ statistics, loading }) {
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
      title: "Total Posts",
      value: statistics.totalPosts || 0,
      prefix: <FileTextOutlined />,
      color: "#3f8600",
    },
    {
      title: "Public Posts",
      value: statistics.publicPosts || 0,
      prefix: <GlobalOutlined />,
      color: "#1890ff",
    },
    {
      title: "Class Posts",
      value: statistics.classPosts || 0,
      prefix: <TeamOutlined />,
      color: "#722ed1",
    },
    {
      title: "Individual Posts",
      value: statistics.individualPosts || 0,
      prefix: <UserOutlined />,
      color: "#fa8c16",
    },
    {
      title: "Recent (30 days)",
      value: statistics.recentPosts || 0,
      prefix: <CalendarOutlined />,
      color: "#52c41a",
    },
    {
      title: "Total Views",
      value: statistics.totalViews || 0,
      prefix: <EyeOutlined />,
      color: "#eb2f96",
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
