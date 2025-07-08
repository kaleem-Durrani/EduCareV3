import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { feeService, Fee, FeeSummary } from '../../../services';

interface Props {
  navigation: any;
  route?: {
    params?: {
      studentId?: string;
    };
  };
}

const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();

  // Early error handling for missing navigation or route
  if (!navigation) {
    console.error('PaymentScreen: navigation prop is undefined');
    return null;
  }

  if (!route) {
    console.error('PaymentScreen: route prop is undefined');
    return null;
  }

  const studentId = route?.params?.studentId;

  const [fees, setFees] = useState<Fee[]>([]);
  const [feeSummary, setFeeSummary] = useState<FeeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  useEffect(() => {
    if (studentId) {
      fetchPaymentData();
    }
  }, [studentId, statusFilter]);

  const fetchPaymentData = async () => {
    if (!studentId) {
      Alert.alert('Error', 'Student ID is required to view payment information');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch both fees and summary
      const [feesResponse, summaryResponse] = await Promise.all([
        feeService.getStudentFees(studentId, {
          status: statusFilter === 'all' ? undefined : statusFilter,
          limit: 50,
        }),
        feeService.getFeeSummary(studentId),
      ]);

      if (feesResponse.success) {
        setFees(feesResponse.data.fees || []);
      }

      if (summaryResponse.success) {
        setFeeSummary(summaryResponse.data);
      }

      if (!feesResponse.success && !summaryResponse.success) {
        Alert.alert('Error', 'Failed to fetch payment data');
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      Alert.alert('Error', 'Failed to fetch payment data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10B981'; // Green
      case 'pending':
        return '#F59E0B'; // Yellow
      case 'overdue':
        return '#EF4444'; // Red
      case 'cancelled':
        return '#6B7280'; // Gray
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getFeeTypeIcon = (type: string) => {
    switch (type) {
      case 'tuition':
        return '🎓';
      case 'transport':
        return '🚌';
      case 'meal':
        return '🍽️';
      case 'activity':
        return '🎨';
      case 'uniform':
        return '👕';
      case 'book':
        return '📚';
      default:
        return '💰';
    }
  };

  const renderFilterButton = (filter: typeof statusFilter, label: string) => (
    <TouchableOpacity
      className={`mr-2 rounded-full px-4 py-2 ${statusFilter === filter ? 'bg-blue-500' : 'bg-gray-200'}`}
      onPress={() => setStatusFilter(filter)}>
      <Text
        className={`text-sm font-medium ${statusFilter === filter ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFeeItem = ({ item }: { item: Fee }) => (
    <View className="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 text-2xl">{getFeeTypeIcon(item.type)}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                {item.title}
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {item.description}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold" style={{ color: colors.primary }}>
              {formatCurrency(item.amount)}
            </Text>
            <View
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: getStatusColor(item.status) + '20' }}>
              <Text className="text-xs font-medium" style={{ color: getStatusColor(item.status) }}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>

          <View className="mt-2 flex-row justify-between">
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Due: {formatDate(item.dueDate)}
            </Text>
            {item.paymentDate && (
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                Paid: {formatDate(item.paymentDate)}
              </Text>
            )}
          </View>

          {item.transactionId && (
            <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
              Transaction: {item.transactionId}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  // Show error if no studentId is provided
  if (!studentId) {
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
              Payment & Fees
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            Error: Missing Student Information
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            Student ID is required to view payment information. Please navigate from the home
            screen.
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-blue-500 px-6 py-3"
            onPress={() => navigation.goBack()}>
            <Text className="font-medium text-white">Go Back</Text>
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
            Payment & Fees
          </Text>
        </TouchableOpacity>
      </View>

      {feeSummary && feeSummary.student && (
        <View className="px-4 py-2">
          <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
            {feeSummary.student.fullName || 'Student'}
            {feeSummary.student.rollNum && ` - Roll #${feeSummary.student.rollNum}`}
          </Text>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
            Loading payment information...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }>
          {/* Payment Summary - Yellow Box */}
          {feeSummary && (
            <View
              className="mx-4 mb-4 rounded-lg p-4 shadow-sm"
              style={{ backgroundColor: '#FEF3C7' }}>
              <Text className="mb-3 text-lg font-bold" style={{ color: '#92400E' }}>
                Payment Summary
              </Text>

              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm font-medium" style={{ color: '#92400E' }}>
                  Total Amount:
                </Text>
                <Text className="text-sm font-bold" style={{ color: '#92400E' }}>
                  {formatCurrency(feeSummary.amounts?.total || feeSummary.totalAmount || 0)}
                </Text>
              </View>

              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm font-medium" style={{ color: '#92400E' }}>
                  Paid Amount:
                </Text>
                <Text className="text-sm font-bold" style={{ color: '#059669' }}>
                  {formatCurrency(feeSummary.amounts?.paid || feeSummary.paidAmount || 0)}
                </Text>
              </View>

              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm font-medium" style={{ color: '#92400E' }}>
                  Pending Amount:
                </Text>
                <Text className="text-sm font-bold" style={{ color: '#D97706' }}>
                  {formatCurrency(feeSummary.amounts?.pending || feeSummary.pendingAmount || 0)}
                </Text>
              </View>

              {(feeSummary.overdueAmount || 0) > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-sm font-medium" style={{ color: '#92400E' }}>
                    Overdue Amount:
                  </Text>
                  <Text className="text-sm font-bold" style={{ color: '#DC2626' }}>
                    {formatCurrency(feeSummary.overdueAmount || 0)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Filter Buttons */}
          <View className="px-4 py-2">
            <FlatList
              horizontal
              data={[
                { filter: 'all' as const, label: 'All' },
                { filter: 'pending' as const, label: 'Pending' },
                { filter: 'paid' as const, label: 'Paid' },
                { filter: 'overdue' as const, label: 'Overdue' },
              ]}
              renderItem={({ item }) => renderFilterButton(item.filter, item.label)}
              keyExtractor={(item) => item.filter}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Fees List */}
          {fees.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6 py-8">
              <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
                No Fees Found
              </Text>
              <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
                No {statusFilter === 'all' ? '' : statusFilter + ' '}fees found for this student.
              </Text>
            </View>
          ) : (
            <FlatList
              data={fees}
              renderItem={renderFeeItem}
              keyExtractor={(item, index) => item._id || `fee-${index}`}
              contentContainerStyle={{ paddingVertical: 8 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}

          <View className="h-8" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PaymentScreen;
