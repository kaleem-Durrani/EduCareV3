import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts';
import { HealthInfo, ParentStudent } from '../../../../services';

interface HealthInfoModalProps {
  visible: boolean;
  selectedChild: ParentStudent | null;
  healthInfoData: HealthInfo | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export const HealthInfoModal: React.FC<HealthInfoModalProps> = ({
  visible,
  selectedChild,
  healthInfoData,
  isLoading,
  error,
  onClose,
}) => {
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

  const healthFields = healthInfoData
    ? [
        { key: 'blood_group', value: healthInfoData.blood_group },
        { key: 'allergy', value: healthInfoData.allergy },
        { key: 'eye_condition', value: healthInfoData.eye_condition },
        { key: 'heart_rate', value: healthInfoData.heart_rate },
        { key: 'ear_condition', value: healthInfoData.ear_condition },
      ]
    : [];

  return (
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
              Health Information
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {selectedChild
                ? `${selectedChild.fullName}'s medical information`
                : 'Medical information'}
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
          {/* Loading State */}
          {isLoading && (
            <View className="items-center justify-center py-12">
              <Text className="text-lg" style={{ color: colors.textSecondary }}>
                Loading health information...
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View className="items-center justify-center py-12">
              <Text className="mb-4 text-6xl">⚠️</Text>
              <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                Error Loading Health Information
              </Text>
              <Text
                className="px-8 text-center text-base leading-6"
                style={{ color: colors.textSecondary }}>
                {error || 'Something went wrong'}
              </Text>
            </View>
          )}

          {/* Health Information Content */}
          {healthInfoData && !isLoading && !error && (
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
                    Medical Information
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    {healthInfoData.student_id.fullName}'s health details
                  </Text>
                </View>
              </View>

              {/* Health Fields */}
              <View className="space-y-3">
                {healthFields.map((field, index) => (
                  <View
                    key={field.key}
                    className="mb-1 flex-row items-center rounded-lg p-3"
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
                      <Text
                        className="text-base font-semibold"
                        style={{ color: colors.textPrimary }}>
                        {field.value || 'Not specified'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Footer */}
              <View
                className="mt-4 pt-3"
                style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    Last updated: {formatDate(healthInfoData.updatedAt)}
                  </Text>
                  {healthInfoData.updatedBy && (
                    <Text className="text-xs" style={{ color: colors.textSecondary }}>
                      By: {healthInfoData.updatedBy.name}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* No Data State */}
          {!healthInfoData && !isLoading && !error && (
            <View className="items-center justify-center py-12">
              <Text className="mb-4 text-6xl">🏥</Text>
              <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                No Health Information
              </Text>
              <Text
                className="px-8 text-center text-base leading-6"
                style={{ color: colors.textSecondary }}>
                No health information has been recorded for{' '}
                {selectedChild?.fullName || 'this student'} yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
