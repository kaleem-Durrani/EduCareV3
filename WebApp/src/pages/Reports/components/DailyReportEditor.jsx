import React from "react";
import { Input, Card, Row, Col } from "antd";

const { TextArea } = Input;

export default function DailyReportEditor({ day, report, onReportChange }) {
  const handleFieldChange = (field, value) => {
    onReportChange(day, field, value);
  };

  const fields = [
    { key: "toilet", label: "Toilet", placeholder: "Record toilet activities..." },
    { key: "food_intake", label: "Food Intake", placeholder: "Record food intake..." },
    { key: "friends_interaction", label: "Friends Interaction", placeholder: "Record social interactions..." },
    { key: "studies_mood", label: "Studies Mood", placeholder: "Record studies and mood..." },
  ];

  return (
    <Card size="small" style={{ backgroundColor: "#fafafa" }}>
      <Row gutter={16}>
        {fields.map((field) => (
          <Col span={6} key={field.key}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ 
                display: "block", 
                marginBottom: 4, 
                fontWeight: 500,
                fontSize: "12px",
                textTransform: "capitalize"
              }}>
                {field.label}
              </label>
              <TextArea
                value={report[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                style={{ fontSize: "12px" }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
