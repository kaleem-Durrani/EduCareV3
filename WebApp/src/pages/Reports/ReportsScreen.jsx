import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Select,
  DatePicker,
  Empty,
} from "antd";
import {
  PlusOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { reportService, studentService } from "../../services/index";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import ReportsTable from "./components/ReportsTable";
import ReportFormModal from "./components/ReportFormModal";
import DailyReportDetailsModal from "./components/DailyReportDetailsModal";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ReportsScreen() {
  const { user } = useAuth();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch students data
  const {
    data: studentsData,
    request: fetchStudents,
  } = useApi(studentService.getAllStudents);

  // Fetch reports data
  const {
    data: reportsData,
    isLoading: loading,
    request: fetchReports,
  } = useApi((params) => reportService.getWeeklyReports(
    params.studentId,
    params.startDate,
    params.endDate,
    params.page,
    params.limit
  ));

  // Create report API
  const { request: createReportRequest, isLoading: creating } = useApi(
    reportService.createWeeklyReport
  );

  // Update report API
  const { request: updateReportRequest, isLoading: updating } = useApi(
    ({ id, data }) => reportService.updateWeeklyReport(id, data)
  );

  // Delete report API
  const { request: deleteReportRequest, isLoading: deleting } = useApi(
    reportService.deleteWeeklyReport
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const params = {
        studentId: selectedStudent._id,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        page: currentPage,
        limit: pageSize,
      };
      fetchReports(params);
    }
  }, [selectedStudent, dateRange, currentPage, pageSize]);

  const handleCreateReport = async (values) => {
    try {
      await createReportRequest(values);
      message.success("Report created successfully!");
      setIsCreateModalVisible(false);
      if (selectedStudent) {
        const params = {
          studentId: selectedStudent._id,
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
          page: currentPage,
          limit: pageSize,
        };
        fetchReports(params);
      }
    } catch (error) {
      message.error("Failed to create report");
    }
  };

  const handleUpdateReport = async (values) => {
    try {
      await updateReportRequest({ id: editingReport.reportId, data: values });
      message.success("Report updated successfully!");
      setIsEditModalVisible(false);
      setEditingReport(null);
      if (selectedStudent) {
        const params = {
          studentId: selectedStudent._id,
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
          page: currentPage,
          limit: pageSize,
        };
        fetchReports(params);
      }
    } catch (error) {
      message.error("Failed to update report");
    }
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (report) => {
    try {
      await deleteReportRequest(report._id);
      message.success("Report deleted successfully!");
      // Refresh the reports list
      if (selectedStudent) {
        const params = {
          studentId: selectedStudent._id,
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
          page: currentPage,
          limit: pageSize,
        };
        fetchReports(params);
      }
    } catch (error) {
      message.error("Failed to delete report");
    }
  };

  const handleViewDetails = (report) => {
    setViewingReport(report);
    setIsDetailsModalVisible(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setEditingReport(null);
  };

  const handleCancelDetails = () => {
    setIsDetailsModalVisible(false);
    setViewingReport(null);
  };

  const handleStudentChange = (studentId) => {
    const student = studentsData?.students?.find(s => s._id === studentId);
    setSelectedStudent(student);
    setCurrentPage(1); // Reset to first page when student changes
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1); // Reset to first page when date range changes
  };

  const handleTableChange = ({ page, pageSize: newPageSize }) => {
    setCurrentPage(page);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when page size changes
    }
  };

  // Calculate statistics
  const reports = reportsData?.reports || [];
  const pagination = reportsData?.pagination;
  const totalReports = pagination?.totalItems || reports.length;
  const totalDays = reports.reduce((sum, report) => sum + (report.dailyReports?.length || 0), 0);
  const avgDaysPerReport = totalReports > 0 ? Math.round(totalDays / totalReports * 10) / 10 : 0;

  const students = studentsData?.students || [];
  const isTeacher = user?.role === "teacher";

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Weekly Reports Management</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Reports"
                value={totalReports}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#3f8600" }}
                loading={loading && !reports.length}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Days Recorded"
                value={totalDays}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "#1890ff" }}
                loading={loading && !reports.length}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Avg Days/Report"
                value={avgDaysPerReport}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#722ed1" }}
                loading={loading && !reports.length}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card title="Filters">
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Select Student
                </label>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Choose a student"
                  value={selectedStudent?._id}
                  onChange={handleStudentChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {students.map((student) => (
                    <Option key={student._id} value={student._id}>
                      {student.fullName}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Date Range (Optional)
                </label>
                <RangePicker
                  style={{ width: "100%" }}
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  format="YYYY-MM-DD"
                />
              </div>
            </Col>
            <Col span={8}>
              <div style={{ paddingTop: 32 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                  Create Report
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Reports Table */}
        <Card>
          {selectedStudent ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <UserOutlined />
                  <span style={{ fontWeight: 500 }}>
                    Reports for: {selectedStudent.fullName}
                  </span>
                </Space>
              </div>
              
              <ReportsTable
                reports={reports}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                isTeacher={isTeacher}
                pagination={reportsData?.pagination}
                onTableChange={handleTableChange}
              />
            </div>
          ) : (
            <Empty
              description="Please select a student to view reports"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Create Report Modal */}
        <ReportFormModal
          visible={isCreateModalVisible}
          onCancel={handleCancelCreate}
          onSubmit={handleCreateReport}
          loading={creating}
          title="Create Weekly Report"
          mode="create"
          students={students}
        />

        {/* Edit Report Modal */}
        <ReportFormModal
          visible={isEditModalVisible}
          onCancel={handleCancelEdit}
          onSubmit={handleUpdateReport}
          loading={updating}
          title="Edit Weekly Report"
          mode="edit"
          students={students}
          initialData={editingReport}
        />

        {/* Daily Report Details Modal */}
        <DailyReportDetailsModal
          visible={isDetailsModalVisible}
          onCancel={handleCancelDetails}
          report={viewingReport}
        />
      </Space>
    </AdminLayout>
  );
}
