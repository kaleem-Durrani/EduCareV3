import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentDocumentItem } from '../../../../services';

interface DocumentCardProps {
  document: StudentDocumentItem;
  onPress: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress }) => {
  const { colors } = useTheme();

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
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      className="mb-4 rounded-xl p-4"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(),
      }}
      onPress={onPress}
      activeOpacity={0.7}>
      
      {/* Header */}
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            {document.document_type_id.name}
          </Text>
          {document.document_type_id.description && (
            <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
              {document.document_type_id.description}
            </Text>
          )}
        </View>
        
        {/* Status Icon */}
        <View className="items-center">
          <Text className="text-2xl mb-1">{getStatusIcon()}</Text>
          {document.document_type_id.required && (
            <View
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: '#F59E0B' + '20' }}>
              <Text className="text-xs font-semibold" style={{ color: '#F59E0B' }}>
                Required
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Status and Date */}
      <View className="flex-row items-center justify-between">
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: getStatusColor() + '20' }}>
          <Text className="text-sm font-semibold" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </Text>
        </View>
        
        {document.submission_date && (
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Submitted: {formatDate(document.submission_date)}
          </Text>
        )}
      </View>

      {/* Notes Preview */}
      {document.notes && (
        <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Notes: {document.notes.length > 100 ? `${document.notes.substring(0, 100)}...` : document.notes}
          </Text>
        </View>
      )}

      {/* Tap to view indicator */}
      <View className="mt-3 flex-row items-center justify-center">
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          Tap to view details
        </Text>
        <Text className="ml-1 text-xs" style={{ color: colors.primary }}>
          →
        </Text>
      </View>
    </TouchableOpacity>
  );
};
