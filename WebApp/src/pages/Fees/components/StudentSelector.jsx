import { Card, Row, Col, Select, Button } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useStudentsContext } from "../../../context/StudentsContext";

export default function StudentSelector({
  selectedStudentId,
  onStudentChange,
  onAddFee,
}) {
  const { students, loading: studentsLoading } = useStudentsContext();

  // Find selected student from context
  const selectedStudent = students.find((s) => s.value === selectedStudentId);

  return (
    <Card title="Select Student">
      <Row gutter={16}>
        <Col span={12}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 500,
                color: "#262626",
              }}
            >
              Choose Student
            </label>
            <Select
              style={{
                width: "100%",
              }}
              placeholder="Choose a student to view fees"
              value={selectedStudentId}
              onChange={onStudentChange}
              showSearch
              optionFilterProp="label"
              size="large"
              // Visible frame styling
              className="visible-frame-select"
              options={students.map((student) => ({
                value: student.value,
                label: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserOutlined
                      style={{ marginRight: 8, color: "#1890ff" }}
                    />
                    {student.label}
                  </div>
                ),
              }))}
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ paddingTop: 32 }}>
            {selectedStudent && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddFee}
                size="large"
                style={{
                  borderRadius: "6px",
                  height: "40px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Add Fee for {selectedStudent.label}
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <style>{`
        .visible-frame-select .ant-select-selector {
          border: 2px solid #d9d9d9 !important;
          border-radius: 6px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          transition: all 0.3s ease !important;
        }

        .visible-frame-select .ant-select-selector:hover {
          border-color: #40a9ff !important;
          box-shadow: 0 4px 8px rgba(64, 169, 255, 0.2) !important;
        }

        .visible-frame-select.ant-select-focused .ant-select-selector {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </Card>
  );
}
