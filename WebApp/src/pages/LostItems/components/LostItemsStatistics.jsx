import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { InboxOutlined } from "@ant-design/icons";

export default function LostItemsStatistics({ statistics, loading }) {
  // Use statistics from API if available, otherwise show loading state
  const totalItems = statistics?.totalItems || 0;
  const claimedItems = statistics?.claimedItems || 0;
  const unclaimedItems = statistics?.unclaimedItems || 0;
  const recentItems = statistics?.recentItems || 0;
  const itemsThisMonth = statistics?.itemsThisMonth || 0;
  const claimRate = statistics?.claimRate || 0;

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Items"
            value={totalItems}
            prefix={<InboxOutlined />}
            valueStyle={{ color: "#3f8600" }}
            loading={loading}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Unclaimed Items"
            value={unclaimedItems}
            prefix={<InboxOutlined />}
            valueStyle={{ color: "#cf1322" }}
            loading={loading}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Claimed Items"
            value={claimedItems}
            prefix={<InboxOutlined />}
            valueStyle={{ color: "#1890ff" }}
            loading={loading}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Claim Rate"
            value={claimRate}
            suffix="%"
            prefix={<InboxOutlined />}
            valueStyle={{ color: "#722ed1" }}
            loading={loading}
          />
        </Card>
      </Col>
    </Row>
  );
}
