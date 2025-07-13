import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { HealthInfo } from '../../../../services';

interface HealthInfoCardProps {
  healthInfo: HealthInfo;
}

export const HealthInfoCard: React.FC<HealthInfoCardProps> = ({ healthInfo }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getHealthIcon = (field: string) => {
    switch (field) {
      case 'blood_group':
        return '🩸';
      case 'allergy':
        return '🤧';
      case 'eye_condition':
        return '👁️';
      case 'heart_rate':
        return '❤️';
      case 'ear_condition':
        return '👂';
      default:
        return '🏥';
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'blood_group':
        return 'Blood Group';
      case 'allergy':
        return 'Allergies';
      case 'eye_condition':
        return 'Eye Condition';
      case 'heart_rate':
        return 'Heart Rate';
      case 'ear_condition':
        return 'Ear Condition';
      default:
        return field;
    }
  };

  const healthFields = [
    { key: 'blood_group', value: healthInfo.blood_group },
    { key: 'allergy', value: healthInfo.allergy },
    { key: 'eye_condition', value: healthInfo.eye_condition },
    { key: 'heart_rate', value: healthInfo.heart_rate },
    { key: 'ear_condition', value: healthInfo.ear_condition },
  ];

  return (
    <View
      className="rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
      }}>
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary + '20' }}>
          <Text className="text-2xl">🏥</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            Health Information
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {healthInfo.student_id.fullName}'s medical information
          </Text>
        </View>
      </View>

      {/* Health Fields */}
      <View className="space-y-3">
        {healthFields.map((field, index) => (
          <View
            key={field.key}
            className="flex-row items-center rounded-lg p-3"
            style={{
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
            }}>
            <Text className="mr-3 text-xl">{getHealthIcon(field.key)}</Text>
            <View className="flex-1">
              <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                {getFieldLabel(field.key)}
              </Text>
              <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                {field.value || 'Not specified'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="mt-4 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Last updated: {formatDate(healthInfo.updatedAt)}
          </Text>
          {healthInfo.updatedBy && (
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              By: {healthInfo.updatedBy.name}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
