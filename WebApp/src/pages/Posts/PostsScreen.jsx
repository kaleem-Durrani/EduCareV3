import { useState, useEffect } from "react";
import { Space, Typography, Button, Card, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { postService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  PostsStatistics,
  PostsFilters,
  PostsTable,
  PostFormModal,
  PostDetailsModal,
  AudienceManagementModal,
} from "./components";

const { Title } = Typography;

export default function PostsScreen() {
  // State management
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isAudienceModalVisible, setIsAudienceModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [form] = Form.useForm();
  const pageSize = 10;

  // Fetch posts statistics
  const { request: fetchStatistics, isLoading: loadingStatistics } = useApi(
    postService.getPostStatistics,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        title: "Failed to Load Statistics",
      },
    }
  );

  // Fetch posts data with pagination and filters
  const {
    data: postsData,
    isLoading: loading,
    request: fetchPosts,
  } = useApi(postService.getPaginatedPosts, {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      title: "Failed to Load Posts",
    },
  });

  // Create post API
  const { request: createPostRequest, isLoading: creating } = useApi(
    postService.createPost,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Post",
      },
    }
  );

  // Update post API
  const { request: updatePostRequest, isLoading: updating } = useApi(
    postService.updatePost,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Post",
      },
    }
  );

  // Delete post API
  const { request: deletePostRequest } = useApi(postService.deletePost, {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      title: "Failed to Delete Post",
    },
  });

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchStatisticsData();
  }, []);

  useEffect(() => {
    fetchPostsData();
  }, [currentPage, filters]);

  const fetchStatisticsData = async () => {
    try {
      const stats = await fetchStatistics();
      setStatistics(stats);
    } catch (error) {
      console.log("Statistics error handled by useApi");
    }
  };

  const fetchPostsData = async () => {
    try {
      // Create filter object for API call
      const apiFilters = {};
      if (filters.teacherId) apiFilters.teacherId = filters.teacherId;
      if (filters.classId) apiFilters.classId = filters.classId;
      if (filters.studentId) apiFilters.studentId = filters.studentId;

      await fetchPosts(currentPage, pageSize, apiFilters);
    } catch (error) {
      console.log("Posts fetch error handled by useApi");
    }
  };

  // Handler functions
  const handleAdd = () => {
    setEditingPost(null);
    form.resetFields();
    setIsFormModalVisible(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);

    // Transform audience data for form
    const audienceForForm = {
      type: post.audience.type,
      class_ids: post.audience.class_ids?.map((cls) => cls._id || cls) || [],
      student_ids:
        post.audience.student_ids?.map((student) => student._id || student) ||
        [],
    };

    form.setFieldsValue({
      title: post.title,
      content: post.content,
      audience: audienceForForm,
    });
    setIsFormModalVisible(true);
  };

  const handleDetails = (post) => {
    setSelectedPost(post);
    setIsDetailsModalVisible(true);
  };

  const handleDelete = async (postId) => {
    try {
      await deletePostRequest(postId);
      message.success("Post deleted successfully!");
      fetchPostsData();
      fetchStatisticsData();
    } catch (error) {
      console.log("Delete error handled by useApi");
    }
  };

  const handleManageAudience = (post) => {
    setSelectedPost(post);
    setIsAudienceModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Add form fields
      Object.keys(values).forEach((key) => {
        if (key !== "image" && key !== "video" && values[key] !== undefined) {
          if (key === "audience") {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Add media files if provided
      if (values.image && values.image.file) {
        formData.append("image", values.image.file);
      }
      if (values.video && values.video.file) {
        formData.append("video", values.video.file);
      }

      if (editingPost) {
        await updatePostRequest(editingPost._id, formData);
        message.success("Post updated successfully!");
      } else {
        await createPostRequest(formData);
        message.success("Post created successfully!");
      }

      setIsFormModalVisible(false);
      setEditingPost(null);
      form.resetFields();
      fetchPostsData();
      fetchStatisticsData();
    } catch (error) {
      console.log("Form submit error handled by useApi");
    }
  };

  const handleFormCancel = () => {
    setIsFormModalVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalVisible(false);
    setSelectedPost(null);
  };

  const handleAudienceCancel = () => {
    setIsAudienceModalVisible(false);
    setSelectedPost(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Extract data
  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination || {};

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Posts Management</Title>
        </div>

        {/* Statistics Cards */}
        <PostsStatistics statistics={statistics} loading={loadingStatistics} />

        {/* Filters */}
        <PostsFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Posts Table */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Create Post
            </Button>
          </div>

          <PostsTable
            posts={posts}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={pagination.totalItems || 0}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDetails={handleDetails}
            onManageAudience={handleManageAudience}
          />
        </Card>

        {/* Post Form Modal */}
        <PostFormModal
          visible={isFormModalVisible}
          editingPost={editingPost}
          form={form}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          creating={creating}
          updating={updating}
        />

        {/* Post Details Modal */}
        <PostDetailsModal
          visible={isDetailsModalVisible}
          post={selectedPost}
          onCancel={handleDetailsCancel}
          onManageAudience={handleManageAudience}
        />

        {/* Audience Management Modal */}
        <AudienceManagementModal
          visible={isAudienceModalVisible}
          post={selectedPost}
          onCancel={handleAudienceCancel}
        />
      </Space>
    </AdminLayout>
  );
}
