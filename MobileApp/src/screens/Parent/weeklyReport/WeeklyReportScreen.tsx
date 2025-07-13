import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import {
  reportService,
  WeeklyReport,
  WeeklyReportsResponse,
  ParentStudent,
} from '../../../services';
import { ChildSelector, PaginationControls, ScreenHeader } from '../../../components';
import { ParentReportCard, FilterModal } from './components';
import Toast from 'react-native-toast-message';

interface FilterState {
  weekStart?: string;
  weekEnd?: string;
}

const WeeklyReportScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({});
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const { children, isLoading: isLoadingChildren, refreshChildren } = useParentChildren();

  // API hooks
  const {
    request: fetchReports,
    isLoading: loadingReports,
    error: reportsError,
    data: reportsData,
  } = useApi<WeeklyReportsResponse>((params: any) =>
    reportService.getWeeklyReports(
      params.studentId,
      params.startDate,
      params.endDate,
      params.page,
      params.limit
    )
  );

  // Load reports when child or filters change
  useEffect(() => {
    if (selectedChild) {
      loadReports();
    } else {
      setReports([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [selectedChild, currentPage, pageSize, filters]);

  const loadReports = async () => {
    if (!selectedChild) return;

    const response = await reportService.getWeeklyReports(
      selectedChild._id,
      filters.weekStart,
      filters.weekEnd,
      currentPage,
      pageSize
    );

    if (response.success) {
      await fetchReports({
        studentId: selectedChild._id,
        startDate: filters.weekStart,
        endDate: filters.weekEnd,
        page: currentPage,
        limit: pageSize,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load reports',
        visibilityTime: 3000,
      });
    }
  };

  // Update reports when data changes
  useEffect(() => {
    if (reportsData) {
      setReports(reportsData.reports);
      setTotalPages(reportsData.pagination.totalPages);
      setTotalItems(reportsData.pagination.totalItems);
    }
  }, [reportsData]);

  const handleChildSelect = (child: ParentStudent) => {
    setSelectedChild(child);
    setCurrentPage(1); // Reset to first page when changing child
    setHasSearched(true);
  };

  const handleChildReset = () => {
    setSelectedChild(null);
    setReports([]);
    setCurrentPage(1);
    setFilters({});
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await loadReports();
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
    return Object.keys(filters).filter((key) => filters[key as keyof FilterState]).length;
  };

  const formatFilterValue = (key: keyof FilterState, value: string) => {
    if (key === 'weekStart' || key === 'weekEnd') {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return value;
  };

  const getFilterLabel = (key: keyof FilterState) => {
    switch (key) {
      case 'weekStart':
        return 'From';
      case 'weekEnd':
        return 'To';
      default:
        return key;
    }
  };

  const isLoading = isLoadingChildren || loadingReports;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Weekly Reports" navigation={navigation} showBackButton={true} />

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
              placeholder="Select a child to view their weekly reports"
              disabled={isLoadingChildren}
            />
          </View>

          {selectedChild && (
            <>
              {/* Filters Section */}
              <View className="mb-4 mt-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                    Filters
                  </Text>
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

              {/* Loading State */}
              {loadingReports && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="text-lg" style={{ color: colors.textSecondary }}>
                    Loading {selectedChild.fullName}'s reports...
                  </Text>
                </View>
              )}

              {/* Error State */}
              {reportsError && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">⚠️</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                    Error Loading Reports
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    {reportsError || 'Something went wrong'}
                  </Text>
                  <TouchableOpacity
                    className="mt-4 rounded-lg px-6 py-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={loadReports}>
                    <Text className="font-semibold text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Reports List */}
              {!loadingReports && reports.length > 0 && (
                <View className="pb-8">
                  {/* Header */}
                  <View className="mb-4 flex-row items-center">
                    <View
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-2xl">📊</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        Weekly Reports
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedChild.fullName}'s weekly progress reports
                      </Text>
                    </View>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {totalItems} Report{totalItems !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Reports */}
                  {reports.map((report) => (
                    <ParentReportCard key={report._id} report={report} />
                  ))}
                </View>
              )}

              {/* No Reports State */}
              {!loadingReports && reports.length === 0 && selectedChild && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">📊</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                    No Reports Found
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    No weekly reports have been created for {selectedChild.fullName} yet.
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
                Choose one of your children to view their weekly reports
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
        {selectedChild && reports.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingReports}
            itemName="reports"
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

export default WeeklyReportScreen;
