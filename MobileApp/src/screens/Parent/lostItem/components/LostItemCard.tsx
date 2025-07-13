import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useTheme } from '../../../../contexts';
import { LostItem } from '../../../../services';
import { buildMediaUrl } from '../../../../config';

interface LostItemCardProps {
  item: LostItem;
}

export const LostItemCard: React.FC<LostItemCardProps> = ({ item }) => {
  const { colors } = useTheme();
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    return item.status === 'claimed' ? '#10B981' : '#F59E0B';
  };

  const getStatusIcon = () => {
    return item.status === 'claimed' ? '✅' : '🔍';
  };

  const handleImagePress = () => {
    if (item.imageUrl) {
      setIsImageViewVisible(true);
    }
  };

  const imageUri = item.imageUrl ? buildMediaUrl(item.imageUrl) : null;

  return (
    <>
      <View
        className="mb-4 rounded-xl p-5"
        style={{
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 5,
        }}>
        
        {/* Header */}
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {item.title}
            </Text>
            
            {/* Date Found */}
            <View className="flex-row items-center mb-2">
              <Text className="mr-2 text-lg">📅</Text>
              <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                Found: {formatDate(item.dateFound)}
              </Text>
            </View>
          </View>
          
          {/* Status Badge */}
          <View className="items-center">
            <Text className="text-2xl mb-1">{getStatusIcon()}</Text>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: getStatusColor() + '20' }}>
              <Text
                className="text-sm font-semibold capitalize"
                style={{ color: getStatusColor() }}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Row */}
        <View className="flex-row">
          {/* Image */}
          {imageUri && (
            <TouchableOpacity
              className="mr-4"
              onPress={handleImagePress}
              activeOpacity={0.7}>
              <View
                className="rounded-lg overflow-hidden"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: colors.border,
                }}>
                <Image
                  source={{ uri: imageUri }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {/* Tap indicator overlay */}
                <View
                  className="absolute bottom-0 left-0 right-0 items-center justify-center py-1"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                  <Text className="text-xs text-white">Tap to view</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Description */}
          <View className="flex-1">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
              Description
            </Text>
            <Text
              className="text-base leading-6"
              style={{ color: colors.textPrimary }}>
              {item.description}
            </Text>
          </View>
        </View>

        {/* Claimed Information */}
        {item.status === 'claimed' && item.claimedBy && (
          <View
            className="mt-4 rounded-lg p-3"
            style={{
              backgroundColor: colors.success + '10',
              borderWidth: 1,
              borderColor: colors.success + '30',
            }}>
            <View className="flex-row items-center mb-2">
              <Text className="mr-2 text-lg">👤</Text>
              <Text className="text-base font-semibold" style={{ color: colors.success }}>
                Claimed by {item.claimedBy.name}
              </Text>
            </View>
            <Text className="text-sm" style={{ color: colors.success }}>
              Email: {item.claimedBy.email}
            </Text>
            {item.claimedDate && (
              <Text className="text-sm" style={{ color: colors.success }}>
                Claimed on: {formatDate(item.claimedDate)}
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View className="mt-4 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Added on {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>

      {/* Image Viewer */}
      {imageUri && (
        <ImageView
          images={[{ uri: imageUri }]}
          imageIndex={0}
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
          swipeToCloseEnabled={true}
          doubleTapToZoomEnabled={true}
        />
      )}
    </>
  );
};
