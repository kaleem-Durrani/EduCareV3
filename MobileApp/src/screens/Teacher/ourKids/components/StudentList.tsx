import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useTheme } from '../../../../contexts';
import { EnrolledClass, ClassStudent } from '../../../../services';
import { ENV } from '../../../../config';

interface StudentListProps {
  classData: EnrolledClass;
  onStudentPress: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({
  classData,
  onStudentPress,
}) => {
  const { colors } = useTheme();

  const renderStudentCard = ({ item }: { item: ClassStudent }) => (
    <TouchableOpacity
      className="mb-3 p-4 rounded-lg border flex-row items-center"
      style={{ 
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={() => onStudentPress(item._id)}
    >
      {/* Student Photo */}
      <View className="w-12 h-12 rounded-full mr-4 overflow-hidden">
        {item.photoUrl ? (
          <Image
            source={{ uri: `${ENV.SERVER_URL}/${item.photoUrl}` }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => {
              console.log('Failed to load student image');
            }}
          />
        ) : (
          <View
            className="w-full h-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-lg">👶</Text>
          </View>
        )}
      </View>

      {/* Student Info */}
      <View className="flex-1">
        <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
          {item.fullName}
        </Text>
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          Enrollment #{item.rollNum}
        </Text>
      </View>

      {/* Arrow Icon */}
      <Text className="text-lg" style={{ color: colors.textSecondary }}>
        →
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="items-center py-8">
      <Text className="text-lg" style={{ color: colors.textPrimary }}>
        No students in this class
      </Text>
      <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
        This class doesn't have any students enrolled yet.
      </Text>
    </View>
  );

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
          Students in {classData.name}
        </Text>
        <View 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white text-sm font-medium">
            {classData.students.length}
          </Text>
        </View>
      </View>

      {classData.students.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={classData.students}
          keyExtractor={(item) => item._id}
          renderItem={renderStudentCard}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disable scroll since we're inside a ScrollView
        />
      )}
    </View>
  );
};

export default StudentList;
