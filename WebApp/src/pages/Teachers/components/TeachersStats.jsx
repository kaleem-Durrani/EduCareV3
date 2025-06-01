import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

export default function TeachersStats({ teachers, classes }) {
  const totalTeachers = teachers.length;
  const totalEnrollments = teachers.reduce(
    (sum, teacher) => sum + (teacher.classes?.length || 0),
    0
  );
  const availableClasses = classes.length;

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Teachers"
            value={totalTeachers}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Enrollments"
            value={totalEnrollments}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Available Classes"
            value={availableClasses}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
