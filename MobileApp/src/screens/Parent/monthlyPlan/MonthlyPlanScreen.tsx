import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useParentChildren } from '../../../contexts';
import { useApi } from '../../../hooks';
import { monthlyPlanService, ParentStudent, MonthlyPlan } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import { ChildSelector, MonthPicker, PlanContent } from './components';

const MonthlyPlanScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const {
    children,
    isLoading: isLoadingChildren,
    error: childrenError,
    refreshChildren,
  } = useParentChildren();

  // API hook for fetching monthly plan
  const {
    request: fetchPlan,
    isLoading: isLoadingPlan,
    error: planError,
    data: plan,
  } = useApi<MonthlyPlan>(monthlyPlanService.getMonthlyPlanForParent);

  const handleLoadPlan = async () => {
    if (!selectedChild) {
      return;
    }

    try {
      setHasSearched(true);
      await fetchPlan(selectedChild._id, selectedMonth, selectedYear);
    } catch (err) {
      console.error('Failed to load monthly plan:', err);
    }
  };

  // Show loading screen if children are still loading
  if (isLoadingChildren) {
    return <LoadingScreen />;
  }

  // Show error if failed to load children
  if (childrenError) {
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
              Monthly Plan
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-2 text-center text-lg font-medium" style={{ color: colors.error }}>
            Error Loading Children
          </Text>
          <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
            {childrenError}
          </Text>
          <TouchableOpacity
            className="rounded-lg px-4 py-2"
            style={{ backgroundColor: colors.primary }}
            onPress={refreshChildren}>
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            Monthly Plan
          </Text>
        </TouchableOpacity>
      </View>

      {children.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Children Found
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            You don't have any children registered in the system.
          </Text>
        </View>
      ) : (
        <>
          {/* Plan Selector */}
          <ScrollView className="px-4">
            <View
              className="mb-4 rounded-lg p-4"
              style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
              <Text className="mb-4 text-base font-medium" style={{ color: colors.textPrimary }}>
                Select Child and Month
              </Text>

              {/* Child Selector */}
              <ChildSelector
                selectedChild={selectedChild}
                onChildSelect={setSelectedChild}
                placeholder="Choose your child..."
              />

              {/* Month Picker */}
              <MonthPicker
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthSelect={setSelectedMonth}
                onYearSelect={setSelectedYear}
              />

              {/* Load Plan Button */}
              <TouchableOpacity
                className="rounded-lg py-3"
                style={{
                  backgroundColor: selectedChild ? colors.primary : colors.surface,
                  opacity: selectedChild ? 1 : 0.6,
                }}
                onPress={handleLoadPlan}
                disabled={!selectedChild || isLoadingPlan}>
                <Text
                  className="text-center font-medium"
                  style={{ color: selectedChild ? 'white' : colors.textSecondary }}>
                  {isLoadingPlan ? 'Loading Plan...' : 'Load Monthly Plan'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Plan Content */}
          <PlanContent
            plan={plan}
            isLoading={isLoadingPlan}
            error={planError}
            hasSearched={hasSearched}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            childName={selectedChild?.fullName}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default MonthlyPlanScreen;
