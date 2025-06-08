import React, { useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import useApi from "../../../hooks/useApi";
import { studentService } from "../../../services/index";

export default function StudentsStats() {
  const {
    data: statistics,
    isLoading: loading,
    request: fetchStatistics,
  } = useApi(studentService.getStudentStatistics);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const stats = statistics || {
    totalStudents: 0,
    activeStudents: 0,
    studentsWithClasses: 0,
    totalClasses: 0,
  };

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Total Students"
            value={stats.totalStudents}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Active Students"
            value={stats.activeStudents}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Students with Classes"
            value={stats.studentsWithClasses}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Total Classes"
            value={stats.totalClasses}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
