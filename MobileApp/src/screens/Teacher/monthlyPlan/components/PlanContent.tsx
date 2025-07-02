import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../../contexts';
import { MonthlyPlan } from '../../../../services';

interface PlanContentProps {
  plan: MonthlyPlan | null;
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
}

const PlanContent: React.FC<PlanContentProps> = ({
  plan,
  error,
  isLoading,
  onRetry,
}) => {
  const { colors } = useTheme();

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
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
      minute: '2-digit'
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
          borderWidth: 1 
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Plan Not Found
          </Text>
          <Text className="text-sm text-center mb-4" style={{ color: colors.textSecondary }}>
            {error}
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={onRetry}
          >
            <Text className="text-white font-medium">Try Again</Text>
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
          borderWidth: 1 
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            No Plan Found
          </Text>
          <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
            No monthly plan exists for the selected class, month, and year.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
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
        }}
      >
        <Text className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {getMonthName(plan.month)} {plan.year}
        </Text>
        
        <Text className="text-base mb-3" style={{ color: colors.textSecondary }}>
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
          className="mb-4 rounded-lg overflow-hidden"
          style={{ 
            backgroundColor: colors.card, 
            borderColor: colors.border, 
            borderWidth: 1 
          }}
        >
          <Image
            source={{ uri: plan.imageUrl }}
            className="w-full h-48"
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
          borderWidth: 1 
        }}
      >
        <Text className="text-lg font-medium mb-3" style={{ color: colors.textPrimary }}>
          📝 Plan Description
        </Text>
        
        <View 
          className="p-4 rounded-lg"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
            {plan.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PlanContent;
