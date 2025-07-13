import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, Dimensions } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useTheme } from '../../../../contexts';
import { Post } from '../../../../services';
import { buildMediaUrl } from '../../../../config';

interface PostDetailModalProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ visible, post, onClose }) => {
  const { colors } = useTheme();
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);

  // Create video players for each video
  const postVideos = post?.media.filter((item) => item.type === 'video') || [];
  const videoPlayers = postVideos.map((video) =>
    useVideoPlayer(buildMediaUrl(video.url), (player: any) => {
      player.loop = false;
      player.muted = false;
    })
  );

  if (!post) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewVisible(true);
  };

  const handleVideoPress = (index: number) => {
    if (playingVideoIndex === index) {
      setPlayingVideoIndex(null); // Stop video
      if (videoPlayers[index]) {
        videoPlayers[index].pause();
      }
    } else {
      setPlayingVideoIndex(index); // Play video
      if (videoPlayers[index]) {
        videoPlayers[index].play();
      }
    }
  };

  const images = post.media.filter((item) => item.type === 'image');
  const videos = post.media.filter((item) => item.type === 'video');

  const imageViewerImages = images.map((image) => ({
    uri: buildMediaUrl(image.url),
  }));

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}>
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
          {/* Header */}
          <View
            className="flex-row items-center justify-between px-4 py-4"
            style={{
              backgroundColor: colors.card,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
            <View className="flex-1">
              <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                Post Details
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {post.title}
              </Text>
            </View>
            <TouchableOpacity
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: colors.primary + '20' }}
              onPress={onClose}>
              <Text className="font-semibold" style={{ color: colors.primary }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4 py-6">
            {/* Post Header */}
            <View
              className="mb-6 rounded-xl p-5"
              style={{
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 5,
              }}>
              {/* Title */}
              <Text className="mb-4 text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {post.title}
              </Text>

              {/* Meta Information */}
              <View className="mb-4 space-y-3">
                {/* Date and Time */}
                <View className="flex-row items-center">
                  <Text className="mr-3 text-lg">📅</Text>
                  <View className="flex-1">
                    <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                      {formatDate(post.createdAt)}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>
                      {formatTime(post.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Teacher */}
                <View className="flex-row items-center">
                  <Text className="mr-3 text-lg">👨‍🏫</Text>
                  <View className="flex-1">
                    <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                      {post.teacherId.name}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>
                      Teacher
                    </Text>
                  </View>
                </View>

                {/* Audience */}
                <View className="flex-row items-center">
                  <Text className="mr-3 text-lg">{getAudienceIcon()}</Text>
                  <View className="flex-1">
                    <View
                      className="self-start rounded-full px-3 py-1"
                      style={{ backgroundColor: getAudienceColor() + '20' }}>
                      <Text className="text-sm font-semibold" style={{ color: getAudienceColor() }}>
                        {getAudienceText()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Content */}
            <View
              className="mb-6 rounded-xl p-5"
              style={{
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 5,
              }}>
              <View className="mb-3 flex-row items-center">
                <Text className="mr-2 text-lg">📝</Text>
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Content
                </Text>
              </View>
              <Text className="text-base leading-7" style={{ color: colors.textPrimary }}>
                {post.content}
              </Text>
            </View>

            {/* Images */}
            {images.length > 0 && (
              <View
                className="mb-6 rounded-xl p-5"
                style={{
                  backgroundColor: colors.card,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  elevation: 5,
                }}>
                <View className="mb-4 flex-row items-center">
                  <Text className="mr-2 text-lg">📷</Text>
                  <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    Images ({images.length})
                  </Text>
                </View>

                <View className="flex-row flex-wrap">
                  {images.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      className="mb-3 mr-3"
                      onPress={() => handleImagePress(index)}
                      activeOpacity={0.7}>
                      <View
                        className="overflow-hidden rounded-lg"
                        style={{
                          width: (screenWidth - 80) / 2,
                          height: (screenWidth - 80) / 2,
                          backgroundColor: colors.border,
                        }}>
                        <Image
                          source={{ uri: buildMediaUrl(image.url) }}
                          className="h-full w-full"
                          resizeMode="cover"
                        />
                        {/* Tap indicator */}
                        <View
                          className="absolute bottom-2 right-2 rounded-full px-2 py-1"
                          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                          <Text className="text-xs text-white">Tap to view</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <View
                className="mb-6 rounded-xl p-5"
                style={{
                  backgroundColor: colors.card,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.12,
                  shadowRadius: 10,
                  elevation: 5,
                }}>
                <View className="mb-4 flex-row items-center">
                  <Text className="mr-2 text-lg">🎥</Text>
                  <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    Videos ({videos.length})
                  </Text>
                </View>

                <View className="space-y-4">
                  {videos.map((video, index) => (
                    <View key={index} className="mb-4">
                      {/* Video Container with fixed dimensions */}
                      <View
                        style={{
                          width: screenWidth - 40, // Account for padding
                          height: (screenWidth - 40) * (9 / 16), // 16:9 aspect ratio
                          backgroundColor: 'black',
                          borderRadius: 8,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {playingVideoIndex === index ? (
                          <VideoView
                            player={videoPlayers[index]}
                            style={{
                              width: screenWidth - 40,
                              height: (screenWidth - 40) * (9 / 16),
                            }}
                            allowsFullscreen
                            allowsPictureInPicture
                            contentFit="contain"
                            nativeControls
                          />
                        ) : (
                          <TouchableOpacity
                            style={{
                              width: screenWidth - 40,
                              height: (screenWidth - 40) * (9 / 16),
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => handleVideoPress(index)}
                            activeOpacity={0.7}>
                            <View className="items-center">
                              <View
                                className="mb-2 items-center justify-center rounded-full"
                                style={{
                                  width: 60,
                                  height: 60,
                                  backgroundColor: colors.primary,
                                }}>
                                <Text className="text-2xl text-white">▶️</Text>
                              </View>
                              <Text className="text-base font-medium" style={{ color: 'white' }}>
                                Tap to play video
                              </Text>
                              <Text className="text-sm" style={{ color: '#CCCCCC' }}>
                                Video {index + 1}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Image Viewer */}
      {images.length > 0 && (
        <ImageView
          images={imageViewerImages}
          imageIndex={selectedImageIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
          swipeToCloseEnabled={true}
          doubleTapToZoomEnabled={true}
        />
      )}
    </>
  );
};
