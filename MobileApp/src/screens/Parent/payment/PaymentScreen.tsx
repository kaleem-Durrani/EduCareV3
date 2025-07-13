import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import {
  feeService,
  StudentFeesResponse,
  FeeSummary,
  FeeFilters,
  ParentStudent,
} from '../../../services';
import { ChildSelector, PaginationControls, ScreenHeader } from '../../../components';
import { FeeSummaryCard, FeeCard, FilterModal } from './components';
import Toast from 'react-native-toast-message';

interface FilterState {
  status?: 'pending' | 'paid';
  year?: string;
  sortBy?: 'deadline' | 'amount' | 'title' | 'status' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

const PaymentScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [fees, setFees] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'deadline',
    sortOrder: 'asc',
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const { children, isLoading: isLoadingChildren, refreshChildren } = useParentChildren();

  // API hooks for fees
  const {
    request: fetchFees,
    isLoading: loadingFees,
    error: feesError,
    data: feesData,
  } = useApi<StudentFeesResponse>((params: FeeFilters & { studentId: string }) =>
    feeService.getStudentFees(params.studentId, {
      page: params.page,
      limit: params.limit,
      status: params.status,
      year: params.year,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })
  );

  // API hooks for fee summary
  const {
    request: fetchFeeSummary,
    isLoading: loadingFeeSummary,
    error: feeSummaryError,
    data: feeSummaryData,
  } = useApi<FeeSummary>((params: { studentId: string; year?: string }) =>
    feeService.getFeeSummary(params.studentId, params.year)
  );

  // Load fee data when child or filters change
  useEffect(() => {
    if (selectedChild) {
      loadFeeData();
    } else {
      setFees([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [selectedChild, currentPage, pageSize, filters]);

  const loadFeeData = async () => {
    if (!selectedChild) return;

    // Load fee summary
    const feeSummaryResponse = await feeService.getFeeSummary(selectedChild._id, filters.year);
    if (feeSummaryResponse.success) {
      await fetchFeeSummary({
        studentId: selectedChild._id,
        year: filters.year,
      });
    }

    // Load fees
    const feesResponse = await feeService.getStudentFees(selectedChild._id, {
      page: currentPage,
      limit: pageSize,
      status: filters.status,
      year: filters.year,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    if (feesResponse.success) {
      await fetchFees({
        studentId: selectedChild._id,
        page: currentPage,
        limit: pageSize,
        status: filters.status,
        year: filters.year,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: feesResponse.message || 'Failed to load payment data',
        visibilityTime: 3000,
      });
    }
  };

  // Update fees when data changes
  useEffect(() => {
    if (feesData) {
      setFees(feesData.fees);
      setTotalPages(feesData.pagination.totalPages);
      setTotalItems(feesData.pagination.totalItems);
    }
  }, [feesData]);

  const handleChildSelect = (child: ParentStudent) => {
    setSelectedChild(child);
    setCurrentPage(1); // Reset to first page when changing child
    setHasSearched(true);
  };

  const handleChildReset = () => {
    setSelectedChild(null);
    setFees([]);
    setCurrentPage(1);
    setFilters({
      sortBy: 'deadline',
      sortOrder: 'asc',
    });
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await loadFeeData();
    }
  };

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    setIsFilterModalVisible(false);
  };

  const handleFilterClear = (filterKey: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof FilterState];
      // Don't count default sort values as active filters
      if (key === 'sortBy' && value === 'deadline') return false;
      if (key === 'sortOrder' && value === 'asc') return false;
      return !!value;
    }).length;
  };

  const formatFilterValue = (key: keyof FilterState, value: string) => {
    if (key === 'status') {
      return value === 'pending' ? 'Pending' : 'Paid';
    }
    if (key === 'year') {
      return value;
    }
    if (key === 'sortBy') {
      switch (value) {
        case 'deadline':
          return 'Deadline';
        case 'amount':
          return 'Amount';
        case 'title':
          return 'Title';
        case 'status':
          return 'Status';
        case 'created_at':
          return 'Created Date';
        default:
          return value;
      }
    }
    if (key === 'sortOrder') {
      return value === 'asc' ? 'Ascending' : 'Descending';
    }
    return value;
  };

  const getFilterLabel = (key: keyof FilterState) => {
    switch (key) {
      case 'status':
        return 'Status';
      case 'year':
        return 'Year';
      case 'sortBy':
        return 'Sort By';
      case 'sortOrder':
        return 'Order';
      default:
        return key;
    }
  };

  const isLoading = isLoadingChildren || loadingFees || loadingFeeSummary;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Payments" navigation={navigation} showBackButton={true} />

      {/* Main Content */}
      <View className="flex-1">
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
              onResetSelection={handleChildReset}
              placeholder="Select a child to view their payment information"
              disabled={isLoadingChildren}
            />
          </View>

          {selectedChild && (
            <>
              {/* Fee Summary Card */}
              {feeSummaryData && !loadingFeeSummary && (
                <View className="mt-4">
                  <FeeSummaryCard feeSummary={feeSummaryData} />
                </View>
              )}

              {/* Fee Summary Loading */}
              {loadingFeeSummary && (
                <View className="mt-4 items-center justify-center py-8">
                  <Text className="text-base" style={{ color: colors.textSecondary }}>
                    Loading payment summary...
                  </Text>
                </View>
              )}

              {/* Fee Summary Error */}
              {feeSummaryError && (
                <View className="mt-4 items-center justify-center py-8">
                  <Text className="text-base" style={{ color: colors.error }}>
                    Failed to load payment summary
                  </Text>
                </View>
              )}

              {/* Filters Section */}
              <View className="mb-4 mt-6">
                <View className="mb-3 flex-row items-center justify-end">
                  <TouchableOpacity
                    className="flex-row items-center rounded-lg px-4 py-2"
                    style={{
                      backgroundColor: isFilterModalVisible
                        ? colors.primary
                        : colors.primary + '20',
                    }}
                    onPress={() => setIsFilterModalVisible(!isFilterModalVisible)}>
                    <Text
                      className="text-sm font-medium"
                      style={{
                        color: isFilterModalVisible ? 'white' : colors.primary,
                      }}>
                      {isFilterModalVisible ? 'Close Filters' : 'Open Filters'}
                    </Text>
                    {getActiveFiltersCount() > 0 && (
                      <View
                        className="ml-2 h-5 w-5 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: isFilterModalVisible ? 'white' : colors.primary,
                        }}>
                        <Text
                          className="text-xs font-bold"
                          style={{
                            color: isFilterModalVisible ? colors.primary : 'white',
                          }}>
                          {getActiveFiltersCount()}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Active Filters Tags */}
                {getActiveFiltersCount() > 0 && (
                  <View className="flex-row flex-wrap">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value) return null;
                      // Don't show default sort values as tags
                      if (key === 'sortBy' && value === 'deadline') return null;
                      if (key === 'sortOrder' && value === 'asc') return null;

                      return (
                        <View
                          key={key}
                          className="mb-2 mr-2 flex-row items-center rounded-full px-3 py-1"
                          style={{ backgroundColor: colors.primary + '20' }}>
                          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                            {getFilterLabel(key as keyof FilterState)}:{' '}
                            {formatFilterValue(key as keyof FilterState, value)}
                          </Text>
                          <TouchableOpacity
                            className="ml-2"
                            onPress={() => handleFilterClear(key as keyof FilterState)}>
                            <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                              ×
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Fees Loading */}
              {loadingFees && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="text-lg" style={{ color: colors.textSecondary }}>
                    Loading {selectedChild.fullName}'s payment records...
                  </Text>
                </View>
              )}

              {/* Fees Error */}
              {feesError && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">⚠️</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                    Error Loading Payment Records
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    {feesError || 'Something went wrong'}
                  </Text>
                  <TouchableOpacity
                    className="mt-4 rounded-lg px-6 py-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={loadFeeData}>
                    <Text className="font-semibold text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Fees List */}
              {!loadingFees && fees.length > 0 && (
                <View className="pb-8">
                  {/* Header */}
                  <View className="mb-4 flex-row items-center">
                    <View
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-2xl">💳</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        Payment Records
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedChild.fullName}'s fee and payment history
                      </Text>
                    </View>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {totalItems} Record{totalItems !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Fees */}
                  {fees.map((fee) => (
                    <FeeCard key={fee.id} fee={fee} />
                  ))}
                </View>
              )}

              {/* No Fees State */}
              {!loadingFees && fees.length === 0 && selectedChild && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">💳</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                    No Payment Records Found
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    No payment records have been found for {selectedChild.fullName}.
                    {getActiveFiltersCount() > 0 && ' Try adjusting your filters.'}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Empty State */}
          {!selectedChild && !isLoading && hasSearched && (
            <View className="mt-8 items-center justify-center py-12">
              <Text className="mb-4 text-6xl">👶</Text>
              <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
                Select a Child
              </Text>
              <Text className="text-center" style={{ color: colors.textSecondary }}>
                Choose one of your children to view their payment information
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

        {/* Fixed Pagination at Bottom */}
        {selectedChild && fees.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingFees}
            itemName="payment records"
          />
        )}
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        filters={filters}
        onApply={handleFilterApply}
        onClose={() => setIsFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PaymentScreen;
