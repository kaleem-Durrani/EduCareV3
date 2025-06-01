import { Row, Col, Card, Statistic } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

export default function StatisticsCards({ 
  totalPlans, 
  selectedMonth, 
  selectedYear, 
  getMonthName 
}) {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="Total Plans"
            value={totalPlans}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Selected Month"
            value={getMonthName(selectedMonth)}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Selected Year"
            value={selectedYear}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
