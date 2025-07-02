import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentDetails } from '../../../../services';

interface StudentBasicInfoProps {
  student: StudentDetails;
}

interface InfoRowProps {
  label: string;
  value: string | string[];
  icon?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => {
  const { colors } = useTheme();
  
  const displayValue = Array.isArray(value) 
    ? value.length > 0 
      ? value.join(', ') 
      : 'None specified'
    : value || 'Not specified';

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        {icon && (
          <Text className="mr-2 text-base">{icon}</Text>
        )}
        <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
          {label}
        </Text>
      </View>
      <Text className="text-base" style={{ color: colors.textPrimary }}>
        {displayValue}
      </Text>
    </View>
  );
};

const StudentBasicInfo: React.FC<StudentBasicInfoProps> = ({ student }) => {
  const { colors } = useTheme();

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
        📋 Basic Information
      </Text>

      <InfoRow 
        label="Full Name" 
        value={student.fullName}
        icon="👤"
      />

      <InfoRow 
        label="Class" 
        value={student.current_class?.name || 'No class assigned'}
        icon="🏫"
      />

      <InfoRow 
        label="Schedule" 
        value={`${student.schedule.time} • ${student.schedule.days}`}
        icon="⏰"
      />

      <InfoRow 
        label="Enrollment Number" 
        value={student.rollNum.toString()}
        icon="🔢"
      />

      <InfoRow 
        label="Date of Birth" 
        value={new Date(student.birthdate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        icon="🎂"
      />

      <InfoRow 
        label="Allergies" 
        value={student.allergies}
        icon="⚠️"
      />

      <InfoRow 
        label="Likes" 
        value={student.likes}
        icon="❤️"
      />

      <InfoRow 
        label="Photo Authorization" 
        value={student.authorizedPhotos ? 'Authorized' : 'Not authorized'}
        icon="📸"
      />
    </View>
  );
};

export default StudentBasicInfo;
