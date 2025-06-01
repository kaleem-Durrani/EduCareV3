import React, { useState, useEffect } from "react";
import { Space, Typography, message } from "antd";
import useApi from "../../hooks/useApi";
import { parentService, authService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  ParentsStats,
  ParentsTable,
  CreateParentModal,
  CreateRelationModal,
} from "./components";

const { Title } = Typography;

export default function ParentsScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isRelationModalVisible, setIsRelationModalVisible] = useState(false);
  const [selectedParentEmail, setSelectedParentEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch parents data
  const {
    data: parentsData,
    isLoading: loading,
    request: fetchParents,
  } = useApi(() =>
    parentService.getAllParents({ page: currentPage, per_page: pageSize })
  );

  // Create parent API with enhanced validation error handling
  const { request: createParentRequest, isLoading: creating } = useApi(
    (data) => authService.register({ ...data, role: "parent" }),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Parent",
      },
    }
  );

  // Create relation API with enhanced validation error handling
  const { request: createRelationRequest, isLoading: creatingRelation } =
    useApi(parentService.createStudentParentRelation, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Relation",
      },
    });

  useEffect(() => {
    fetchParents();
  }, [currentPage]);

  const handleCreateParent = async (values) => {
    try {
      await createParentRequest(values);
      message.success("Parent created successfully!");
      setIsCreateModalVisible(false);
      fetchParents();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create parent error handled by useApi");
    }
  };

  const handleCreateRelation = async (values) => {
    try {
      await createRelationRequest(values);
      message.success("Parent-student relation created successfully!");
      setIsRelationModalVisible(false);
      setSelectedParentEmail(null);
      fetchParents();
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create relation error handled by useApi");
    }
  };

  const handleAddParent = () => {
    setIsCreateModalVisible(true);
  };

  const handleAddRelation = () => {
    setSelectedParentEmail(null);
    setIsRelationModalVisible(true);
  };

  const handleAddChildToParent = (parent) => {
    setSelectedParentEmail(parent.email);
    setIsRelationModalVisible(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancelRelation = () => {
    setIsRelationModalVisible(false);
    setSelectedParentEmail(null);
  };

  const parents = parentsData || [];

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Parents Management</Title>
        </div>

        {/* Statistics Cards */}
        <ParentsStats parents={parents} />

        {/* Parents Table */}
        <ParentsTable
          parents={parents}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={parentsData?.total || 0}
          onPageChange={setCurrentPage}
          onAddParent={handleAddParent}
          onAddRelation={handleAddRelation}
          onAddChildToParent={handleAddChildToParent}
        />

        {/* Create Parent Modal */}
        <CreateParentModal
          visible={isCreateModalVisible}
          onCancel={handleCancelCreate}
          onSubmit={handleCreateParent}
          loading={creating}
        />

        {/* Create Relation Modal */}
        <CreateRelationModal
          visible={isRelationModalVisible}
          onCancel={handleCancelRelation}
          onSubmit={handleCreateRelation}
          loading={creatingRelation}
          initialParentEmail={selectedParentEmail}
        />
      </Space>
    </AdminLayout>
  );
}
