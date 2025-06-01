import { useState, useEffect } from "react";
import { Space, Typography, Form, message } from "antd";
import useApi from "../../hooks/useApi";
import { planService, classService } from "../../services/index";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  StatisticsCards,
  FiltersSection,
  PlansDisplay,
  PlanModal,
} from "./components";

const { Title } = Typography;

export default function MonthlyPlansScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    planService.getMonthlyPlan(params.classId, {
      month: params.month,
      year: params.year,
    })
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
        classId: selectedClass._id,
        month: selectedMonth,
        year: selectedYear,
      });
    }
  }, [selectedClass, selectedMonth, selectedYear]);

  const handleCreatePlan = async (values) => {
    try {
      console.log("Form values:", values);
      setUploading(true);

      const formData = new FormData();
      formData.append("class_id", selectedClass._id);
      formData.append("month", selectedMonth);
      formData.append("year", selectedYear);
      formData.append("description", values.description);

      // Handle file upload - check different possible structures
      let fileToUpload = null;
      if (values.image?.file) {
        fileToUpload = values.image.file;
      } else if (values.image?.fileList?.[0]?.originFileObj) {
        fileToUpload = values.image.fileList[0].originFileObj;
      } else if (uploadedFile) {
        fileToUpload = uploadedFile;
      }

      if (fileToUpload) {
        console.log("File to upload:", fileToUpload);
        formData.append("image", fileToUpload);
      } else {
        console.log("No file selected");
      }

      // Debug FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      await createPlanRequest(formData);
      message.success("Monthly plan created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setUploadedFile(null);
      fetchPlans({
        classId: selectedClass._id,
        month: selectedMonth,
        year: selectedYear,
      });
    } catch (error) {
      console.error("Create plan error:", error);
      message.error("Failed to create monthly plan");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePlan = async (values) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("description", values.description);

      // Handle file upload - use same logic as create
      let fileToUpload = null;
      if (values.image?.file) {
        fileToUpload = values.image.file;
      } else if (values.image?.fileList?.[0]?.originFileObj) {
        fileToUpload = values.image.fileList[0].originFileObj;
      } else if (uploadedFile) {
        fileToUpload = uploadedFile;
      }

      if (fileToUpload) {
        console.log("File to upload for update:", fileToUpload);
        formData.append("image", fileToUpload);
      }

      await updatePlanRequest({ id: editingPlan._id, data: formData });
      message.success("Monthly plan updated successfully!");
      setIsModalVisible(false);
      setEditingPlan(null);
      form.resetFields();
      setUploadedFile(null);
      fetchPlans({
        classId: selectedClass._id,
        month: selectedMonth,
        year: selectedYear,
      });
    } catch (error) {
      console.error("Update plan error:", error);
      message.error("Failed to update monthly plan");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlanRequest(planId);
      message.success("Monthly plan deleted successfully!");
      fetchPlans({
        classId: selectedClass._id,
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
    setUploadedFile(null);
    setUploading(false);
    form.resetFields();
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  const handleFileChange = (info) => {
    if (info.fileList.length > 0) {
      setUploadedFile(info.fileList[0].originFileObj);
    } else {
      setUploadedFile(null);
    }
  };

  const handleClassChange = (classId) => {
    const selectedClassObj = classesData?.find((c) => c._id === classId);
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

  const classes = classesData || [];
  const plans = plansData ? [plansData] : [];
  const totalPlans = plans.length;

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Monthly Plans Management</Title>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards
          totalPlans={totalPlans}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          getMonthName={getMonthName}
        />

        {/* Filters */}
        <FiltersSection
          classes={classes}
          selectedClass={selectedClass}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onClassChange={handleClassChange}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onAddClick={handleAdd}
          getMonthName={getMonthName}
        />

        {/* Plans Display */}
        <PlansDisplay
          selectedClass={selectedClass}
          loading={loading}
          plans={plans}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          deleting={deleting}
          onEdit={handleEdit}
          onDelete={handleDeletePlan}
          onAdd={handleAdd}
          getMonthName={getMonthName}
        />

        {/* Add/Edit Modal */}
        <PlanModal
          isVisible={isModalVisible}
          editingPlan={editingPlan}
          form={form}
          selectedMonth={selectedMonth}
          uploading={uploading}
          creating={creating}
          updating={updating}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onFileSelect={handleFileSelect}
          onFileChange={handleFileChange}
          getMonthName={getMonthName}
        />
      </Space>
    </AdminLayout>
  );
}
