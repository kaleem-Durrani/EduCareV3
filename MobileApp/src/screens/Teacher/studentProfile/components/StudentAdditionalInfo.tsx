import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentDetails } from '../../../../services';

interface StudentAdditionalInfoProps {
  student: StudentDetails;
}

const StudentAdditionalInfo: React.FC<StudentAdditionalInfoProps> = ({ student }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View
      className="mb-6 rounded-lg p-4"
      style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border, 
        borderWidth: 1 
      }}
    >
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        📝 Additional Information
      </Text>

      {/* Additional Notes */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
          📋 Additional Notes
        </Text>
        <View 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-base" style={{ color: colors.textPrimary }}>
            {student.additionalInfo || 'No additional information provided.'}
          </Text>
        </View>
      </View>

      {/* Record Information */}
      <View className="border-t pt-4" style={{ borderTopColor: colors.border }}>
        <Text className="text-sm font-medium mb-3" style={{ color: colors.textSecondary }}>
          📊 Record Information
        </Text>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Student ID:
          </Text>
          <Text className="text-sm font-mono" style={{ color: colors.textPrimary }}>
            {student._id}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Created:
          </Text>
          <Text className="text-sm" style={{ color: colors.textPrimary }}>
            {formatDate(student.createdAt)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Last Updated:
          </Text>
          <Text className="text-sm" style={{ color: colors.textPrimary }}>
            {formatDate(student.updatedAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StudentAdditionalInfo;
