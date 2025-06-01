import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { HeartOutlined, UserOutlined, LineChartOutlined } from "@ant-design/icons";

export default function HealthStats({ students, healthMetrics, healthInfos }) {
  const totalStudents = students.length;
  const studentsWithHealthInfo = healthInfos.length;
  const totalMetrics = healthMetrics.length;
  const coveragePercentage = totalStudents > 0 
    ? Math.round((studentsWithHealthInfo / totalStudents) * 100) 
    : 0;

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
            title="Health Metrics"
            value={totalMetrics}
            prefix={<LineChartOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Coverage"
            value={coveragePercentage}
            suffix="%"
            prefix={<HeartOutlined />}
            valueStyle={{ color: coveragePercentage > 80 ? "#3f8600" : "#cf1322" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
