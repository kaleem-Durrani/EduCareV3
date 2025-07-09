import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { useApi } from '../../../hooks';
import { monthlyPlanService, EnrolledClass, MonthlyPlan } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import PlanSelector from './components/PlanSelector';
import PlanContent from './components/PlanContent';
import { ScreenHeader } from '~/components';

const MonthlyPlanScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedClass, setSelectedClass] = useState<EnrolledClass | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hasSearched, setHasSearched] = useState(false);

  // Use teacher classes context
  const {
    classes,
    isLoading: isLoadingClasses,
    error: classesError,
    refreshClasses,
  } = useTeacherClasses();

  // API hook for fetching monthly plan
  const {
    request: fetchPlan,
    isLoading: isLoadingPlan,
    error: planError,
    data: plan,
  } = useApi<MonthlyPlan>(monthlyPlanService.getMonthlyPlan);

  const handleLoadPlan = async () => {
    if (!selectedClass) return;

    setHasSearched(true);
    await fetchPlan(selectedClass._id, selectedMonth, selectedYear);
  };

  if (isLoadingClasses) {
    return <LoadingScreen message="Loading your classes..." />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}

      <ScreenHeader navigation={navigation} title={'Monthly Plan'} />

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
            {/* Plan Selector */}
            <PlanSelector
              classes={classes}
              selectedClass={selectedClass}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onClassSelect={setSelectedClass}
              onMonthSelect={setSelectedMonth}
              onYearSelect={setSelectedYear}
              onLoadPlan={handleLoadPlan}
              isLoading={isLoadingPlan}
            />

            {/* Plan Content */}
            {hasSearched && (
              <PlanContent
                plan={plan}
                error={planError}
                isLoading={isLoadingPlan}
                onRetry={handleLoadPlan}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MonthlyPlanScreen;
