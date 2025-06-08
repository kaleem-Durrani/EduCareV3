import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  HeartOutlined,
  UserOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

export default function HealthStats({ statistics, loading }) {
  if (loading || !statistics) {
    return (
      <Row gutter={16}>
        {[1, 2, 3, 4].map((i) => (
          <Col span={6} key={i}>
            <Card loading={true}>
              <Statistic title="Loading..." value={0} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  const {
    totalStudents,
    studentsWithHealthInfo,
    studentsWithMetrics,
    totalMetrics,
    recentMetrics,
    healthInfoCoverage,
    metricsCoverage,
  } = statistics;

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Students"
            value={totalStudents}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Health Records"
            value={studentsWithHealthInfo}
            prefix={<HeartOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Students with Metrics"
            value={studentsWithMetrics}
            prefix={<LineChartOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Recent Metrics (30d)"
            value={recentMetrics}
            prefix={<LineChartOutlined />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
