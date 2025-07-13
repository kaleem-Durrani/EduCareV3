import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import { noteService, StudentNotesResponse, NotesFilters, ParentStudent } from '../../../services';
import { ChildSelector, PaginationControls, ScreenHeader } from '../../../components';
import { NoteCard, FilterModal } from './components';
import Toast from 'react-native-toast-message';

interface FilterState {
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'content';
  sortOrder?: 'asc' | 'desc';
}

const NotesScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const { children, isLoading: isLoadingChildren, refreshChildren } = useParentChildren();

  // API hooks
  const {
    request: fetchNotes,
    isLoading: loadingNotes,
    error: notesError,
    data: notesData,
  } = useApi<StudentNotesResponse>((params: NotesFilters & { studentId: string }) =>
    noteService.getStudentNotesForParent(params.studentId, {
      page: params.page,
      limit: params.limit,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })
  );

  // Load notes when child or filters change
  useEffect(() => {
    if (selectedChild) {
      loadNotes();
    } else {
      setNotes([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [selectedChild, currentPage, pageSize, filters]);

  const loadNotes = async () => {
    if (!selectedChild) return;

    const response = await noteService.getStudentNotesForParent(selectedChild._id, {
      page: currentPage,
      limit: pageSize,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });

    if (response.success) {
      await fetchNotes({
        studentId: selectedChild._id,
        page: currentPage,
        limit: pageSize,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load notes',
        visibilityTime: 3000,
      });
    }
  };

  // Update notes when data changes
  useEffect(() => {
    if (notesData) {
      setNotes(notesData.notes);
      setTotalPages(notesData.pagination.totalPages);
      setTotalItems(notesData.pagination.totalItems);
    }
  }, [notesData]);

  const handleChildSelect = (child: ParentStudent) => {
    setSelectedChild(child);
    setCurrentPage(1); // Reset to first page when changing child
    setHasSearched(true);
  };

  const handleChildReset = () => {
    setSelectedChild(null);
    setNotes([]);
    setCurrentPage(1);
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await loadNotes();
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
      if (key === 'sortBy' && value === 'createdAt') return false;
      if (key === 'sortOrder' && value === 'desc') return false;
      return !!value;
    }).length;
  };

  const formatFilterValue = (key: keyof FilterState, value: string) => {
    if (key === 'dateFrom' || key === 'dateTo') {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (key === 'sortBy') {
      switch (value) {
        case 'createdAt':
          return 'Created Date';
        case 'updatedAt':
          return 'Updated Date';
        case 'content':
          return 'Content';
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
      case 'dateFrom':
        return 'From';
      case 'dateTo':
        return 'To';
      case 'sortBy':
        return 'Sort By';
      case 'sortOrder':
        return 'Order';
      default:
        return key;
    }
  };

  const isLoading = isLoadingChildren || loadingNotes;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Notes" navigation={navigation} showBackButton={true} />

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
              placeholder="Select a child to view their notes"
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
                      // Don't show default sort values as tags
                      if (key === 'sortBy' && value === 'createdAt') return null;
                      if (key === 'sortOrder' && value === 'desc') return null;

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
              {loadingNotes && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="text-lg" style={{ color: colors.textSecondary }}>
                    Loading {selectedChild.fullName}'s notes...
                  </Text>
                </View>
              )}

              {/* Error State */}
              {notesError && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">⚠️</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                    Error Loading Notes
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    {notesError || 'Something went wrong'}
                  </Text>
                  <TouchableOpacity
                    className="mt-4 rounded-lg px-6 py-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={loadNotes}>
                    <Text className="font-semibold text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Notes List */}
              {!loadingNotes && notes.length > 0 && (
                <View className="pb-8">
                  {/* Header */}
                  <View className="mb-4 flex-row items-center">
                    <View
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-2xl">📝</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        Notes
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedChild.fullName}'s notes from teachers and administrators
                      </Text>
                    </View>
                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {totalItems} Note{totalItems !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Notes */}
                  {notes.map((note) => (
                    <NoteCard key={note._id} note={note} />
                  ))}
                </View>
              )}

              {/* No Notes State */}
              {!loadingNotes && notes.length === 0 && selectedChild && (
                <View className="mt-8 items-center justify-center py-12">
                  <Text className="mb-4 text-6xl">📝</Text>
                  <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                    No Notes Found
                  </Text>
                  <Text
                    className="px-8 text-center text-base leading-6"
                    style={{ color: colors.textSecondary }}>
                    No notes have been created for {selectedChild.fullName} yet.
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
                Choose one of your children to view their notes
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
        {selectedChild && notes.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={loadingNotes}
            itemName="notes"
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

export default NotesScreen;
