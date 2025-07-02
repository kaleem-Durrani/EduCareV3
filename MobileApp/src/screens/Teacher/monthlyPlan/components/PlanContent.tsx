import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../../contexts';
import { MonthlyPlan } from '../../../../services';
import { ENV } from '~/config';

interface PlanContentProps {
  plan: MonthlyPlan | null;
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
}

const PlanContent: React.FC<PlanContentProps> = ({ plan, error, isLoading, onRetry }) => {
  const { colors } = useTheme();

  const getMonthName = (month: number) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1] || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Loading plan...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <View className="items-center">
          <Text className="mb-2 text-lg font-medium" style={{ color: colors.textPrimary }}>
            Plan Not Found
          </Text>
          <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
            {error}
          </Text>
          <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3" onPress={onRetry}>
            <Text className="font-medium text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!plan) {
    return (
      <View
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <View className="items-center">
          <Text className="mb-2 text-lg font-medium" style={{ color: colors.textPrimary }}>
            No Plan Found
          </Text>
          <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
            No monthly plan exists for the selected class, month, and year.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-bold" style={{ color: colors.textPrimary }}>
        📚 Monthly Plan Details
      </Text>

      {/* Plan Header */}
      <View
        className="mb-4 rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
          {getMonthName(plan.month)} {plan.year}
        </Text>

        <Text className="mb-3 text-base" style={{ color: colors.textSecondary }}>
          📚 Class: {plan.class_id.name}
        </Text>

        <View className="border-t pt-3" style={{ borderTopColor: colors.border }}>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Created by: {plan.createdBy.name}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Created: {formatDate(plan.createdAt)}
          </Text>
          {plan.updatedBy && (
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Last updated: {formatDate(plan.updatedAt)}
            </Text>
          )}
        </View>
      </View>

      {/* Plan Image */}
      {plan.imageUrl && (
        <View
          className="mb-4 overflow-hidden rounded-lg"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}>
          <Image
            source={{ uri: `${ENV.SERVER_URL}/${plan.imageUrl}` }}
            className="h-48 w-full"
            resizeMode="cover"
            onError={() => {
              console.log('Failed to load plan image');
            }}
          />
        </View>
      )}

      {/* Plan Description */}
      <View
        className="rounded-lg p-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}>
        <Text className="mb-3 text-lg font-medium" style={{ color: colors.textPrimary }}>
          📝 Plan Description
        </Text>

        <View className="rounded-lg p-4" style={{ backgroundColor: colors.background }}>
          <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
            {plan.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PlanContent;
