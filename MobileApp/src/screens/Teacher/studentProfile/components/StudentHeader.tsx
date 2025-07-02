import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentDetails } from '../../../../services';

interface StudentHeaderProps {
  student: StudentDetails;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({ student }) => {
  const { colors } = useTheme();

  const formatAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View
      className="mb-6 items-center rounded-lg p-6"
      style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border, 
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Student Photo */}
      <View
        className="mb-4 h-24 w-24 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        {student.photoUrl ? (
          // TODO: Add Image component when implementing photo uploads
          <Text className="text-white text-4xl">👶</Text>
        ) : (
          <Text className="text-white text-4xl">👶</Text>
        )}
      </View>

      {/* Student Name */}
      <Text className="text-center text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
        {student.fullName}
      </Text>

      {/* Student Details */}
      <View className="items-center">
        <Text className="text-center text-lg mb-1" style={{ color: colors.textSecondary }}>
          {student.current_class?.name || 'No class assigned'}
        </Text>
        
        <Text className="text-center text-base mb-1" style={{ color: colors.textSecondary }}>
          Enrollment #{student.rollNum}
        </Text>
        
        <Text className="text-center text-base" style={{ color: colors.textSecondary }}>
          Age {formatAge(student.birthdate)} • Born {formatDate(student.birthdate)}
        </Text>
      </View>

      {/* Status Badge */}
      <View 
        className="mt-3 px-3 py-1 rounded-full"
        style={{ 
          backgroundColor: student.active ? '#10B981' : '#EF4444' 
        }}
      >
        <Text className="text-white text-sm font-medium">
          {student.active ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </View>
  );
};

export default StudentHeader;
