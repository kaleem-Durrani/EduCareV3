import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { postService, Post } from '../../../services';

interface Props {
  navigation: any;
  route: {
    params: {
      studentId: string;
    };
  };
}

const WallScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [studentId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // Fetch posts specific to the student
      const response = await postService.getPostsForParent(studentId);

      if (response.success) {
        setPosts(response.data.posts || response.data || []);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAudienceText = (post: Post) => {
    switch (post.audience.type) {
      case 'all':
        return 'All Students';
      case 'class':
        return `Classes: ${post.audience.class_ids?.map((c) => c.name).join(', ') || 'Unknown'}`;
      case 'individual':
        return `Students: ${post.audience.student_ids?.map((s) => s.fullName).join(', ') || 'Unknown'}`;
      default:
        return 'Unknown';
    }
  };

  const renderMediaItem = (media: any, index: number) => {
    if (media.type === 'image') {
      return (
        <Image
          key={index}
          source={{ uri: media.url }}
          className="mr-2 h-20 w-20 rounded-lg"
          resizeMode="cover"
        />
      );
    }
    // For videos, you might want to use a video player component
    return (
      <View
        key={index}
        className="mr-2 h-20 w-20 items-center justify-center rounded-lg bg-gray-300">
        <Text className="text-xs text-gray-600">Video</Text>
      </View>
    );
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View className="mx-4 mb-4 rounded-lg bg-white p-4 shadow-sm">
      {/* Header */}
      <View className="mb-3 flex-row items-center">
        {item.teacherId?.photoUrl ? (
          <Image source={{ uri: item.teacherId.photoUrl }} className="h-10 w-10 rounded-full" />
        ) : (
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            <Text className="text-sm font-medium text-gray-600">
              {item.teacherId?.name?.charAt(0) || 'T'}
            </Text>
          </View>
        )}
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
            {item.teacherId?.name || 'Teacher'}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {formatDate(item.createdAt)} • {getAudienceText(item)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text className="mb-2 text-lg font-semibold" style={{ color: colors.textPrimary }}>
        {item.title}
      </Text>
      <Text className="mb-3 text-base" style={{ color: colors.textSecondary }}>
        {item.content}
      </Text>

      {/* Media */}
      {item.media && item.media.length > 0 && (
        <View className="mb-3">
          <FlatList
            horizontal
            data={item.media}
            renderItem={({ item: media, index }) => renderMediaItem(media, index)}
            keyExtractor={(media, index) => `${item._id}-media-${index}`}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Wall
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
            Loading posts...
          </Text>
        </View>
      ) : posts.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Posts Found
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            No posts have been shared yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default WallScreen;
