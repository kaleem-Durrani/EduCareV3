import React, { useState, useEffect } from "react";
import { Space, Typography, message, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { documentService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  DocumentsStats,
  StudentsDocumentsTable,
  DocumentTypesModal,
  StudentDocumentsModal,
} from "./components";

const { Title } = Typography;

export default function DocumentsScreen() {
  const [isDocumentTypesModalVisible, setIsDocumentTypesModalVisible] =
    useState(false);
  const [isStudentDocumentsModalVisible, setIsStudentDocumentsModalVisible] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [documentsMode, setDocumentsMode] = useState("view"); // "view", "edit"
  const [currentDocuments, setCurrentDocuments] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDocTypePage, setCurrentDocTypePage] = useState(1);
  const pageSize = 10;

  // Fetch paginated students (EFFICIENT!)
  const {
    data: paginatedStudentsData,
    request: fetchPaginatedStudents,
    isLoading: loadingStudents,
  } = useApi(documentService.getPaginatedStudentsDocuments);

  // Fetch document statistics (SEPARATE ENDPOINT!)
  const {
    data: statisticsData,
    request: fetchStatistics,
    isLoading: loadingStatistics,
  } = useApi(documentService.getDocumentStatistics);

  // Fetch document types (for dropdowns - all types)
  const {
    data: documentTypesData,
    request: fetchDocumentTypes,
    isLoading: loadingDocumentTypes,
  } = useApi(documentService.getDocumentTypes);

  // Fetch paginated document types (for modal)
  const {
    data: paginatedDocTypesData,
    request: fetchPaginatedDocumentTypes,
    isLoading: loadingPaginatedDocTypes,
  } = useApi(documentService.getPaginatedDocumentTypes);

  // Get student documents API
  const { request: getStudentDocumentsRequest, isLoading: loadingDocuments } =
    useApi(documentService.getStudentDocuments, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Load Student Documents",
      },
    });

  // Update student documents API
  const {
    request: updateStudentDocumentsRequest,
    isLoading: updatingDocuments,
  } = useApi(
    ({ studentId, documentsData }) =>
      documentService.updateStudentDocuments(studentId, documentsData),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Student Documents",
      },
    }
  );

  // Create document type API
  const {
    request: createDocumentTypeRequest,
    isLoading: creatingDocumentType,
  } = useApi(documentService.createDocumentType, {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      showValidationDetails: true,
      title: "Failed to Create Document Type",
    },
  });

  // Update document type API
  const {
    request: updateDocumentTypeRequest,
    isLoading: updatingDocumentType,
  } = useApi(
    ({ typeId, typeData }) =>
      documentService.updateDocumentType(typeId, typeData),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Document Type",
      },
    }
  );

  // Delete document type API
  const {
    request: deleteDocumentTypeRequest,
    isLoading: deletingDocumentType,
  } = useApi(documentService.deleteDocumentType, {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      showValidationDetails: true,
      title: "Failed to Delete Document Type",
    },
  });

  // Fetch data with pagination support
  const fetchData = () => {
    fetchPaginatedStudents(currentPage, pageSize);
    fetchStatistics(); // Only when needed (frontend controlled!)
    fetchDocumentTypes();
  };

  // Fetch document types modal data
  const fetchDocTypesModalData = () => {
    fetchPaginatedDocumentTypes(currentDocTypePage, pageSize);
  };

  // Refresh statistics only (when data changes)
  const refreshStatistics = () => {
    fetchStatistics();
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Refetch when page changes

  useEffect(() => {
    fetchData();
  }, []); // Initial load

  // Fetch document types modal data when modal opens or page changes
  useEffect(() => {
    if (isDocumentTypesModalVisible) {
      fetchDocTypesModalData();
    }
  }, [isDocumentTypesModalVisible, currentDocTypePage]);

  const students = paginatedStudentsData?.students || [];
  const pagination = paginatedStudentsData?.pagination || {};
  const documentTypes = documentTypesData || [];
  const overallStatistics = statisticsData || {};

  // Document types modal data
  const modalDocumentTypes = paginatedDocTypesData?.documentTypes || [];
  const docTypesPagination = paginatedDocTypesData?.pagination || {};

  const handleViewDocuments = async (student) => {
    setSelectedStudent(student);
    setDocumentsMode("view");

    try {
      const documents = await getStudentDocumentsRequest(student._id);
      setCurrentDocuments(documents);
      setIsStudentDocumentsModalVisible(true);
    } catch (error) {
      // If no documents exist, show empty state
      setCurrentDocuments(null);
      setIsStudentDocumentsModalVisible(true);
    }
  };

  const handleEditDocuments = async (student) => {
    setSelectedStudent(student);
    setDocumentsMode("edit");

    try {
      const documents = await getStudentDocumentsRequest(student._id);
      setCurrentDocuments(documents);
      setIsStudentDocumentsModalVisible(true);
    } catch (error) {
      // If no documents exist, show create mode
      setCurrentDocuments(null);
      setIsStudentDocumentsModalVisible(true);
    }
  };

  const handleUpdateStudentDocuments = async (values) => {
    try {
      await updateStudentDocumentsRequest({
        studentId: selectedStudent._id,
        documentsData: values,
      });
      message.success("Student documents updated successfully!");
      setIsStudentDocumentsModalVisible(false);
      setCurrentDocuments(null);
      // Refresh current page students AND statistics
      fetchPaginatedStudents(currentPage, pageSize);
      fetchStatistics();
    } catch (error) {
      console.log("Update student documents error handled by useApi");
    }
  };

  const handleCreateDocumentType = async (values) => {
    try {
      await createDocumentTypeRequest(values);
      fetchDocumentTypes(); // Refresh document types dropdown
      fetchDocTypesModalData(); // Refresh modal table
      fetchStatistics(); // Refresh statistics since document types changed
    } catch (error) {
      console.log("Create document type error handled by useApi");
    }
  };

  const handleUpdateDocumentType = async (typeId, values) => {
    try {
      await updateDocumentTypeRequest({ typeId, typeData: values });
      fetchDocumentTypes(); // Refresh document types dropdown
      fetchDocTypesModalData(); // Refresh modal table
      fetchStatistics(); // Refresh statistics since document types changed
    } catch (error) {
      console.log("Update document type error handled by useApi");
    }
  };

  const handleDeleteDocumentType = async (typeId) => {
    try {
      await deleteDocumentTypeRequest(typeId);
      fetchDocumentTypes(); // Refresh document types dropdown
      fetchDocTypesModalData(); // Refresh modal table
      fetchStatistics(); // Refresh statistics since document types changed
    } catch (error) {
      console.log("Delete document type error handled by useApi");
    }
  };

  const handleCancelStudentDocuments = () => {
    setIsStudentDocumentsModalVisible(false);
    setCurrentDocuments(null);
    setSelectedStudent(null);
  };

  const handleCancelDocumentTypes = () => {
    setIsDocumentTypesModalVisible(false);
  };

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>Documents Management</Title>
          <Button
            type="default"
            icon={<SettingOutlined />}
            onClick={() => setIsDocumentTypesModalVisible(true)}
          >
            Manage Document Types
          </Button>
        </div>

        {/* Statistics Cards */}
        <DocumentsStats
          students={students}
          documentTypes={documentTypes}
          overallStatistics={overallStatistics}
        />

        {/* Students Documents Table */}
        <StudentsDocumentsTable
          students={students}
          loading={loadingStudents}
          currentPage={currentPage}
          pageSize={pageSize}
          total={pagination.totalStudents || 0}
          documentTypes={documentTypes}
          onPageChange={setCurrentPage}
          onViewDocuments={handleViewDocuments}
          onEditDocuments={handleEditDocuments}
        />

        {/* Document Types Modal */}
        <DocumentTypesModal
          visible={isDocumentTypesModalVisible}
          onCancel={handleCancelDocumentTypes}
          onCreateType={handleCreateDocumentType}
          onUpdateType={handleUpdateDocumentType}
          onDeleteType={handleDeleteDocumentType}
          loading={
            creatingDocumentType || updatingDocumentType || deletingDocumentType
          }
          documentTypes={modalDocumentTypes}
          pagination={docTypesPagination}
          onPageChange={setCurrentDocTypePage}
          loadingTypes={loadingPaginatedDocTypes}
        />

        {/* Student Documents Modal */}
        <StudentDocumentsModal
          visible={isStudentDocumentsModalVisible}
          onCancel={handleCancelStudentDocuments}
          onSubmit={handleUpdateStudentDocuments}
          loading={updatingDocuments}
          selectedStudent={selectedStudent}
          documentTypes={documentTypes}
          currentDocuments={currentDocuments}
          mode={documentsMode}
        />
      </Space>
    </AdminLayout>
  );
}
