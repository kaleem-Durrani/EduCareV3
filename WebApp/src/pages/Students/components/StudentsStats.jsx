import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function StudentsStats({ students }) {
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const inactiveStudents = totalStudents - activeStudents;

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Students"
            value={totalStudents}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Active Students"
            value={activeStudents}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Inactive Students"
            value={inactiveStudents}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
