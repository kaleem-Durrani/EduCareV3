import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { useApi } from '../../../hooks';
import { monthlyPlanService, EnrolledClass, MonthlyPlan } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import PlanSelector from './components/PlanSelector';
import PlanContent from './components/PlanContent';

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
    refreshClasses
  } = useTeacherClasses();

  // API hook for fetching monthly plan
  const {
    request: fetchPlan,
    isLoading: isLoadingPlan,
    error: planError,
    data: plan
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
            Monthly Plan
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
