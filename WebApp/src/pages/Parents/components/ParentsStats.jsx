import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

export default function ParentsStats({ parents }) {
  const totalParents = parents.length;
  const totalChildren = parents.reduce(
    (sum, parent) => sum + (parent.children?.length || 0),
    0
  );
  const averageChildren = totalParents > 0 
    ? Math.round((totalChildren / totalParents) * 10) / 10 
    : 0;

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Parents"
            value={totalParents}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Relations"
            value={totalChildren}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Average Children"
            value={averageChildren}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
