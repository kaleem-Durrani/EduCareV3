import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../contexts';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
  itemName?: string; // e.g., "notes", "students", "activities"
  pageSizeOptions?: number[];
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  itemName = 'items',
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const { colors } = useTheme();
  const [jumpToPage, setJumpToPage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (isNaN(page) || page < 1 || page > totalPages) {
      Alert.alert('Invalid Page', `Please enter a page number between 1 and ${totalPages}`);
      return;
    }
    onPageChange(page);
    setJumpToPage('');
  };

  const getPageRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { start, end };
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 2) {
      // Near the beginning: 1, 2, 3, ..., last
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 1) {
      // Near the end: 1, ..., last-2, last-1, last
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      // In the middle: 1, ..., current-1, current, current+1, ..., last
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    // Remove duplicates and ensure no consecutive ellipsis
    const filteredPages: (number | string)[] = [];
    for (let i = 0; i < pages.length; i++) {
      const current = pages[i];
      const prev = filteredPages[filteredPages.length - 1];

      // Skip if duplicate number
      if (typeof current === 'number' && current === prev) {
        continue;
      }

      // Skip if consecutive ellipsis
      if (current === '...' && prev === '...') {
        continue;
      }

      filteredPages.push(current);
    }

    return filteredPages;
  };

  const { start, end } = getPageRange();
  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination for single page
  }

  return (
    <View className="border-t p-3" style={{ borderTopColor: colors.border }}>
      {/* Compact Navigation */}
      <View className="flex-row items-center justify-between">
        {/* Previous Button */}
        <TouchableOpacity
          className="rounded px-3 py-1.5"
          style={{
            backgroundColor: currentPage > 1 ? colors.primary : colors.border,
            opacity: isLoading ? 0.6 : 1,
          }}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}>
          <Text
            className="text-sm font-medium"
            style={{
              color: currentPage > 1 ? 'white' : colors.textSecondary,
            }}>
            ← Prev
          </Text>
        </TouchableOpacity>

        {/* Page Numbers */}
        <View className="flex-row items-center">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <Text
                  key={`ellipsis-${index}`}
                  className="mx-1 text-sm"
                  style={{ color: colors.textSecondary }}>
                  ...
                </Text>
              );
            }

            const pageNum = page as number;
            const isCurrentPage = pageNum === currentPage;
            return (
              <TouchableOpacity
                key={pageNum}
                className="mx-0.5 rounded px-2 py-1"
                style={{
                  backgroundColor: isCurrentPage ? colors.primary : colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
                onPress={() => onPageChange(pageNum)}
                disabled={isCurrentPage || isLoading}>
                <Text
                  className="text-sm"
                  style={{
                    color: isCurrentPage ? 'white' : colors.textPrimary,
                    fontWeight: isCurrentPage ? 'bold' : 'normal',
                  }}>
                  {pageNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Expand/Collapse Button and Next Button */}
        <View className="flex-row items-center">
          {/* Expand Button */}
          <TouchableOpacity
            className="mr-2 rounded px-2 py-1.5"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}
            onPress={() => setIsExpanded(!isExpanded)}>
            <Text className="text-sm" style={{ color: colors.textPrimary }}>
              {isExpanded ? '▼' : '▲'}
            </Text>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity
            className="rounded px-3 py-1.5"
            style={{
              backgroundColor: currentPage < totalPages ? colors.primary : colors.border,
              opacity: isLoading ? 0.6 : 1,
            }}
            onPress={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}>
            <Text
              className="text-sm font-medium"
              style={{
                color: currentPage < totalPages ? 'white' : colors.textSecondary,
              }}>
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded Section */}
      {isExpanded && (
        <View className="mt-3 border-t pt-3" style={{ borderTopColor: colors.border }}>
          {/* Page Info */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Showing {start}-{end} of {totalItems} {itemName}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          {/* Jump to Page & Page Size */}
          <View className="flex-row items-center justify-between">
            {/* Jump to Page */}
            <View className="flex-row items-center">
              <Text className="mr-2 text-sm" style={{ color: colors.textSecondary }}>
                Go to:
              </Text>
              <TextInput
                className="rounded border px-3 py-1"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  width: 60,
                }}
                placeholder="Page"
                placeholderTextColor={colors.textSecondary}
                value={jumpToPage}
                onChangeText={setJumpToPage}
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity
                className="ml-2 rounded px-3 py-1"
                style={{ backgroundColor: colors.secondary }}
                onPress={handleJumpToPage}
                disabled={!jumpToPage.trim() || isLoading}>
                <Text className="text-sm font-medium text-white">Go</Text>
              </TouchableOpacity>
            </View>

            {/* Page Size Selector */}
            <View className="flex-row items-center">
              <Text className="mr-2 text-sm" style={{ color: colors.textSecondary }}>
                Show:
              </Text>
              {pageSizeOptions.map((size) => (
                <TouchableOpacity
                  key={size}
                  className="ml-1 rounded px-2 py-1"
                  style={{
                    backgroundColor: size === pageSize ? colors.primary : colors.card,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                  onPress={() => onPageSizeChange(size)}
                  disabled={isLoading}>
                  <Text
                    className="text-sm"
                    style={{
                      color: size === pageSize ? 'white' : colors.textPrimary,
                    }}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
