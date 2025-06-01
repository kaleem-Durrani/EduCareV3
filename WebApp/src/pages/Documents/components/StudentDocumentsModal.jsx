import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Button,
  Space,
  Card,
  Row,
  Col,
  Switch,
  Input,
  DatePicker,
  Divider,
  Tag,
  Alert,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function StudentDocumentsModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedStudent,
  documentTypes = [],
  currentDocuments = null,
  mode = "view", // "view", "edit"
}) {
  const [form] = Form.useForm();
  const [documentStatuses, setDocumentStatuses] = useState({});

  useEffect(() => {
    if (visible && currentDocuments) {
      // Initialize form with current document status
      const statusMap = {};
      const formValues = {};

      if (
        currentDocuments.documents &&
        Array.isArray(currentDocuments.documents)
      ) {
        currentDocuments.documents.forEach((doc) => {
          // Handle both populated and non-populated document_type_id
          const docTypeId =
            typeof doc.document_type_id === "object"
              ? doc.document_type_id._id
              : doc.document_type_id;
          statusMap[docTypeId] = doc.submitted;
          formValues[`${docTypeId}_notes`] = doc.notes || "";
          formValues[`${docTypeId}_date`] = doc.submission_date
            ? dayjs(doc.submission_date)
            : null;
        });
      }

      setDocumentStatuses(statusMap);
      form.setFieldsValue(formValues);
    } else if (visible) {
      // Initialize with all documents as false
      const statusMap = {};
      if (documentTypes && Array.isArray(documentTypes)) {
        documentTypes.forEach((type) => {
          statusMap[type._id] = false;
        });
      }
      setDocumentStatuses(statusMap);
      form.resetFields();
    }
  }, [visible, currentDocuments, documentTypes, form]);

  const handleDocumentToggle = (docTypeId, checked) => {
    setDocumentStatuses((prev) => ({
      ...prev,
      [docTypeId]: checked,
    }));
  };

  const handleSubmit = async (values) => {
    // Convert form data to the format expected by backend
    const documents = documentTypes
      ? documentTypes.map((type) => ({
          document_type_id: type._id,
          submitted: documentStatuses[type._id] || false,
          submission_date: values[`${type._id}_date`]
            ? values[`${type._id}_date`].format("YYYY-MM-DD")
            : null,
          notes: values[`${type._id}_notes`] || "",
        }))
      : [];

    await onSubmit({ documents });
  };

  const handleCancel = () => {
    form.resetFields();
    setDocumentStatuses({});
    onCancel();
  };

  const isReadOnly = mode === "view";
  const title =
    mode === "view"
      ? `Documents - ${selectedStudent?.fullName}`
      : `Edit Documents - ${selectedStudent?.fullName}`;

  // Calculate statistics
  const totalDocs = documentTypes ? documentTypes.length : 0;
  const submittedDocs = Object.values(documentStatuses).filter(Boolean).length;
  const requiredDocs = documentTypes
    ? documentTypes.filter((type) => type.required)
    : [];
  const submittedRequiredDocs = requiredDocs.filter(
    (type) => documentStatuses[type._id]
  ).length;
  const completionPercentage =
    totalDocs > 0 ? Math.round((submittedDocs / totalDocs) * 100) : 0;

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={
        isReadOnly
          ? [
              <Button key="close" onClick={handleCancel}>
                Close
              </Button>,
            ]
          : null
      }
      width={900}
      destroyOnClose
    >
      {/* Summary Card */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: "center" }}>
              <FileTextOutlined
                style={{ fontSize: "24px", color: "#1890ff" }}
              />
              <div style={{ marginTop: "8px" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {totalDocs}
                </div>
                <div style={{ color: "#666" }}>Total Documents</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: "center" }}>
              <CheckCircleOutlined
                style={{ fontSize: "24px", color: "#52c41a" }}
              />
              <div style={{ marginTop: "8px" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {submittedDocs}
                </div>
                <div style={{ color: "#666" }}>Submitted</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: "center" }}>
              <CloseCircleOutlined
                style={{ fontSize: "24px", color: "#ff4d4f" }}
              />
              <div style={{ marginTop: "8px" }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {totalDocs - submittedDocs}
                </div>
                <div style={{ color: "#666" }}>Missing</div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color:
                    requiredDocs.length === submittedRequiredDocs
                      ? "#52c41a"
                      : "#ff4d4f",
                }}
              >
                {submittedRequiredDocs}/{requiredDocs.length}
              </div>
              <div style={{ color: "#666" }}>Required Docs</div>
            </div>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: "center" }}>
          <Tag
            color={
              completionPercentage === 100
                ? "green"
                : completionPercentage > 50
                ? "blue"
                : "red"
            }
          >
            {completionPercentage}% Complete
          </Tag>
        </div>
      </Card>

      {/* Documents List */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isReadOnly}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {documentTypes &&
            documentTypes.map((type) => (
              <Card
                key={type._id}
                size="small"
                style={{
                  marginBottom: 8,
                  border: documentStatuses[type._id]
                    ? "1px solid #52c41a"
                    : "1px solid #d9d9d9",
                }}
              >
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <Space>
                      <Switch
                        checked={documentStatuses[type._id] || false}
                        onChange={(checked) =>
                          handleDocumentToggle(type._id, checked)
                        }
                        disabled={isReadOnly}
                      />
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {type.name}
                          {type.required && (
                            <Tag
                              color="red"
                              size="small"
                              style={{ marginLeft: 4 }}
                            >
                              Required
                            </Tag>
                          )}
                        </div>
                        {type.description && (
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {type.description}
                          </div>
                        )}
                      </div>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={`${type._id}_date`}
                      label="Submission Date"
                      style={{ margin: 0 }}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        disabled={isReadOnly || !documentStatuses[type._id]}
                        placeholder="Select date"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={`${type._id}_notes`}
                      label="Notes"
                      style={{ margin: 0 }}
                    >
                      <TextArea
                        placeholder="Add notes..."
                        rows={1}
                        disabled={isReadOnly}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
        </div>

        {!isReadOnly && (
          <>
            <Divider />
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Documents
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>

      {/* Last Updated Info */}
      {currentDocuments && currentDocuments.updatedAt && (
        <Alert
          message={`Last updated: ${new Date(
            currentDocuments.updatedAt
          ).toLocaleString()}`}
          type="info"
          style={{ marginTop: 16 }}
          showIcon
        />
      )}
    </Modal>
  );
}
