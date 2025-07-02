import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useApi } from '../../../hooks';
import { studentService, StudentDetails } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import StudentHeader from './components/StudentHeader';
import StudentBasicInfo from './components/StudentBasicInfo';
import StudentContacts from './components/StudentContacts';
import StudentAdditionalInfo from './components/StudentAdditionalInfo';

interface StudentProfileScreenProps {
  navigation: any;
  route: {
    params: {
      studentId: string;
    };
  };
}

const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  // API hook for fetching student details
  const {
    request: fetchStudent,
    isLoading,
    error,
    data: student
  } = useApi<StudentDetails>(studentService.getStudentById);

  useEffect(() => {
    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  const loadStudent = async () => {
    await fetchStudent(studentId);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading student profile..." />;
  }

  if (error || !student) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="items-center pb-4 pt-4">
          <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
            Centro Infantil EDUCARE
          </Text>
          <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
        </View>

        <View className="px-4 py-2">
          <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
            <Text className="mr-2 text-2xl">←</Text>
            <Text className="text-lg font-medium" style={{ color: colors.primary }}>
              Student Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg mb-2" style={{ color: colors.textPrimary }}>
            Failed to load student
          </Text>
          {error && (
            <Text className="text-center text-sm mb-4" style={{ color: colors.textSecondary }}>
              {error}
            </Text>
          )}
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={loadStudent}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      {/* Navigation Header */}
      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Student Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        <StudentHeader student={student} />
        <StudentBasicInfo student={student} />
        <StudentContacts student={student} />
        <StudentAdditionalInfo student={student} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentProfileScreen;
