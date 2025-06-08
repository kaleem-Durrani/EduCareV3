import React from "react";
import { Card, Row, Col, Select, DatePicker, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

export default function LostItemsFilters({ filters, onFilterChange }) {
  return (
    <Card title="Filters">
      <Row gutter={16}>
        <Col span={6}>
          <Input
            placeholder="Search items..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            allowClear
          />
        </Col>
        <Col span={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) => onFilterChange("status", value)}
            allowClear
          >
            <Option value="unclaimed">Unclaimed</Option>
            <Option value="claimed">Claimed</Option>
          </Select>
        </Col>
        <Col span={6}>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="From date"
            value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
            onChange={(date) =>
              onFilterChange("dateFrom", date?.format("YYYY-MM-DD") || "")
            }
          />
        </Col>
        <Col span={6}>
          <DatePicker
            style={{ width: "100%" }}
            placeholder="To date"
            value={filters.dateTo ? dayjs(filters.dateTo) : null}
            onChange={(date) =>
              onFilterChange("dateTo", date?.format("YYYY-MM-DD") || "")
            }
          />
        </Col>
      </Row>
    </Card>
  );
}
