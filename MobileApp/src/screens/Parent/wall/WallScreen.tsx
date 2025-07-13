import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import { postService, PaginatedPostsResponse, Post, ParentStudent } from '../../../services';
import { ChildSelector, PaginationControls, ScreenHeader } from '../../../components';
import { PostCard, PostDetailModal } from './components';
import Toast from 'react-native-toast-message';

const WallScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailModalVisible, setIsPostDetailModalVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const { children, isLoading: isLoadingChildren, refreshChildren } = useParentChildren();

  // API hooks for posts
  const {
    request: fetchPosts,
    isLoading: loadingPosts,
    error: postsError,
    data: postsData,
  } = useApi<PaginatedPostsResponse>((params: { studentId: string; page: number; limit: number }) =>
    postService.getPostsForParent(params.studentId, params.page, params.limit)
  );

  // Load posts when child or pagination changes
  useEffect(() => {
    if (selectedChild) {
      loadPosts();
    } else {
      setPosts([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [selectedChild, currentPage, pageSize]);

  const loadPosts = async () => {
    if (!selectedChild) return;

    const response = await postService.getPostsForParent(selectedChild._id, currentPage, pageSize);

    if (response.success) {
      await fetchPosts({
        studentId: selectedChild._id,
        page: currentPage,
        limit: pageSize,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load posts',
        visibilityTime: 3000,
      });
    }
  };

  // Update posts when data changes
  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts);
      setTotalPages(postsData.pagination.totalPages);
      setTotalItems(postsData.pagination.totalPosts);
    }
  }, [postsData]);

  const handleChildSelect = (child: ParentStudent) => {
    setSelectedChild(child);
    setCurrentPage(1); // Reset to first page when changing child
    setHasSearched(true);
  };

  const handleChildReset = () => {
    setSelectedChild(null);
    setPosts([]);
    setCurrentPage(1);
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await loadPosts();
    }
  };

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setIsPostDetailModalVisible(true);
  };

  const isLoading = isLoadingChildren || loadingPosts;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Wall" navigation={navigation} showBackButton={true} />

      {/* Main Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }>
          {/* Child Selector */}
          <View className="mt-4">
            <ChildSelector
              selectedChild={selectedChild}
              onChildSelect={handleChildSelect}
              onResetSelection={handleChildReset}
              placeholder="Select a child to view their posts"
              disabled={isLoadingChildren}
            />
          </View>

          {selectedChild && (
            <>
              {/* Posts Loading */}
              {loadingPosts && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="text-lg" style={{ color: colors.textSecondary }}>
                    Loading {selectedChild.fullName}'s posts...
                  </Text>
                </View>
              )}

              {/* Posts Error */}
              {postsError && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">⚠️</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                    Error Loading Posts
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    {postsError || 'Something went wrong'}
                  </Text>
                  <TouchableOpacity
                    className="mt-4 rounded-lg px-6 py-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={loadPosts}>
                    <Text className="font-semibold text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Posts List */}
              {!loadingPosts && posts.length > 0 && (
                <View className="pb-8">
                  {/* Header */}
                  <View className="mb-4 mt-6 flex-row items-center">
                    <View
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-2xl">📝</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        Posts & Updates
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedChild.fullName}'s school posts and announcements
                      </Text>
                    </View>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {totalItems} Post{totalItems !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Posts */}
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} onPress={() => handlePostPress(post)} />
                  ))}
                </View>
              )}

              {/* No Posts State */}
              {!loadingPosts && posts.length === 0 && selectedChild && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">📝</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                    No Posts Found
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    No posts have been shared for {selectedChild.fullName} yet.
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Empty State */}
          {!selectedChild && !isLoading && hasSearched && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="mb-4 text-6xl">👶</Text>
              <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
                Select a Child
              </Text>
              <Text className="text-center" style={{ color: colors.textSecondary }}>
                Choose one of your children to view their posts
              </Text>
            </View>
          )}

          {/* No Children State */}
          {children.length === 0 && !isLoadingChildren && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="mb-4 text-6xl">👨‍👩‍👧‍👦</Text>
              <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
                No Children Found
              </Text>
              <Text className="text-center" style={{ color: colors.textSecondary }}>
                No children are associated with your account. Please contact the school
                administration.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Fixed Pagination at Bottom */}
        {selectedChild && posts.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingPosts}
            itemName="posts"
          />
        )}
      </View>

      {/* Post Detail Modal */}
      <PostDetailModal
        visible={isPostDetailModalVisible}
        post={selectedPost}
        onClose={() => {
          setIsPostDetailModalVisible(false);
          setSelectedPost(null);
        }}
      />
    </SafeAreaView>
  );
};

export default WallScreen;
