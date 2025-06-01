import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined, BarChartOutlined } from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { postService } from "../../services/index";
import PostsStats from "./components/PostsStats";
import PostsTable from "./components/PostsTable";
import CreatePostModal from "./components/CreatePostModal";
import EditPostModal from "./components/EditPostModal";
import ViewPostModal from "./components/ViewPostModal";
import AdminLayout from "../../components/Layout/AdminLayout";

export default function PostsScreen() {
  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch paginated posts (EFFICIENT!)
  const {
    data: paginatedPostsData,
    request: fetchPaginatedPosts,
    isLoading: loadingPosts,
  } = useApi(postService.getPaginatedPosts);

  // Fetch post statistics (SEPARATE ENDPOINT!)
  const {
    data: statisticsData,
    request: fetchStatistics,
    isLoading: loadingStatistics,
  } = useApi(postService.getPostStatistics);

  // Create post
  const { request: createPostRequest, isLoading: creatingPost } = useApi(
    postService.createPost
  );

  // Update post
  const { request: updatePostRequest, isLoading: updatingPost } = useApi(
    postService.updatePost
  );

  // Delete post
  const { request: deletePostRequest, isLoading: deletingPost } = useApi(
    postService.deletePost
  );

  // Fetch data with pagination support
  const fetchData = () => {
    fetchPaginatedPosts(currentPage, pageSize);
    fetchStatistics(); // Only when needed (frontend controlled!)
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Refetch when page changes

  useEffect(() => {
    fetchData();
  }, []); // Initial load

  const posts = paginatedPostsData?.posts || [];
  const pagination = paginatedPostsData?.pagination || {};
  const overallStatistics = statisticsData || {};

  // Modal handlers
  const handleCreatePost = () => {
    setIsCreateModalVisible(true);
  };

  const handleViewPost = (post) => {
    setCurrentPost(post);
    setIsViewModalVisible(true);
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setIsEditModalVisible(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePostRequest(postId);
      message.success("Post deleted successfully!");
      // Refresh current page posts AND statistics
      fetchPaginatedPosts(currentPage, pageSize);
      fetchStatistics();
    } catch (error) {
      console.log("Delete post error handled by useApi");
    }
  };

  // Create post handler
  const handleCreatePostSubmit = async (values) => {
    try {
      await createPostRequest(values);
      message.success("Post created successfully!");
      setIsCreateModalVisible(false);
      // Refresh current page posts AND statistics
      fetchPaginatedPosts(currentPage, pageSize);
      fetchStatistics();
    } catch (error) {
      console.log("Create post error handled by useApi");
    }
  };

  // Update post handler
  const handleUpdatePostSubmit = async (values) => {
    try {
      await updatePostRequest(currentPost._id, values);
      message.success("Post updated successfully!");
      setIsEditModalVisible(false);
      setCurrentPost(null);
      // Refresh current page posts AND statistics
      fetchPaginatedPosts(currentPage, pageSize);
      fetchStatistics();
    } catch (error) {
      console.log("Update post error handled by useApi");
    }
  };

  // Cancel handlers
  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setCurrentPost(null);
  };

  const handleCancelView = () => {
    setIsViewModalVisible(false);
    setCurrentPost(null);
  };

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
            Posts Management
          </h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreatePost}
            size="large"
          >
            Create Post
          </Button>
        </div>

        {/* Statistics Cards */}
        <PostsStats posts={posts} overallStatistics={overallStatistics} />

        {/* Posts Table */}
        <PostsTable
          posts={posts}
          loading={loadingPosts}
          currentPage={currentPage}
          pageSize={pageSize}
          total={pagination.totalPosts || 0}
          onPageChange={setCurrentPage}
          onViewPost={handleViewPost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />

        {/* Create Post Modal */}
        <CreatePostModal
          visible={isCreateModalVisible}
          onCancel={handleCancelCreate}
          onSubmit={handleCreatePostSubmit}
          loading={creatingPost}
        />

        {/* Edit Post Modal */}
        <EditPostModal
          visible={isEditModalVisible}
          onCancel={handleCancelEdit}
          onSubmit={handleUpdatePostSubmit}
          loading={updatingPost}
          post={currentPost}
        />

        {/* View Post Modal */}
        <ViewPostModal
          visible={isViewModalVisible}
          onCancel={handleCancelView}
          post={currentPost}
        />
      </div>
    </AdminLayout>
  );
}
