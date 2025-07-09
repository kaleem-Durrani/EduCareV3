import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { useApi } from '../../../hooks';
import {
  postService,
  Post,
  PaginatedPostsResponse,
  CreatePostData,
  PostFilters,
  EnrolledClass,
  ClassStudent,
} from '../../../services';
import { PostItem, CreatePostModal } from './components';
import { PaginationControls, StudentSelector } from '../../../components';

const WallScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // Use TeacherClassesContext for classes and students
  const { classes = [], allStudents: students = [] } = useTeacherClasses();

  // State management
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [pageSize, setPageSize] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Filter state
  const [selectedClass, setSelectedClass] = useState<EnrolledClass | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // API hooks
  const {
    isLoading: isLoadingPosts,
    error: postsError,
    data: postsResponse,
    request: fetchPosts,
  } = useApi<PaginatedPostsResponse>(postService.getPosts);

  // Load initial data
  useEffect(() => {
    loadPosts();
  }, []);

  // Update posts when API response changes
  useEffect(() => {
    if (postsResponse) {
      setPosts(postsResponse.posts);
      setPagination(postsResponse.pagination);
    }
  }, [postsResponse]);

  const loadPosts = async (page: number = 1) => {
    const postFilters: PostFilters = {
      page,
      limit: pageSize,
      ...(selectedClass && { classId: selectedClass._id }),
      ...(selectedStudent && { studentId: selectedStudent._id }),
    };
    await fetchPosts(postFilters);
  };

  // Classes and students are now loaded from TeacherClassesContext

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(1);
    setRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    loadPosts(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    loadPosts(1);
  };

  const handleCreatePost = async (postData: CreatePostData, mediaFiles?: any[]) => {
    try {
      setIsCreatingPost(true);
      const response = await postService.createPost(postData, mediaFiles);
      if (response.success) {
        setIsCreateModalVisible(false);
        Alert.alert('Success', 'Post created successfully!');
        await loadPosts(1); // Refresh posts
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleEditPost = (_post: Post) => {
    // TODO: Implement edit functionality
    Alert.alert('Edit Post', 'Edit functionality will be implemented');
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await postService.deletePost(postId);
      if (response.success) {
        Alert.alert('Success', 'Post deleted successfully!');
        await loadPosts(pagination?.currentPage || 1); // Refresh current page
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  };

  // Filter handlers
  const handleClassSelect = (cls: EnrolledClass) => {
    setSelectedClass(cls);
    setSelectedStudent(null); // Clear student when class changes
    setShowClassModal(false);
    loadPosts(1); // Reset to first page
  };

  const handleStudentSelect = (student: ClassStudent) => {
    setSelectedStudent(student);
    setSelectedClass(null); // Clear class when student is selected
    loadPosts(1); // Reset to first page
  };

  const handleResetFilters = () => {
    setSelectedClass(null);
    setSelectedStudent(null);
    loadPosts(1); // Reset to first page
  };

  const handleResetStudentSelection = () => {
    setSelectedStudent(null);
    loadPosts(1); // Reset to first page
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <PostItem post={item} onEdit={handleEditPost} onDelete={handleDeletePost} />
  );

  if (isLoadingPosts && posts.length === 0) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textSecondary }}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{ backgroundColor: colors.card }}>
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Wall Posts
          </Text>
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity
            className="mr-2 rounded-lg px-3 py-2"
            style={{ backgroundColor: showFilters ? colors.primary : colors.border }}
            onPress={() => setShowFilters(!showFilters)}>
            <Text
              className={`text-sm ${showFilters ? 'text-white' : ''}`}
              style={{ color: showFilters ? 'white' : colors.textPrimary }}>
              🔍 Filters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg px-4 py-2"
            style={{ backgroundColor: colors.primary }}
            onPress={() => setIsCreateModalVisible(true)}>
            <Text className="font-medium text-white">+ Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View className="px-4 py-3" style={{ backgroundColor: colors.card }}>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
              Filters
            </Text>
            <TouchableOpacity
              className="rounded-lg px-3 py-1"
              style={{ backgroundColor: colors.border }}
              onPress={handleResetFilters}>
              <Text className="text-sm" style={{ color: colors.textPrimary }}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Class Filter */}
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              Filter by Class:
            </Text>
            <TouchableOpacity
              className="rounded-lg border p-3"
              style={{ borderColor: colors.border, backgroundColor: colors.background }}
              onPress={() => setShowClassModal(true)}>
              <Text style={{ color: selectedClass ? colors.textPrimary : colors.textSecondary }}>
                {selectedClass ? `🏫 ${selectedClass.name}` : 'Select a class...'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Student Filter */}
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              Filter by Student:
            </Text>
            <StudentSelector
              selectedStudent={selectedStudent}
              onStudentSelect={handleStudentSelect}
              onResetSelection={handleResetStudentSelection}
              placeholder="Select a student..."
              showAsTag={true}
              compact={true}
            />
          </View>

          {/* Active Filters Display */}
          {(selectedClass || selectedStudent) && (
            <View className="mt-2">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Active Filters:
              </Text>
              <View className="flex-row flex-wrap">
                {selectedClass && (
                  <View
                    className="mb-2 mr-2 rounded-lg px-3 py-1"
                    style={{ backgroundColor: colors.primary + '20' }}>
                    <Text className="text-sm" style={{ color: colors.primary }}>
                      Class: {selectedClass.name}
                    </Text>
                  </View>
                )}
                {selectedStudent && (
                  <View
                    className="mb-2 mr-2 rounded-lg px-3 py-1"
                    style={{ backgroundColor: colors.primary + '20' }}>
                    <Text className="text-sm" style={{ color: colors.primary }}>
                      Student: {selectedStudent.fullName}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Main Content */}
      <View className="flex-1">
        {/* Posts List */}
        {postsError ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="mb-2 text-center text-lg" style={{ color: colors.textPrimary }}>
              Failed to load posts
            </Text>
            <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
              {postsError}
            </Text>
            <TouchableOpacity
              className="rounded-lg bg-blue-500 px-6 py-3"
              onPress={() => loadPosts()}>
              <Text className="font-medium text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : posts.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-lg" style={{ color: colors.textSecondary }}>
              📝 No posts yet
            </Text>
            <Text className="mt-2 text-center" style={{ color: colors.textSecondary }}>
              Create your first post to share with parents and students
            </Text>
          </View>
        ) : (
          <View className="flex-1 px-4">
            <FlatList
              data={posts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[colors.primary]}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            />
          </View>
        )}

        {/* Fixed Pagination at Bottom */}
        {pagination && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalPosts}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoadingPosts}
            itemName="posts"
          />
        )}
      </View>

      {/* Create Post Modal */}
      <CreatePostModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreatePost}
        isCreating={isCreatingPost}
        classes={classes || []}
        students={students || []}
      />

      {/* Class Selection Modal */}
      <Modal
        visible={showClassModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClassModal(false)}>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            className="rounded-t-lg p-4"
            style={{ backgroundColor: colors.card, maxHeight: '70%' }}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Select Class
              </Text>
              <TouchableOpacity onPress={() => setShowClassModal(false)}>
                <Text className="text-lg" style={{ color: colors.textSecondary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={classes || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="border-b p-3"
                  style={{ borderBottomColor: colors.border }}
                  onPress={() => handleClassSelect(item)}>
                  <Text className="text-base" style={{ color: colors.textPrimary }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text className="p-4 text-center" style={{ color: colors.textSecondary }}>
                  No classes available
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WallScreen;
