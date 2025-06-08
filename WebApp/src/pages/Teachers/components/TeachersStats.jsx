import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import { useClassesContext } from "../../../context/ClassesContext";

export default function TeachersStats({ statistics, loading }) {
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
    totalTeachers,
    activeTeachers,
    totalEnrollments,
    teachersWithClasses,
  } = statistics;

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Teachers"
            value={totalTeachers}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Active Teachers"
            value={activeTeachers}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Enrollments"
            value={totalEnrollments}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Teachers with Classes"
            value={teachersWithClasses}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
