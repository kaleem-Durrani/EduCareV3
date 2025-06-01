import { Card, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PlanCard from "./PlanCard";

export default function PlansDisplay({
  selectedClass,
  loading,
  plans,
  selectedMonth,
  selectedYear,
  deleting,
  onEdit,
  onDelete,
  onAdd,
  getMonthName
}) {
  if (!selectedClass) {
    return (
      <Card>
        <Empty
          description="Please select a class to view monthly plans"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading plans...
        </div>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card>
        <Empty
          description={`No plans found for ${getMonthName(
            selectedMonth
          )} ${selectedYear}`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            Create First Plan
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card>
      <div>
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            plan={plan}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onEdit={onEdit}
            onDelete={onDelete}
            deleting={deleting}
            getMonthName={getMonthName}
          />
        ))}
      </div>
    </Card>
  );
}
