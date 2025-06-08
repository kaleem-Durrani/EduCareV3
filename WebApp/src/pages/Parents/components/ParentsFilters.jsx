import { Card, Row, Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ParentsFilters({ filters, onFilterChange }) {
  return (
    <Card title="Filters">
      <Row gutter={16}>
        <Col span={8}>
          <Input
            placeholder="Search parents..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            allowClear
          />
        </Col>
        <Col span={8}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) => onFilterChange("status", value)}
            allowClear
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Col>
      </Row>
    </Card>
  );
}
