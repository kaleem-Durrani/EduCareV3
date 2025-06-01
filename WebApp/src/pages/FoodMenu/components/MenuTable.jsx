import React from "react";
import { Table, Tag, Space, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export default function MenuTable({ menuData }) {
  const columns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      width: 150,
      render: (day) => (
        <Space>
          <CalendarOutlined />
          <Text strong>{day}</Text>
        </Space>
      ),
    },
    {
      title: "Menu Items",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <Space size={[0, 8]} wrap>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <Tag key={index} color="blue">
                {item}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No items</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Items Count",
      dataIndex: "items",
      key: "itemsCount",
      width: 120,
      render: (items) => (
        <Tag color={items?.length > 0 ? "green" : "default"}>
          {items?.length || 0} items
        </Tag>
      ),
    },
  ];

  // Filter out weekends and prepare data
  const tableData = menuData?.menuData?.filter(
    (item) => item.day !== "Saturday" && item.day !== "Sunday"
  ) || [];

  return (
    <div>
      {/* Menu Period Info */}
      {menuData?.startDate && menuData?.endDate && (
        <div style={{ marginBottom: 16, padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
          <Space>
            <Text strong>Menu Period:</Text>
            <Text>
              {dayjs(menuData.startDate).format("MMM DD, YYYY")} - {dayjs(menuData.endDate).format("MMM DD, YYYY")}
            </Text>
          </Space>
        </div>
      )}

      {/* Menu Table */}
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="day"
        pagination={false}
        size="middle"
        bordered
        rowClassName={(record, index) => 
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />

      <style jsx>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
}
