import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Post } from '../../../../services';
import { buildMediaUrl } from '../../../../config';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAudienceIcon = () => {
    switch (post.audience.type) {
      case 'all':
        return '🌍';
      case 'class':
        return '🏫';
      case 'individual':
        return '👤';
      default:
        return '📝';
    }
  };

  const getAudienceText = () => {
    switch (post.audience.type) {
      case 'all':
        return 'All Students';
      case 'class':
        return post.audience.class_ids?.[0]?.name || 'Class Post';
      case 'individual':
        return post.audience.student_ids?.[0]?.fullName || 'Individual Post';
      default:
        return 'Post';
    }
  };

  const getAudienceColor = () => {
    switch (post.audience.type) {
      case 'all':
        return '#8B5CF6'; // Purple
      case 'class':
        return '#10B981'; // Green
      case 'individual':
        return '#F59E0B'; // Orange
      default:
        return colors.textSecondary;
    }
  };

  const hasMedia = post.media.length > 0;
  const mediaCount = post.media.length;
  const images = post.media.filter((item) => item.type === 'image');
  const videos = post.media.filter((item) => item.type === 'video');

  return (
    <TouchableOpacity
      className="mb-4 rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
      }}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Header */}
      <View className="mb-4 flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
            {post.title}
          </Text>

          {/* Date and Time */}
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 text-base">📅</Text>
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              {formatDate(post.createdAt)}
            </Text>
            <Text className="mx-2" style={{ color: colors.textSecondary }}>
              •
            </Text>
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              {formatTime(post.createdAt)}
            </Text>
          </View>

          {/* Audience */}
          <View className="flex-row items-center">
            <Text className="mr-2 text-base">{getAudienceIcon()}</Text>
            <View
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: getAudienceColor() + '20' }}>
              <Text className="text-xs font-semibold" style={{ color: getAudienceColor() }}>
                {getAudienceText()}
              </Text>
            </View>
          </View>
        </View>

        {/* Media Count Badge */}
        {hasMedia && (
          <View className="items-center">
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: colors.primary + '20' }}>
              <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                {mediaCount} Media
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Content */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{
          backgroundColor: colors.background,
        }}>
        <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
          {post.content}
        </Text>
      </View>

      {/* Media Preview */}
      {hasMedia && (
        <View className="mb-4">
          <Text className="mb-3 text-sm font-medium" style={{ color: colors.textSecondary }}>
            Media ({mediaCount} items)
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {/* Images */}
              {images.map((image, index) => (
                <View key={`image-${index}`} className="mr-3">
                  <View
                    className="overflow-hidden rounded-lg"
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: colors.border,
                    }}>
                    <Image
                      source={{ uri: buildMediaUrl(image.url) }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                    {/* Image indicator */}
                    <View
                      className="absolute bottom-1 right-1 rounded-full px-2 py-1"
                      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                      <Text className="text-xs text-white">📷</Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Videos */}
              {videos.map((video, index) => (
                <View key={`video-${index}`} className="mr-3">
                  <View
                    className="items-center justify-center overflow-hidden rounded-lg"
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: colors.border,
                    }}>
                    {/* Video thumbnail placeholder */}
                    <View className="h-full w-full items-center justify-center">
                      <Text className="text-2xl">🎥</Text>
                      <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
                        Video
                      </Text>
                    </View>
                    {/* Play button overlay */}
                    <View
                      className="absolute inset-0 items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                      <View
                        className="items-center justify-center rounded-full"
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}>
                        <Text className="text-xs">▶️</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Tap to view indicator */}
          <Text className="mt-2 text-center text-xs" style={{ color: colors.textSecondary }}>
            Tap to view all media
          </Text>
        </View>
      )}

      {/* Footer */}
      <View className="pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            By {post.teacherId.name}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Tap to view details
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
