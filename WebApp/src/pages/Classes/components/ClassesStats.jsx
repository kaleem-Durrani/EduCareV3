import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { BookOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

export default function ClassesStats({ statistics, loading }) {
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
    totalClasses,
    activeClasses,
    totalStudents,
    totalTeachers,
    classesWithStudents,
    classesWithTeachers,
  } = statistics;

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Classes"
            value={totalClasses}
            prefix={<BookOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Active Classes"
            value={activeClasses}
            prefix={<BookOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Students"
            value={totalStudents}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Teachers"
            value={totalTeachers}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
