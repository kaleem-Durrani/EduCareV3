import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useTheme } from '../../../../contexts';
import { ClassStudent, StudentDocuments, StudentDocumentItem } from '../../../../services';
import { ENV } from '../../../../config';

interface DocumentsContentProps {
  selectedStudent: ClassStudent | null;
  studentDocuments: StudentDocuments | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const DocumentsContent: React.FC<DocumentsContentProps> = ({
  selectedStudent,
  studentDocuments,
  isLoading,
  error,
  onRetry,
}) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (submitted: boolean, required: boolean) => {
    if (submitted) return '#10B981'; // Green
    if (required) return '#EF4444'; // Red
    return '#F59E0B'; // Yellow
  };

  const getStatusText = (submitted: boolean, required: boolean) => {
    if (submitted) return 'Submitted';
    if (required) return 'Required';
    return 'Optional';
  };

  const getStatusIcon = (submitted: boolean, required: boolean) => {
    if (submitted) return '✅';
    if (required) return '❌';
    return '⚠️';
  };

  const calculateStats = () => {
    if (!studentDocuments?.documents)
      return { total: 0, submitted: 0, required: 0, submittedRequired: 0 };

    const total = studentDocuments.documents.length;
    const submitted = studentDocuments.documents.filter((doc) => doc.submitted).length;
    const required = studentDocuments.documents.filter(
      (doc) => doc.document_type_id.required
    ).length;
    const submittedRequired = studentDocuments.documents.filter(
      (doc) => doc.submitted && doc.document_type_id.required
    ).length;

    return { total, submitted, required, submittedRequired };
  };

  const renderDocumentItem = ({ item }: { item: StudentDocumentItem }) => (
    <View
      className="mb-3 rounded-lg border p-4"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}>
      {/* Document Header */}
      <View className="mb-2 flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
            {item.document_type_id.name}
          </Text>
          {item.document_type_id.description && (
            <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
              {item.document_type_id.description}
            </Text>
          )}
        </View>

        {/* Status Badge */}
        <View className="items-center">
          <View
            className="flex-row items-center rounded-full px-3 py-1"
            style={{
              backgroundColor: getStatusColor(item.submitted, item.document_type_id.required),
            }}>
            <Text className="mr-1 text-xs text-white">
              {getStatusIcon(item.submitted, item.document_type_id.required)}
            </Text>
            <Text className="text-xs font-medium text-white">
              {getStatusText(item.submitted, item.document_type_id.required)}
            </Text>
          </View>
          {item.document_type_id.required && (
            <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
              Required
            </Text>
          )}
        </View>
      </View>

      {/* Submission Details */}
      {item.submitted && item.submission_date && (
        <View className="mt-2 rounded-lg p-3" style={{ backgroundColor: colors.background }}>
          <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            📅 Submitted: {formatDate(item.submission_date)}
          </Text>
        </View>
      )}

      {/* Notes */}
      {item.notes && (
        <View className="mt-2 rounded-lg p-3" style={{ backgroundColor: colors.background }}>
          <Text className="text-sm" style={{ color: colors.textPrimary }}>
            📝 {item.notes}
          </Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Loading documents...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <View className="items-center">
          <Text className="mb-2 text-lg font-medium" style={{ color: colors.textPrimary }}>
            Failed to Load Documents
          </Text>
          <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
            {error}
          </Text>
          <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3" onPress={onRetry}>
            <Text className="font-medium text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!studentDocuments) {
    return (
      <View
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <View className="items-center">
          <Text className="mb-2 text-lg font-medium" style={{ color: colors.textPrimary }}>
            Documents Not Found
          </Text>
          <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
            Unable to load documents for this student.
          </Text>
        </View>
      </View>
    );
  }

  const stats = calculateStats();

  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-bold" style={{ color: colors.textPrimary }}>
        📄 Documents - {selectedStudent?.fullName}
      </Text>

      {/* Student Header */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <View className="flex-row items-center">
          {/* Student Photo */}
          <View className="mr-4 h-12 w-12 overflow-hidden rounded-full">
            {selectedStudent?.photoUrl ? (
              <Image
                source={{ uri: `${ENV.SERVER_URL}/${selectedStudent.photoUrl}` }}
                className="h-full w-full"
                resizeMode="cover"
                onError={() => {
                  console.log('Failed to load student image');
                }}
              />
            ) : (
              <View
                className="h-full w-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}>
                <Text className="text-lg text-white">👶</Text>
              </View>
            )}
          </View>

          {/* Student Info */}
          <View className="flex-1">
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              {studentDocuments.student_id.fullName}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Enrollment #{studentDocuments.student_id.rollNum}
            </Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <Text className="mb-3 text-lg font-medium" style={{ color: colors.textPrimary }}>
          📊 Document Statistics
        </Text>

        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
              {stats.submitted}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Submitted
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl font-bold" style={{ color: '#EF4444' }}>
              {stats.required - stats.submittedRequired}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Missing Required
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {stats.total}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Total Documents
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl font-bold" style={{ color: '#10B981' }}>
              {Math.round((stats.submitted / stats.total) * 100)}%
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Completion
            </Text>
          </View>
        </View>
      </View>

      {/* Documents List */}
      <View
        className="rounded-lg p-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <Text className="mb-4 text-lg font-medium" style={{ color: colors.textPrimary }}>
          📋 Document Checklist
        </Text>

        {studentDocuments.documents && studentDocuments.documents.length > 0 ? (
          <FlatList
            data={studentDocuments.documents}
            keyExtractor={(item, index) => item.document_type_id?._id || `doc-${index}`}
            renderItem={renderDocumentItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Disable scroll since we're inside a ScrollView
          />
        ) : (
          <View className="items-center py-4">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              No documents available
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DocumentsContent;
