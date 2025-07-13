import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentDocumentItem } from '../../../../services';

interface DocumentDetailModalProps {
  visible: boolean;
  document: StudentDocumentItem | null;
  onClose: () => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  visible,
  document,
  onClose,
}) => {
  const { colors } = useTheme();

  if (!document) return null;

  const getStatusIcon = () => {
    if (document.submitted) {
      return '✅';
    } else if (document.document_type_id.required) {
      return '❗';
    } else {
      return '⚪';
    }
  };

  const getStatusText = () => {
    if (document.submitted) {
      return 'Submitted';
    } else if (document.document_type_id.required) {
      return 'Required - Pending';
    } else {
      return 'Optional - Not Submitted';
    }
  };

  const getStatusColor = () => {
    if (document.submitted) {
      return '#10B981'; // Green
    } else if (document.document_type_id.required) {
      return '#EF4444'; // Red
    } else {
      return colors.textSecondary; // Gray
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
              Document Details
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {document.document_type_id.name}
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
          {/* Status Card */}
          <View
            className="mb-6 rounded-xl p-5"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 5,
              borderLeftWidth: 6,
              borderLeftColor: getStatusColor(),
            }}>
            <View className="mb-4 flex-row items-center">
              <Text className="mr-3 text-4xl">{getStatusIcon()}</Text>
              <View className="flex-1">
                <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                  {getStatusText()}
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Current submission status
                </Text>
              </View>
            </View>

            {/* Status Details */}
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Document Type:
                </Text>
                <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {document.document_type_id.required ? 'Required' : 'Optional'}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Submission Status:
                </Text>
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: getStatusColor() + '20' }}>
                  <Text className="text-xs font-semibold" style={{ color: getStatusColor() }}>
                    {document.submitted ? 'Submitted' : 'Not Submitted'}
                  </Text>
                </View>
              </View>

              {document.submission_date && (
                <View className="flex-row justify-between">
                  <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Submission Date:
                  </Text>
                  <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {formatDate(document.submission_date)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Document Information */}
          <View
            className="mb-6 rounded-xl p-5"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <View className="mb-4 flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary + '20' }}>
                <Text className="text-lg">📄</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Document Information
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Details about this document requirement
                </Text>
              </View>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Document Name
                </Text>
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {document.document_type_id.name}
                </Text>
              </View>

              {document.document_type_id.description && (
                <View>
                  <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Description
                  </Text>
                  <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
                    {document.document_type_id.description}
                  </Text>
                </View>
              )}

              <View>
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Requirement Level
                </Text>
                <View
                  className="self-start rounded-full px-3 py-1"
                  style={{
                    backgroundColor: document.document_type_id.required ? '#F59E0B' + '20' : colors.primary + '20',
                  }}>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: document.document_type_id.required ? '#F59E0B' : colors.primary,
                    }}>
                    {document.document_type_id.required ? 'Required Document' : 'Optional Document'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes Section */}
          {document.notes && (
            <View
              className="mb-6 rounded-xl p-5"
              style={{
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
              <View className="mb-4 flex-row items-center">
                <View
                  className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.info + '20' }}>
                  <Text className="text-lg">📝</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    Notes
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Additional information about this document
                  </Text>
                </View>
              </View>

              <View
                className="rounded-lg p-4"
                style={{ backgroundColor: colors.background }}>
                <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
                  {document.notes}
                </Text>
              </View>
            </View>
          )}

          {/* Help Section */}
          <View
            className="rounded-xl p-5"
            style={{
              backgroundColor: colors.info + '10',
              borderWidth: 1,
              borderColor: colors.info + '30',
            }}>
            <View className="mb-3 flex-row items-center">
              <Text className="mr-2 text-lg">💡</Text>
              <Text className="text-lg font-bold" style={{ color: colors.info }}>
                Need Help?
              </Text>
            </View>
            <Text className="text-sm leading-5" style={{ color: colors.info }}>
              If you have questions about this document or need assistance with submission, please contact the school administration office.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
