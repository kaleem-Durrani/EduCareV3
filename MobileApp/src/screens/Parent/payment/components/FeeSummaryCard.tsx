import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { FeeSummary } from '../../../../services';

interface FeeSummaryCardProps {
  feeSummary: FeeSummary;
}

export const FeeSummaryCard: React.FC<FeeSummaryCardProps> = ({ feeSummary }) => {
  const { colors } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPaymentRate = () => {
    if (feeSummary.fees.total === 0) return 0;
    return Math.round((feeSummary.fees.paid / feeSummary.fees.total) * 100);
  };

  return (
    <View
      className="rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
      }}>
      
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary + '20' }}>
          <Text className="text-2xl">💰</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            Payment Summary
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {feeSummary.student.fullName}'s payment overview for {feeSummary.year}
          </Text>
        </View>
      </View>

      {/* Statistics Grid */}
      <View className="mb-4 flex-row flex-wrap">
        <View className="mb-3 w-1/2 pr-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: colors.primary + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
              {feeSummary.fees.total}
            </Text>
            <Text className="text-sm" style={{ color: colors.primary }}>
              Total Fees
            </Text>
          </View>
        </View>
        
        <View className="mb-3 w-1/2 pl-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: '#10B981' + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: '#10B981' }}>
              {feeSummary.fees.paid}
            </Text>
            <Text className="text-sm" style={{ color: '#10B981' }}>
              Paid
            </Text>
          </View>
        </View>

        <View className="mb-3 w-1/2 pr-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: '#F59E0B' + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
              {feeSummary.fees.pending}
            </Text>
            <Text className="text-sm" style={{ color: '#F59E0B' }}>
              Pending
            </Text>
          </View>
        </View>

        <View className="mb-3 w-1/2 pl-2">
          <View
            className="rounded-lg p-3"
            style={{ backgroundColor: '#EF4444' + '10' }}>
            <Text className="text-2xl font-bold" style={{ color: '#EF4444' }}>
              {feeSummary.fees.overdue}
            </Text>
            <Text className="text-sm" style={{ color: '#EF4444' }}>
              Overdue
            </Text>
          </View>
        </View>
      </View>

      {/* Amount Summary */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
        <Text className="mb-3 text-base font-semibold" style={{ color: colors.textPrimary }}>
          Amount Summary
        </Text>
        
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Total Amount
          </Text>
          <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
            {formatCurrency(feeSummary.amounts.total)}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Paid Amount
          </Text>
          <Text className="text-base font-semibold" style={{ color: '#10B981' }}>
            {formatCurrency(feeSummary.amounts.paid)}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Pending Amount
          </Text>
          <Text className="text-base font-semibold" style={{ color: '#F59E0B' }}>
            {formatCurrency(feeSummary.amounts.pending)}
          </Text>
        </View>
      </View>

      {/* Payment Progress */}
      <View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            Payment Progress
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {getPaymentRate()}%
          </Text>
        </View>
        <View
          className="h-3 rounded-full"
          style={{ backgroundColor: colors.border }}>
          <View
            className="h-3 rounded-full"
            style={{
              backgroundColor: '#10B981',
              width: `${getPaymentRate()}%`,
            }}
          />
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {feeSummary.fees.paid} of {feeSummary.fees.total} fees paid
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {feeSummary.fees.pending} remaining
          </Text>
        </View>
      </View>
    </View>
  );
};
