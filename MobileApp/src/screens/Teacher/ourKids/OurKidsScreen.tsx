import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { EnrolledClass } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import ClassSelector from './components/ClassSelector';
import StudentList from './components/StudentList';
import Entypo from 'react-native-vector-icons/Entypo';
import { ScreenHeader } from '~/components';

const OurKidsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedClass, setSelectedClass] = useState<EnrolledClass | null>(null);

  // Use teacher classes context
  const {
    classes,
    isLoading: isLoadingClasses,
    error: classesError,
    refreshClasses,
  } = useTeacherClasses();

  const handleStudentPress = (studentId: string) => {
    navigation.navigate('StudentProfile', { studentId });
  };

  const handleClassSelect = (classItem: EnrolledClass) => {
    setSelectedClass(classItem);
  };

  if (isLoadingClasses) {
    return <LoadingScreen message="Loading your classes..." />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}

      <ScreenHeader navigation={navigation} title={'Our Kids'} />

      {/* Content */}
      <ScrollView className=" flex-1 px-4">
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
            {/* Class Selector */}
            <ClassSelector
              classes={classes}
              selectedClass={selectedClass}
              onClassSelect={handleClassSelect}
            />

            {/* Student List */}
            {selectedClass && (
              <StudentList classData={selectedClass} onStudentPress={handleStudentPress} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OurKidsScreen;
