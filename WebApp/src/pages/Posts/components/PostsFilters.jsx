import { Card, Row, Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function PostsFilters({ filters, onFilterChange }) {
  return (
    <Card title="Filters">
      <Row gutter={16}>
        <Col span={8}>
          <Input
            placeholder="Search posts..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            allowClear
          />
        </Col>
        <Col span={8}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by audience"
            value={filters.audience}
            onChange={(value) => onFilterChange("audience", value)}
            allowClear
          >
            <Option value="all">Everyone</Option>
            <Option value="class">Classes</Option>
            <Option value="individual">Individual Students</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by teacher"
            value={filters.teacher}
            onChange={(value) => onFilterChange("teacher", value)}
            allowClear
          >
            {/* This would be populated with teachers from context */}
            <Option value="teacher1">Teacher 1</Option>
            <Option value="teacher2">Teacher 2</Option>
          </Select>
        </Col>
      </Row>
    </Card>
  );
}
