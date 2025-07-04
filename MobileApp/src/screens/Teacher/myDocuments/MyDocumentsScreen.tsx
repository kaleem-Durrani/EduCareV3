import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { useApi } from '../../../hooks';
import { documentService, StudentDocuments, ClassStudent } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import StudentSelector from '../contacts/components/StudentSelector'; // Reuse the same selector
import DocumentsContent from './components/DocumentsContent';

const MyDocumentsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use teacher classes context
  const {
    classes,
    allStudents,
    studentsByClass,
    isLoading: isLoadingClasses,
    error: classesError,
    refreshClasses
  } = useTeacherClasses();

  // API hook for fetching student documents
  const {
    request: fetchDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
    data: studentDocuments
  } = useApi<StudentDocuments>(documentService.getStudentDocuments);

  const handleStudentSelect = async (student: ClassStudent) => {
    setSelectedStudent(student);
    setHasSearched(true);
    await fetchDocuments(student._id);
  };

  const handleResetSelection = () => {
    setSelectedStudent(null);
    setHasSearched(false);
  };

  if (isLoadingClasses) {
    return <LoadingScreen message="Loading your classes..." />;
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
            My Documents
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {classesError ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-center text-lg mb-2" style={{ color: colors.textPrimary }}>
              Failed to load classes
            </Text>
            <Text className="text-center text-sm mb-4" style={{ color: colors.textSecondary }}>
              {classesError}
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg"
              onPress={refreshClasses}
            >
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !classes || classes.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
              No classes assigned
            </Text>
            <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
              You are not currently assigned to any classes.
            </Text>
          </View>
        ) : (
          <>
            {/* Student Selector */}
            <StudentSelector
              classes={classes}
              allStudents={allStudents}
              studentsByClass={studentsByClass}
              onStudentSelect={handleStudentSelect}
              onResetSelection={handleResetSelection}
            />

            {/* Documents Content */}
            {hasSearched && (
              <DocumentsContent
                selectedStudent={selectedStudent}
                studentDocuments={studentDocuments}
                isLoading={isLoadingDocuments}
                error={documentsError}
                onRetry={() => selectedStudent && fetchDocuments(selectedStudent._id)}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyDocumentsScreen;
