import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  InboxOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function BoxItemsStats({
  students,
  boxItems,
  overallStatistics,
}) {
  const totalStudents = overallStatistics.totalStudents || students.length;
  const totalBoxItems = overallStatistics.totalBoxItems || boxItems.length;
  const totalItemsChecked = overallStatistics.totalItemsChecked || 0;
  const overallCompletion = overallStatistics.overallCompletion || 0;

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
            title="Items Checked"
            value={totalItemsChecked}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Completion"
            value={overallCompletion}
            suffix="%"
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{
              color: overallCompletion > 80 ? "#3f8600" : "#cf1322",
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}
