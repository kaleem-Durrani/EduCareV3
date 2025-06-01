import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { boxService, studentService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import { BoxItemsStats, StudentsBoxTable, BoxStatusModal } from "./components";

const { Title } = Typography;

export default function BoxItemsScreen() {
  const [isBoxStatusModalVisible, setIsBoxStatusModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [boxStatusMode, setBoxStatusMode] = useState("view"); // "view", "edit"
  const [currentBoxStatus, setCurrentBoxStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch students
  const {
    data: studentsData,
    request: fetchStudents,
    isLoading: loadingStudents,
  } = useApi(studentService.getAllStudents);

  // Fetch box items
  const {
    data: boxItemsData,
    request: fetchBoxItems,
    isLoading: loadingBoxItems,
  } = useApi(boxService.getBoxItems);

  // Get student box status API
  const { request: getStudentBoxStatusRequest, isLoading: loadingBoxStatus } =
    useApi(boxService.getStudentBoxStatus, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Load Box Status",
      },
    });

  // Update student box status API
  const {
    request: updateStudentBoxStatusRequest,
    isLoading: updatingBoxStatus,
  } = useApi(
    ({ studentId, statusData }) =>
      boxService.updateStudentBoxStatus(studentId, statusData),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Box Status",
      },
    }
  );

  useEffect(() => {
    fetchStudents();
    fetchBoxItems();
  }, []);

  const students = studentsData || [];
  const boxItems = boxItemsData || [];
  const studentBoxStatuses = []; // Will be populated as we fetch individual statuses

  const handleViewBoxStatus = async (student) => {
    setSelectedStudent(student);
    setBoxStatusMode("view");

    try {
      const boxStatus = await getStudentBoxStatusRequest(student._id);
      setCurrentBoxStatus(boxStatus);
      setIsBoxStatusModalVisible(true);
    } catch (error) {
      // If no box status exists, show empty state
      setCurrentBoxStatus(null);
      setIsBoxStatusModalVisible(true);
    }
  };

  const handleEditBoxStatus = async (student) => {
    setSelectedStudent(student);
    setBoxStatusMode("edit");

    try {
      const boxStatus = await getStudentBoxStatusRequest(student._id);
      setCurrentBoxStatus(boxStatus);
      setIsBoxStatusModalVisible(true);
    } catch (error) {
      // If no box status exists, show create mode
      setCurrentBoxStatus(null);
      setIsBoxStatusModalVisible(true);
    }
  };

  const handleUpdateBoxStatus = async (values) => {
    try {
      await updateStudentBoxStatusRequest({
        studentId: selectedStudent._id,
        statusData: values,
      });
      message.success("Box status updated successfully!");
      setIsBoxStatusModalVisible(false);
      setCurrentBoxStatus(null);
      fetchStudents(); // Refresh data
    } catch (error) {
      console.log("Update box status error handled by useApi");
    }
  };

  const handleCancelBoxStatus = () => {
    setIsBoxStatusModalVisible(false);
    setCurrentBoxStatus(null);
    setSelectedStudent(null);
  };

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Box Items Management</Title>
        </div>

        {/* Statistics Cards */}
        <BoxItemsStats
          students={students}
          boxItems={boxItems}
          studentBoxStatuses={studentBoxStatuses}
        />

        {/* Students Box Table */}
        <StudentsBoxTable
          students={students}
          loading={loadingStudents}
          currentPage={currentPage}
          pageSize={pageSize}
          total={studentsData?.total || 0}
          onPageChange={setCurrentPage}
          onViewBoxStatus={handleViewBoxStatus}
          onEditBoxStatus={handleEditBoxStatus}
        />

        {/* Box Status Modal */}
        <BoxStatusModal
          visible={isBoxStatusModalVisible}
          onCancel={handleCancelBoxStatus}
          onSubmit={handleUpdateBoxStatus}
          loading={updatingBoxStatus}
          selectedStudent={selectedStudent}
          boxItems={boxItems}
          currentBoxStatus={currentBoxStatus}
          mode={boxStatusMode}
        />
      </Space>
    </AdminLayout>
  );
}
