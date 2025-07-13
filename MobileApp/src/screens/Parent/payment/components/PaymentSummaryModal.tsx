import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts';
import { FeeSummary, ParentStudent } from '../../../../services';

interface PaymentSummaryModalProps {
  visible: boolean;
  selectedChild: ParentStudent | null;
  feeSummaryData: FeeSummary | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export const PaymentSummaryModal: React.FC<PaymentSummaryModalProps> = ({
  visible,
  selectedChild,
  feeSummaryData,
  isLoading,
  error,
  onClose,
}) => {
  const { colors } = useTheme();

  const formatCurrency = (amount: number | string) => {
    // Ensure amount is a number
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  // Debug logging to help identify the issue
  if (feeSummaryData) {
    console.log('Fee Summary Data:', JSON.stringify(feeSummaryData, null, 2));
  }

  const getPaymentRate = () => {
    if (!feeSummaryData || feeSummaryData.fees.total === 0) return 0;
    return Math.round((feeSummaryData.fees.paid / feeSummaryData.fees.total) * 100);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-4"
          style={{
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Payment Summary
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {selectedChild ? `${selectedChild.fullName}'s payment overview` : 'Payment overview'}
            </Text>
          </View>
          <TouchableOpacity
            className="rounded-lg px-4 py-2"
            style={{ backgroundColor: colors.primary + '20' }}
            onPress={onClose}>
            <Text className="font-semibold" style={{ color: colors.primary }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Loading State */}
          {isLoading && (
            <View className="items-center justify-center py-12">
              <Text className="text-lg" style={{ color: colors.textSecondary }}>
                Loading payment summary...
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View className="items-center justify-center py-12">
              <Text className="mb-4 text-6xl">⚠️</Text>
              <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                Error Loading Payment Summary
              </Text>
              <Text
                className="px-8 text-center text-base leading-6"
                style={{ color: colors.textSecondary }}>
                {error || 'Something went wrong'}
              </Text>
            </View>
          )}

          {/* Payment Summary Content */}
          {feeSummaryData && !isLoading && !error && (
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
                    Payment Overview
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    {feeSummaryData.student.fullName}'s payment summary for {feeSummaryData.year}
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
                      {feeSummaryData.fees.total}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.primary }}>
                      Total Fees
                    </Text>
                  </View>
                </View>

                <View className="mb-3 w-1/2 pl-2">
                  <View className="rounded-lg p-3" style={{ backgroundColor: '#10B981' + '10' }}>
                    <Text className="text-2xl font-bold" style={{ color: '#10B981' }}>
                      {feeSummaryData.fees.paid}
                    </Text>
                    <Text className="text-sm" style={{ color: '#10B981' }}>
                      Paid
                    </Text>
                  </View>
                </View>

                <View className="mb-3 w-1/2 pr-2">
                  <View className="rounded-lg p-3" style={{ backgroundColor: '#F59E0B' + '10' }}>
                    <Text className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                      {feeSummaryData.fees.pending}
                    </Text>
                    <Text className="text-sm" style={{ color: '#F59E0B' }}>
                      Pending
                    </Text>
                  </View>
                </View>

                <View className="mb-3 w-1/2 pl-2">
                  <View className="rounded-lg p-3" style={{ backgroundColor: '#EF4444' + '10' }}>
                    <Text className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                      {feeSummaryData.fees.overdue}
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
                <Text
                  className="mb-3 text-base font-semibold"
                  style={{ color: colors.textPrimary }}>
                  Amount Summary
                </Text>

                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Total Amount
                  </Text>
                  <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                    {formatCurrency(feeSummaryData.amounts.total)}
                  </Text>
                </View>

                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Paid Amount
                  </Text>
                  <Text className="text-base font-semibold" style={{ color: '#10B981' }}>
                    {formatCurrency(feeSummaryData.amounts.paid)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Pending Amount
                  </Text>
                  <Text className="text-base font-semibold" style={{ color: '#F59E0B' }}>
                    {formatCurrency(feeSummaryData.amounts.pending)}
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
                <View className="h-3 rounded-full" style={{ backgroundColor: colors.border }}>
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
                    {feeSummaryData.fees.paid} of {feeSummaryData.fees.total} fees paid
                  </Text>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    {feeSummaryData.fees.pending} remaining
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* No Data State */}
          {!feeSummaryData && !isLoading && !error && (
            <View className="items-center justify-center py-12">
              <Text className="mb-4 text-6xl">💰</Text>
              <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                No Payment Summary
              </Text>
              <Text
                className="px-8 text-center text-base leading-6"
                style={{ color: colors.textSecondary }}>
                No payment summary has been found for {selectedChild?.fullName || 'this student'}{' '}
                yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
