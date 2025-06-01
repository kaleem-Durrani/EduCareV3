import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Empty,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FileImageOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { planService, classService } from "../../services/index";
import AdminLayout from "../../components/Layout/AdminLayout";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function MonthlyPlansScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch classes data
  const { data: classesData, request: fetchClasses } = useApi(
    classService.getAllClasses
  );

  // Fetch plans data
  const {
    data: plansData,
    isLoading: loading,
    request: fetchPlans,
  } = useApi((params) =>
    planService.getMonthlyPlans(params.classId, params.month, params.year)
  );

  // Create plan API
  const { request: createPlanRequest, isLoading: creating } = useApi(
    planService.createMonthlyPlan
  );

  // Update plan API
  const { request: updatePlanRequest, isLoading: updating } = useApi(
    ({ id, data }) => planService.updateMonthlyPlan(id, data)
  );

  // Delete plan API
  const { request: deletePlanRequest, isLoading: deleting } = useApi(
    planService.deleteMonthlyPlan
  );

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchPlans({
        classId: selectedClass.id,
        month: selectedMonth,
        year: selectedYear,
      });
    }
  }, [selectedClass, selectedMonth, selectedYear]);

  const handleCreatePlan = async (values) => {
    try {
      const formData = new FormData();
      formData.append("class_id", selectedClass.id);
      formData.append("month", selectedMonth);
      formData.append("year", selectedYear);
      formData.append("description", values.description);

      if (values.image?.file) {
        formData.append("image", values.image.file);
      }

      await createPlanRequest(formData);
      message.success("Monthly plan created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchPlans({
        classId: selectedClass.id,
        month: selectedMonth,
        year: selectedYear,
      });
    } catch (error) {
      message.error("Failed to create monthly plan");
    }
  };

  const handleUpdatePlan = async (values) => {
    try {
      const formData = new FormData();
      formData.append("class_id", selectedClass.id);
      formData.append("month", selectedMonth);
      formData.append("year", selectedYear);
      formData.append("description", values.description);

      if (values.image?.file) {
        formData.append("image", values.image.file);
      }

      await updatePlanRequest({ id: editingPlan.planId, data: formData });
      message.success("Monthly plan updated successfully!");
      setIsModalVisible(false);
      setEditingPlan(null);
      form.resetFields();
      fetchPlans({
        classId: selectedClass.id,
        month: selectedMonth,
        year: selectedYear,
      });
    } catch (error) {
      message.error("Failed to update monthly plan");
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlanRequest(planId);
      message.success("Monthly plan deleted successfully!");
      fetchPlans({
        classId: selectedClass.id,
        month: selectedMonth,
        year: selectedYear,
      });
    } catch (error) {
      message.error("Failed to delete monthly plan");
    }
  };

  const handleSubmit = async (values) => {
    if (editingPlan) {
      await handleUpdatePlan(values);
    } else {
      await handleCreatePlan(values);
    }
  };

  const handleAdd = () => {
    setEditingPlan(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      description: plan.description,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPlan(null);
    form.resetFields();
  };

  const handleClassChange = (classId) => {
    const selectedClassObj = classesData?.classes?.find(
      (c) => c.id === classId
    );
    setSelectedClass(selectedClassObj);
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1];
  };

  const classes = classesData?.classes || [];
  const plans = plansData ? [plansData] : [];
  const totalPlans = plans.length;

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Monthly Plans Management</Title>
        </div>

        {/* Statistics Cards */}
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

        {/* Filters */}
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
                  value={selectedClass?.id}
                  onChange={handleClassChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {classes.map((cls) => (
                    <Option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade} {cls.section}
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
                  onChange={setSelectedMonth}
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
                  onChange={setSelectedYear}
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
                  onClick={handleAdd}
                  disabled={!selectedClass}
                >
                  Create Plan
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Plans Display */}
        <Card>
          {selectedClass ? (
            loading ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                Loading plans...
              </div>
            ) : plans.length > 0 ? (
              <div>
                {plans.map((plan, index) => (
                  <Card
                    key={index}
                    style={{ marginBottom: 16 }}
                    title={`Plan for ${getMonthName(
                      selectedMonth
                    )} ${selectedYear}`}
                    extra={
                      <Space>
                        <Button
                          type="primary"
                          ghost
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="primary"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeletePlan(plan.planId)}
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
                              src={`http://tallal.info:5500${plan.imageUrl}`}
                              alt="Monthly Plan"
                              style={{ borderRadius: 8 }}
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                description={`No plans found for ${getMonthName(
                  selectedMonth
                )} ${selectedYear}`}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  Create First Plan
                </Button>
              </Empty>
            )
          ) : (
            <Empty
              description="Please select a class to view monthly plans"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingPlan ? "Edit Monthly Plan" : "Create Monthly Plan"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="description"
              label="Plan Description"
              rules={[
                { required: true, message: "Please enter plan description!" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Enter detailed monthly plan description"
              />
            </Form.Item>

            <Form.Item name="image" label="Plan Image (Optional)">
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={() => false}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag image to upload</p>
                <p className="ant-upload-hint">
                  Support for single image upload
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={creating || updating}
                >
                  {editingPlan ? "Update" : "Create"} Plan
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AdminLayout>
  );
}
