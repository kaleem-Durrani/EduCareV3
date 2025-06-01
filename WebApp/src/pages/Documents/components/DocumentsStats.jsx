import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function DocumentsStats({
  students,
  documentTypes,
  overallStatistics,
}) {
  const totalStudents = overallStatistics.totalStudents || students.length;
  const totalDocumentTypes =
    overallStatistics.totalDocumentTypes || documentTypes.length;
  const totalDocumentsSubmitted =
    overallStatistics.totalDocumentsSubmitted || 0;
  const compliancePercentage = overallStatistics.overallCompliance || 0;

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
            title="Document Types"
            value={totalDocumentTypes}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Documents Submitted"
            value={totalDocumentsSubmitted}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Compliance"
            value={compliancePercentage}
            suffix="%"
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{
              color: compliancePercentage > 80 ? "#3f8600" : "#cf1322",
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}
