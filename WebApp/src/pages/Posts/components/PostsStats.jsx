import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export default function PostsStats({ posts, overallStatistics }) {
  const totalPosts = overallStatistics.totalPosts || posts.length;
  const recentPosts = overallStatistics.recentPosts || 0;
  const postsWithImages = overallStatistics.postsWithImages || 0;
  const postsWithVideos = overallStatistics.postsWithVideos || 0;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Posts"
            value={totalPosts}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Recent Posts (30 days)"
            value={recentPosts}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Posts with Images"
            value={postsWithImages}
            prefix={<PictureOutlined />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Posts with Videos"
            value={postsWithVideos}
            prefix={<VideoCameraOutlined />}
            valueStyle={{ color: "#eb2f96" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
