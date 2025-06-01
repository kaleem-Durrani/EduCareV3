import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { BookOutlined, TeamOutlined } from "@ant-design/icons";

export default function ClassesStats({ classes }) {
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
  const averageClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Classes"
            value={totalClasses}
            prefix={<BookOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Students"
            value={totalStudents}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Average Class Size"
            value={averageClassSize}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
