import { Row, Col, Card, Statistic } from "antd";
import { DollarOutlined } from "@ant-design/icons";

export default function FeesStatistics({ statistics, loading }) {
  if (loading || !statistics) {
    return (
      <Row gutter={16}>
        {[1, 2, 3, 4].map((i) => (
          <Col span={6} key={i}>
            <Card loading={true}>
              <Statistic title="Loading..." value={0} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  const {
    totalFees,
    paidFees,
    unpaidFees,
    totalAmount,
    paidAmount,
    unpaidAmount,
  } = statistics;

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Fees"
            value={totalFees}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Paid Fees"
            value={paidFees}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Unpaid Fees"
            value={unpaidFees}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Amount"
            value={totalAmount}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#722ed1" }}
            precision={2}
          />
        </Card>
      </Col>
    </Row>
  );
}
