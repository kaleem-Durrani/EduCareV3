import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { 
  InboxOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";

export default function BoxItemsStats({ students, boxItems, studentBoxStatuses }) {
  const totalStudents = students.length;
  const totalBoxItems = boxItems.length;
  const studentsWithBoxStatus = studentBoxStatuses.length;
  
  // Calculate total items in stock across all students
  const totalItemsInStock = studentBoxStatuses.reduce((total, status) => {
    if (status.items && Array.isArray(status.items)) {
      return total + status.items.filter(item => item.has_item).length;
    }
    return total;
  }, 0);

  const coveragePercentage = totalStudents > 0 
    ? Math.round((studentsWithBoxStatus / totalStudents) * 100) 
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
            title="Box Item Types"
            value={totalBoxItems}
            prefix={<InboxOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Items In Stock"
            value={totalItemsInStock}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Coverage"
            value={coveragePercentage}
            suffix="%"
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: coveragePercentage > 80 ? "#3f8600" : "#cf1322" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
