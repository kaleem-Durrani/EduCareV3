import { Card, Row, Col, Select, InputNumber, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function FiltersSection({
  classes,
  selectedClass,
  selectedMonth,
  selectedYear,
  onClassChange,
  onMonthChange,
  onYearChange,
  onAddClick,
  getMonthName
}) {
  return (
    <Card title="Filters">
      <Row gutter={16}>
        <Col span={6}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Select Class
            </label>
            <Select
              style={{ width: "100%" }}
              placeholder="Choose a class"
              value={selectedClass?._id}
              onChange={onClassChange}
              showSearch
              optionFilterProp="children"
            >
              {classes.map((cls) => (
                <Option key={cls._id} value={cls._id}>
                  {cls.name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={6}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Month
            </label>
            <Select
              style={{ width: "100%" }}
              value={selectedMonth}
              onChange={onMonthChange}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <Option key={month} value={month}>
                  {getMonthName(month)}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={6}>
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Year
            </label>
            <InputNumber
              style={{ width: "100%" }}
              value={selectedYear}
              onChange={onYearChange}
              min={2000}
              max={2100}
            />
          </div>
        </Col>
        <Col span={6}>
          <div style={{ paddingTop: 32 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddClick}
              disabled={!selectedClass}
            >
              Create Plan
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
