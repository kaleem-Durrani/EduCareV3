import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts';
import { MonthlyPlan } from '../../../../services';

interface PlanContentProps {
  plan: MonthlyPlan | null;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  selectedMonth: number;
  selectedYear: number;
  childName?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const PlanContent: React.FC<PlanContentProps> = ({
  plan,
  isLoading,
  error,
  hasSearched,
  selectedMonth,
  selectedYear,
  childName,
}) => {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
          Loading monthly plan...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-2 text-center text-lg font-medium" style={{ color: colors.error }}>
          Error Loading Plan
        </Text>
        <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
          {error}
        </Text>
      </View>
    );
  }

  if (!hasSearched) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-center text-lg" style={{ color: colors.textSecondary }}>
          Select a child and month to view the monthly plan
        </Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-2 text-center text-lg font-medium" style={{ color: colors.textPrimary }}>
          No Plan Available
        </Text>
        <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
          No monthly plan found for {MONTHS[selectedMonth - 1]} {selectedYear}
          {childName && ` for ${childName}`}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      {/* Plan Header */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
      >
        <Text className="mb-1 text-lg font-bold" style={{ color: colors.primary }}>
          {MONTHS[selectedMonth - 1]} {selectedYear} Plan
        </Text>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Class: {plan.class_id.name}
        </Text>
        {childName && (
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Student: {childName}
          </Text>
        )}
      </View>

      {/* Plan Image */}
      {plan.imageUrl && (
        <View className="mb-4">
          <Image
            source={{ uri: plan.imageUrl }}
            className="h-48 w-full rounded-lg"
            resizeMode="cover"
            style={{ backgroundColor: colors.surface }}
          />
        </View>
      )}

      {/* Plan Description */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
      >
        <Text className="mb-2 text-base font-medium" style={{ color: colors.textPrimary }}>
          Monthly Plan Details
        </Text>
        <Text className="text-sm leading-6" style={{ color: colors.textPrimary }}>
          {plan.description}
        </Text>
      </View>

      {/* Plan Metadata */}
      <View
        className="rounded-lg p-4"
        style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
      >
        <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
          Plan Information
        </Text>
        
        <View className="mb-2 flex-row">
          <Text className="w-20 text-xs" style={{ color: colors.textSecondary }}>
            Created by:
          </Text>
          <Text className="flex-1 text-xs" style={{ color: colors.textPrimary }}>
            {plan.createdBy.name}
          </Text>
        </View>
        
        <View className="mb-2 flex-row">
          <Text className="w-20 text-xs" style={{ color: colors.textSecondary }}>
            Created:
          </Text>
          <Text className="flex-1 text-xs" style={{ color: colors.textPrimary }}>
            {new Date(plan.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        {plan.updatedBy && (
          <>
            <View className="mb-2 flex-row">
              <Text className="w-20 text-xs" style={{ color: colors.textSecondary }}>
                Updated by:
              </Text>
              <Text className="flex-1 text-xs" style={{ color: colors.textPrimary }}>
                {plan.updatedBy.name}
              </Text>
            </View>
            
            <View className="flex-row">
              <Text className="w-20 text-xs" style={{ color: colors.textSecondary }}>
                Updated:
              </Text>
              <Text className="flex-1 text-xs" style={{ color: colors.textPrimary }}>
                {new Date(plan.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};
