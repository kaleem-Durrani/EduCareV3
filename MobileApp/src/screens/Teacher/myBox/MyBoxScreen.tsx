import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { useApi } from '../../../hooks';
import { boxService, StudentBoxStatus, ClassStudent } from '../../../services';
import { LoadingScreen, ScreenHeader, StudentSelector } from '../../../components';
import BoxStatusContent from './components/BoxStatusContent';

const MyBoxScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use teacher classes context
  const { isLoading: isLoadingClasses, error: classesError, refreshClasses } = useTeacherClasses();

  // API hook for fetching student box status
  const {
    request: fetchBoxStatus,
    isLoading: isLoadingBox,
    error: boxError,
    data: boxStatus,
  } = useApi<StudentBoxStatus>(boxService.getStudentBoxStatus);

  // API hook for updating student box status
  const {
    request: updateBoxStatus,
    isLoading: isUpdating,
    error: updateError,
  } = useApi<StudentBoxStatus>(boxService.updateStudentBoxStatus);

  const handleStudentSelect = async (student: ClassStudent) => {
    setSelectedStudent(student);
    setHasSearched(true);
    await fetchBoxStatus(student._id);
  };

  const handleResetSelection = () => {
    setSelectedStudent(null);
    setHasSearched(false);
  };

  const handleUpdateBoxStatus = async (items: any[]) => {
    if (!selectedStudent) return;

    await updateBoxStatus(selectedStudent._id, { items });
    // Refresh the box status after update
    await fetchBoxStatus(selectedStudent._id);
  };

  if (isLoadingClasses) {
    return <LoadingScreen message="Loading your classes..." />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}

      <ScreenHeader navigation={navigation} title={'Child Box'} />

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
              placeholder="Select a student to view box status"
              showAsTag={true}
              compact={false}
            />

            {/* Box Status Content */}
            {hasSearched && (
              <BoxStatusContent
                selectedStudent={selectedStudent}
                boxStatus={boxStatus}
                isLoading={isLoadingBox}
                error={boxError}
                isUpdating={isUpdating}
                updateError={updateError}
                onRetry={() => selectedStudent && fetchBoxStatus(selectedStudent._id)}
                onUpdateBoxStatus={handleUpdateBoxStatus}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBoxScreen;
