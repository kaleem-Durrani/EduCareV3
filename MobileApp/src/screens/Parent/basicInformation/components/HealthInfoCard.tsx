import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';

interface HealthInfoCardProps {
  allergies: string[];
  likes: string[];
}

export const HealthInfoCard: React.FC<HealthInfoCardProps> = ({ allergies, likes }) => {
  const { colors } = useTheme();

  const renderList = (items: string[], emptyMessage: string, emoji: string, color: string) => {
    if (!items || items.length === 0) {
      return (
        <Text className="text-center italic" style={{ color: colors.textMuted }}>
          {emptyMessage}
        </Text>
      );
    }

    return (
      <View className="flex-row flex-wrap">
        {items.map((item, index) => (
          <View
            key={index}
            className="mb-2 mr-2 rounded-full px-3 py-1"
            style={{ backgroundColor: color + '20' }}>
            <Text className="text-sm font-medium" style={{ color }}>
              {emoji} {item}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      className="mb-6 rounded-xl p-6"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Text className="text-2xl mr-3">🏥</Text>
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Health & Preferences
        </Text>
      </View>

      {/* Content */}
      <View className="space-y-6">
        {/* Allergies Section */}
        <View>
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-2">⚠️</Text>
            <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Allergies
            </Text>
            {allergies && allergies.length > 0 && (
              <View
                className="ml-auto rounded-full px-2 py-1"
                style={{ backgroundColor: colors.error + '20' }}>
                <Text className="text-xs font-bold" style={{ color: colors.error }}>
                  {allergies.length}
                </Text>
              </View>
            )}
          </View>
          <View
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.background,
              borderLeftWidth: 4,
              borderLeftColor: colors.error,
            }}>
            {renderList(allergies, 'No known allergies', '🚫', colors.error)}
          </View>
        </View>

        {/* Likes Section */}
        <View>
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-2">❤️</Text>
            <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Likes & Interests
            </Text>
            {likes && likes.length > 0 && (
              <View
                className="ml-auto rounded-full px-2 py-1"
                style={{ backgroundColor: colors.success + '20' }}>
                <Text className="text-xs font-bold" style={{ color: colors.success }}>
                  {likes.length}
                </Text>
              </View>
            )}
          </View>
          <View
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.background,
              borderLeftWidth: 4,
              borderLeftColor: colors.success,
            }}>
            {renderList(likes, 'No preferences recorded', '💚', colors.success)}
          </View>
        </View>

        {/* Health Tips */}
        <View
          className="rounded-lg p-4"
          style={{ backgroundColor: colors.info + '10' }}>
          <View className="flex-row items-center mb-2">
            <Text className="text-xl mr-2">💡</Text>
            <Text className="text-base font-semibold" style={{ color: colors.info }}>
              Health Reminder
            </Text>
          </View>
          <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
            Please ensure all allergy information is up to date and inform the school of any changes.
            Emergency contacts should always be reachable during school hours.
          </Text>
        </View>
      </View>
    </View>
  );
};
