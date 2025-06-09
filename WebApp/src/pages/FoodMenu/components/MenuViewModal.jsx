import React from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Divider,
  Button,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

export default function MenuViewModal({ visible, onCancel, menu }) {
  if (!menu) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "draft":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "archived":
        return <InboxOutlined style={{ color: "#8c8c8c" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  // Filter out weekends and prepare data
  const menuDays = menu.menuData?.filter(
    (item) => item.day !== "Saturday" && item.day !== "Sunday"
  ) || [];

  const totalItems = menuDays.reduce((sum, day) => sum + (day.items?.length || 0), 0);
  const avgItemsPerDay = menuDays.length > 0 ? Math.round((totalItems / menuDays.length) * 10) / 10 : 0;

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          <span>Menu Details</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={
        <Button onClick={onCancel} size="large">
          Close
        </Button>
      }
      width={1000}
      destroyOnClose
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Menu Header */}
        <Card>
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                      {menu.title}
                    </Title>
                    {menu.description && (
                      <Paragraph style={{ margin: "8px 0 0 0", color: "#666" }}>
                        {menu.description}
                      </Paragraph>
                    )}
                  </div>
                  <Tag color={getStatusColor(menu.status)} icon={getStatusIcon(menu.status)} style={{ fontSize: "14px", padding: "4px 12px" }}>
                    {menu.status?.toUpperCase()}
                  </Tag>
                </div>
              </Space>
            </Col>
          </Row>

          <Divider />

          {/* Menu Info */}
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Card size="small" style={{ textAlign: "center", backgroundColor: "#f0f9ff" }}>
                <Space direction="vertical" size="small">
                  <CalendarOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                  <div>
                    <Text strong style={{ display: "block" }}>Menu Period</Text>
                    <Text type="secondary">
                      {dayjs(menu.startDate).format("MMM DD")} - {dayjs(menu.endDate).format("MMM DD, YYYY")}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" style={{ textAlign: "center", backgroundColor: "#f6ffed" }}>
                <Space direction="vertical" size="small">
                  <AppstoreOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
                  <div>
                    <Text strong style={{ display: "block" }}>Total Items</Text>
                    <Text type="secondary">{totalItems} items</Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" style={{ textAlign: "center", backgroundColor: "#fff7e6" }}>
                <Space direction="vertical" size="small">
                  <ClockCircleOutlined style={{ fontSize: "24px", color: "#faad14" }} />
                  <div>
                    <Text strong style={{ display: "block" }}>Avg Items/Day</Text>
                    <Text type="secondary">{avgItemsPerDay} items</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Daily Menus */}
        <Card title={<Space><AppstoreOutlined />Daily Menu Items</Space>}>
          {menuDays.length > 0 ? (
            <Row gutter={[16, 16]}>
              {menuDays.map((dayMenu) => (
                <Col span={24} key={dayMenu.day}>
                  <Card
                    size="small"
                    title={
                      <Space>
                        <CalendarOutlined style={{ color: "#1890ff" }} />
                        <Text strong style={{ color: "#1890ff" }}>{dayMenu.day}</Text>
                        <Tag color="blue">{dayMenu.items?.length || 0} items</Tag>
                      </Space>
                    }
                    style={{ backgroundColor: "#fafafa" }}
                  >
                    {dayMenu.items && dayMenu.items.length > 0 ? (
                      <Space size={[8, 8]} wrap>
                        {dayMenu.items.map((item, index) => (
                          <Tag key={index} color="geekblue" style={{ margin: "2px", padding: "4px 8px" }}>
                            {item}
                          </Tag>
                        ))}
                      </Space>
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No items for this day"
                        style={{ margin: "16px 0" }}
                      />
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="No menu data available"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Menu Metadata */}
        <Card title="Menu Information" size="small">
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text type="secondary">Created by:</Text>
              <br />
              <Space>
                <UserOutlined />
                <Text>{menu.createdBy?.name || "Unknown"}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Text type="secondary">Created on:</Text>
              <br />
              <Text>{dayjs(menu.createdAt).format("MMM DD, YYYY [at] HH:mm")}</Text>
            </Col>
            {menu.updatedBy && (
              <>
                <Col span={12}>
                  <Text type="secondary">Last updated by:</Text>
                  <br />
                  <Space>
                    <UserOutlined />
                    <Text>{menu.updatedBy?.name || "Unknown"}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Last updated:</Text>
                  <br />
                  <Text>{dayjs(menu.updatedAt).format("MMM DD, YYYY [at] HH:mm")}</Text>
                </Col>
              </>
            )}
          </Row>
        </Card>
      </Space>
    </Modal>
  );
}
