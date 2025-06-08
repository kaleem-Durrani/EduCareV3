import { Card, Row, Col, Button, Space, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SERVER_URL } from "../../../services/index";

export default function PlanCard({
  plan,
  selectedMonth,
  selectedYear,
  onEdit,
  onDelete,
  deleting,
  getMonthName,
}) {
  return (
    <Card
      style={{ marginBottom: 16 }}
      title={`Plan for ${getMonthName(selectedMonth)} ${selectedYear}`}
      extra={
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => onEdit(plan)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(plan._id)}
            loading={deleting}
          >
            Delete
          </Button>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={16}>
          <div>
            <h4>Description:</h4>
            <p>{plan.description}</p>
          </div>
        </Col>
        <Col span={8}>
          {plan.imageUrl && (
            <div>
              <h4>Plan Image:</h4>
              <Image
                width={200}
                src={`${SERVER_URL}/${plan.imageUrl}`}
                alt="Monthly Plan"
                style={{ borderRadius: 8 }}
              />
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
}
