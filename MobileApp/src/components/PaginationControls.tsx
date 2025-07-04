import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
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

  const { start, end } = getPageRange();

  if (totalPages <= 1) {
    return null; // Don't show pagination for single page
  }

  return (
    <View className="border-t p-4" style={{ borderTopColor: colors.border }}>
      {/* Page Info */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Showing {start}-{end} of {totalItems} {itemName}
        </Text>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* Navigation Controls */}
      <View className="mb-3 flex-row items-center justify-between">
        {/* Previous Button */}
        <TouchableOpacity
          className="rounded-lg px-4 py-2"
          style={{
            backgroundColor: currentPage > 1 ? colors.primary : colors.border,
            opacity: isLoading ? 0.6 : 1,
          }}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}>
          <Text
            className="font-medium"
            style={{
              color: currentPage > 1 ? 'white' : colors.textSecondary,
            }}>
            ← Previous
          </Text>
        </TouchableOpacity>

        {/* Page Numbers */}
        <View className="flex-row items-center">
          {/* First Page */}
          {currentPage > 3 && (
            <>
              <TouchableOpacity
                className="mx-1 rounded px-3 py-2"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
                onPress={() => onPageChange(1)}
                disabled={isLoading}>
                <Text style={{ color: colors.textPrimary }}>1</Text>
              </TouchableOpacity>
              {currentPage > 4 && (
                <Text style={{ color: colors.textSecondary }}>...</Text>
              )}
            </>
          )}

          {/* Current and nearby pages */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i;
            if (pageNum > totalPages) return null;

            const isCurrentPage = pageNum === currentPage;
            return (
              <TouchableOpacity
                key={pageNum}
                className="mx-1 rounded px-3 py-2"
                style={{
                  backgroundColor: isCurrentPage ? colors.primary : colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
                onPress={() => onPageChange(pageNum)}
                disabled={isCurrentPage || isLoading}>
                <Text
                  style={{
                    color: isCurrentPage ? 'white' : colors.textPrimary,
                    fontWeight: isCurrentPage ? 'bold' : 'normal',
                  }}>
                  {pageNum}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Last Page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <Text style={{ color: colors.textSecondary }}>...</Text>
              )}
              <TouchableOpacity
                className="mx-1 rounded px-3 py-2"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
                onPress={() => onPageChange(totalPages)}
                disabled={isLoading}>
                <Text style={{ color: colors.textPrimary }}>{totalPages}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          className="rounded-lg px-4 py-2"
          style={{
            backgroundColor: currentPage < totalPages ? colors.primary : colors.border,
            opacity: isLoading ? 0.6 : 1,
          }}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}>
          <Text
            className="font-medium"
            style={{
              color: currentPage < totalPages ? 'white' : colors.textSecondary,
            }}>
            Next →
          </Text>
        </TouchableOpacity>
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
  );
};
