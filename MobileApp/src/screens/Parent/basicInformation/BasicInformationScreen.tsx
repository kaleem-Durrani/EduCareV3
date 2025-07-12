import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import { studentService, StudentDetails, ParentStudent } from '../../../services';
import { ChildSelector, ScreenHeader } from '../../../components';
import { StudentInfoCard, ContactCard, ScheduleCard, HealthInfoCard } from './components';
import Toast from 'react-native-toast-message';

const BasicInformationScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const {
    children,
    isLoading: isLoadingChildren,
    error: childrenError,
    refreshChildren,
  } = useParentChildren();

  // API hook for fetching student details (parent-specific)
  const {
    request: fetchStudentDetails,
    isLoading: isLoadingStudent,
    error: studentError,
    data: studentDetails,
  } = useApi<StudentDetails>(studentService.getStudentBasicInfoForParent);

  const handleChildSelect = async (child: ParentStudent) => {
    setSelectedChild(child);
    setHasSearched(true);
    const response = await studentService.getStudentBasicInfoForParent(child._id);

    if (response.success) {
      await fetchStudentDetails(child._id);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load student details',
        visibilityTime: 3000,
      });
    }
  };

  const handleResetSelection = () => {
    setSelectedChild(null);
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await fetchStudentDetails(selectedChild._id);
    }
  };

  const isLoading = isLoadingChildren || isLoadingStudent;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Basic Information" navigation={navigation} showBackButton={true} />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        {/* Child Selector */}
        <View className="mt-4">
          <ChildSelector
            selectedChild={selectedChild}
            onChildSelect={handleChildSelect}
            onResetSelection={handleResetSelection}
            placeholder="Select a child to view their information"
            disabled={isLoadingChildren}
          />
        </View>

        {/* Loading State */}
        {isLoadingStudent && selectedChild && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="text-lg" style={{ color: colors.textSecondary }}>
              Loading {selectedChild.fullName}'s information...
            </Text>
          </View>
        )}

        {/* Error State */}
        {(childrenError || studentError) && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="text-lg" style={{ color: colors.error }}>
              {childrenError || studentError || 'Something went wrong'}
            </Text>
          </View>
        )}

        {/* Student Details */}
        {studentDetails && selectedChild && !isLoadingStudent && (
          <View className="mt-4 pb-8">
            {/* Debug info - remove after testing */}
            <Text style={{ color: colors.textPrimary }}>
              Debug: Contacts length: {studentDetails.contacts?.length || 0}
            </Text>
            <Text style={{ color: colors.textPrimary }}>
              Debug: Contacts data: {JSON.stringify(studentDetails.contacts, null, 2)}
            </Text>

            {/* Student Info Card */}
            <StudentInfoCard student={studentDetails} />

            {/* Emergency Contacts */}
            <ContactCard contacts={studentDetails.contacts} />

            {/* Schedule */}
            <ScheduleCard schedule={studentDetails.schedule} />

            {/* Health & Preferences */}
            <HealthInfoCard allergies={studentDetails.allergies} likes={studentDetails.likes} />
          </View>
        )}

        {/* Empty State */}
        {!selectedChild && !isLoading && hasSearched && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="mb-4 text-6xl">👶</Text>
            <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
              Select a Child
            </Text>
            <Text className="text-center" style={{ color: colors.textSecondary }}>
              Choose one of your children to view their detailed information
            </Text>
          </View>
        )}

        {/* No Children State */}
        {children.length === 0 && !isLoadingChildren && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="mb-4 text-6xl">👨‍👩‍👧‍👦</Text>
            <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
              No Children Found
            </Text>
            <Text className="text-center" style={{ color: colors.textSecondary }}>
              No children are associated with your account. Please contact the school
              administration.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BasicInformationScreen;
