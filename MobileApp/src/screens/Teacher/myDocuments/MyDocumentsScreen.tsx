import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { useApi } from '../../../hooks';
import { documentService, StudentDocuments, ClassStudent } from '../../../services';
import { LoadingScreen, ScreenHeader, StudentSelector } from '../../../components';
import DocumentsContent from './components/DocumentsContent';

const MyDocumentsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use teacher classes context
  const { isLoading: isLoadingClasses, error: classesError, refreshClasses } = useTeacherClasses();

  // API hook for fetching student documents
  const {
    request: fetchDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
    data: studentDocuments,
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

      <ScreenHeader navigation={navigation} title={'Documents'} />

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {classesError ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="mb-2 text-center text-lg" style={{ color: colors.textPrimary }}>
              Failed to load classes
            </Text>
            <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
              {classesError}
            </Text>
            <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3" onPress={refreshClasses}>
              <Text className="font-medium text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Student Selector */}
            <StudentSelector
              selectedStudent={selectedStudent}
              onStudentSelect={handleStudentSelect}
              onResetSelection={handleResetSelection}
              placeholder="Select a student to view documents"
              showAsTag={true}
              compact={false}
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
