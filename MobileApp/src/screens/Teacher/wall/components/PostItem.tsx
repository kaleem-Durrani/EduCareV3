import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import ImageViewing from 'react-native-image-viewing';
import { useTheme } from '../../../../contexts';
import { Post } from '../../../../services';
import { buildMediaUrl } from '~/config';

interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export const PostItem: React.FC<PostItemProps> = ({ post, onEdit, onDelete }) => {
  const { colors } = useTheme();
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageViewingIndex, setImageViewingIndex] = useState(0);
  const [isImageViewingVisible, setIsImageViewingVisible] = useState(false);

  const screenWidth = Dimensions.get('window').width - 32; // Account for padding

  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(post._id) },
    ]);
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

  const getAudienceText = () => {
    switch (post.audience.type) {
      case 'all':
        return '👥 All Classes';
      case 'class':
        return `🏫 ${post.audience.class_ids?.map((c) => c.name).join(', ') || 'Selected Classes'}`;
      case 'individual':
        return `👤 ${post.audience.student_ids?.map((s) => s.fullName).join(', ') || 'Selected Students'}`;
      default:
        return '👥 All Classes';
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) {
      return null;
    }

    const images = post.media.filter((m) => m.type === 'image');
    const videos = post.media.filter((m) => m.type === 'video');

    const openImageViewer = (imageIndex: number) => {
      setImageViewingIndex(imageIndex);
      setIsImageViewingVisible(true);
    };

    return (
      <View className="mt-3">
        {/* Images */}
        {images.length > 0 && (
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              📷 Images ({images.length})
            </Text>
            <View className="flex-row flex-wrap">
              {images.map((image, index) => (
                <TouchableOpacity
                  key={`image_${index}`}
                  className="mb-2 mr-2"
                  onPress={() => openImageViewer(index)}
                  style={{ width: images.length === 1 ? screenWidth : (screenWidth - 8) / 2 }}>
                  <Image
                    source={{ uri: buildMediaUrl(image.url) }}
                    style={{
                      height: images.length === 1 ? 200 : 120,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              🎥 Videos ({videos.length})
            </Text>
            {videos.map((video, index) => (
              <View key={`video_${index}`} className="mb-2">
                <Video
                  source={{ uri: buildMediaUrl(video.url) }}
                  style={{
                    width: screenWidth,
                    height: 200,
                    borderRadius: 8,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={false}
                  isLooping={false}
                  isMuted={false}
                />
                <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
                  {video.filename || `Video ${index + 1}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Image Viewing Modal */}
        <ImageViewing
          images={images.map((img) => ({ uri: buildMediaUrl(img.url) }))}
          imageIndex={imageViewingIndex}
          visible={isImageViewingVisible}
          onRequestClose={() => setIsImageViewingVisible(false)}
        />
      </View>
    );
  };

  return (
    <View
      className="mb-4 rounded-lg border p-4"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {post.title}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            By {post.teacherId.name} • {formatDate(post.createdAt)}
          </Text>
        </View>

        <View className="flex-row">
          <TouchableOpacity
            className="ml-2 rounded-lg bg-blue-500 px-3 py-1"
            onPress={() => onEdit(post)}>
            <Text className="text-xs font-medium text-white">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity className="ml-2 rounded-lg bg-red-500 px-3 py-1" onPress={handleDelete}>
            <Text className="text-xs font-medium text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audience */}
      <View className="mt-2">
        <Text className="text-sm font-medium" style={{ color: colors.primary }}>
          {getAudienceText()}
        </Text>
      </View>

      {/* Content */}
      <View className="mt-3">
        <Text className="text-base" style={{ color: colors.textPrimary }}>
          {showFullContent ? post.content : truncateContent(post.content)}
        </Text>
        {post.content.length > 150 && (
          <TouchableOpacity className="mt-1" onPress={() => setShowFullContent(!showFullContent)}>
            <Text className="text-sm font-medium" style={{ color: colors.primary }}>
              {showFullContent ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Media */}
      {renderMedia()}
    </View>
  );
};
