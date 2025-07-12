import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentDetails } from '../../../../services';
import { buildMediaUrl } from '../../../../config';

interface StudentInfoCardProps {
  student: StudentDetails;
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ student }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
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
      <View className="mb-6 flex-row items-center">
        <View className="mr-4">
          {student.photoUrl ? (
            <Image
              source={{ uri: buildMediaUrl(student.photoUrl) }}
              className="h-20 w-20 rounded-full"
              style={{
                borderWidth: 3,
                borderColor: colors.primary,
              }}
            />
          ) : (
            <View
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.primary + '20' }}>
              <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                {student.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {student.fullName}
          </Text>
          <Text className="text-lg" style={{ color: colors.primary }}>
            {student.current_class?.name || 'No Class Assigned'}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Enrollment #{student.rollNum}
          </Text>
        </View>
      </View>

      {/* Student Details Grid */}
      <View className="space-y-4">
        {/* Row 1: Age and Birthday */}
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-2xl mr-2">🎂</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                Age
              </Text>
            </View>
            <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {calculateAge(student.birthdate)} years old
            </Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-2xl mr-2">📅</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                Birthday
              </Text>
            </View>
            <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {formatDate(student.birthdate)}
            </Text>
          </View>
        </View>

        {/* Row 2: Status */}
        <View>
          <View className="flex-row items-center mb-1">
            <Text className="text-2xl mr-2">✅</Text>
            <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
              Status
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: student.active ? colors.success : colors.error }}
            />
            <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {student.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Row 3: Photo Authorization */}
        <View>
          <View className="flex-row items-center mb-1">
            <Text className="text-2xl mr-2">📸</Text>
            <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
              Photo Authorization
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: student.authorizedPhotos ? colors.success : colors.warning }}
            />
            <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {student.authorizedPhotos ? 'Authorized' : 'Not Authorized'}
            </Text>
          </View>
        </View>

        {/* Additional Info */}
        {student.additionalInfo && (
          <View>
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">📝</Text>
              <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                Additional Information
              </Text>
            </View>
            <View
              className="rounded-lg p-3"
              style={{ backgroundColor: colors.background }}>
              <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
                {student.additionalInfo}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
