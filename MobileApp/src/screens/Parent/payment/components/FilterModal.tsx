import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../../../../contexts';

interface FilterState {
  status?: 'pending' | 'paid';
  year?: string;
  sortBy?: 'deadline' | 'amount' | 'title' | 'status' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

interface FilterModalProps {
  visible: boolean;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onApply,
  onClose,
}) => {
  const { colors } = useTheme();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({
      sortBy: 'deadline',
      sortOrder: 'asc',
    });
  };

  const handleStatusChange = (status: 'pending' | 'paid') => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status === status ? undefined : status,
    }));
  };

  const handleYearChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      year: value,
    }));
  };

  const handleSortChange = (sortBy: 'deadline' | 'amount' | 'title' | 'status' | 'created_at', sortOrder: 'asc' | 'desc') => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder,
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.keys(localFilters).filter(key => {
      const value = localFilters[key as keyof FilterState];
      // Don't count default sort values as active filters
      if (key === 'sortBy' && value === 'deadline') return false;
      if (key === 'sortOrder' && value === 'asc') return false;
      return !!value;
    }).length;
  };

  const getCurrentYear = () => new Date().getFullYear();
  const getYearOptions = () => {
    const currentYear = getCurrentYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
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
              Filter Payments
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Filter payment records by status, year, and sorting options
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
          {/* Status Filter */}
          <View
            className="mb-6 rounded-xl p-4"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <View className="mb-4 flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary + '20' }}>
                <Text className="text-lg">🏷️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Payment Status
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Filter by payment status
                </Text>
              </View>
            </View>

            <View className="flex-row">
              {[
                { value: 'pending', label: 'Pending', icon: '⏳', color: '#F59E0B' },
                { value: 'paid', label: 'Paid', icon: '✅', color: '#10B981' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className="mr-3 flex-row items-center rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: localFilters.status === option.value
                      ? option.color
                      : option.color + '20',
                  }}
                  onPress={() => handleStatusChange(option.value as any)}>
                  <Text className="mr-2">{option.icon}</Text>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: localFilters.status === option.value
                        ? 'white'
                        : option.color,
                    }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Year Filter */}
          <View
            className="mb-6 rounded-xl p-4"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <View className="mb-4 flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.secondary + '20' }}>
                <Text className="text-lg">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Year Filter
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Filter by academic year
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap">
              {getYearOptions().map((year) => (
                <TouchableOpacity
                  key={year}
                  className="mb-2 mr-2 rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: localFilters.year === year.toString()
                      ? colors.primary
                      : colors.primary + '20',
                  }}
                  onPress={() => handleYearChange(year.toString())}>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: localFilters.year === year.toString()
                        ? 'white'
                        : colors.primary,
                    }}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Year Input */}
            <View className="mt-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Custom Year
              </Text>
              <TextInput
                className="rounded-lg border px-4 py-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                placeholder="Enter year (e.g., 2024)"
                placeholderTextColor={colors.textSecondary}
                value={localFilters.year || ''}
                onChangeText={handleYearChange}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Sort Options */}
          <View
            className="mb-6 rounded-xl p-4"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <View className="mb-4 flex-row items-center">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.warning + '20' }}>
                <Text className="text-lg">🔄</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Sort Options
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Choose how to sort the payment records
                </Text>
              </View>
            </View>

            <View className="space-y-3">
              {[
                { sortBy: 'deadline', sortOrder: 'asc', label: 'Deadline (Earliest First)' },
                { sortBy: 'deadline', sortOrder: 'desc', label: 'Deadline (Latest First)' },
                { sortBy: 'amount', sortOrder: 'desc', label: 'Amount (Highest First)' },
                { sortBy: 'amount', sortOrder: 'asc', label: 'Amount (Lowest First)' },
                { sortBy: 'title', sortOrder: 'asc', label: 'Title (A-Z)' },
                { sortBy: 'status', sortOrder: 'asc', label: 'Status (Paid First)' },
                { sortBy: 'created_at', sortOrder: 'desc', label: 'Created Date (Newest First)' },
              ].map((option) => (
                <TouchableOpacity
                  key={`${option.sortBy}-${option.sortOrder}`}
                  className="flex-row items-center rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: localFilters.sortBy === option.sortBy && localFilters.sortOrder === option.sortOrder
                      ? colors.primary
                      : colors.primary + '20',
                  }}
                  onPress={() => handleSortChange(option.sortBy as any, option.sortOrder as any)}>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: localFilters.sortBy === option.sortBy && localFilters.sortOrder === option.sortOrder
                        ? 'white'
                        : colors.primary,
                    }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Current Filters Preview */}
          {getActiveFiltersCount() > 0 && (
            <View
              className="mb-6 rounded-xl p-4"
              style={{
                backgroundColor: colors.info + '10',
                borderWidth: 1,
                borderColor: colors.info + '30',
              }}>
              <Text className="mb-3 text-base font-semibold" style={{ color: colors.info }}>
                Active Filters ({getActiveFiltersCount()})
              </Text>
              <View className="flex-row flex-wrap">
                {Object.entries(localFilters).map(([key, value]) => {
                  if (!value) return null;
                  // Don't show default sort values as tags
                  if (key === 'sortBy' && value === 'deadline') return null;
                  if (key === 'sortOrder' && value === 'asc') return null;
                  
                  return (
                    <View
                      key={key}
                      className="mb-2 mr-2 rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.info + '20' }}>
                      <Text className="text-sm font-medium" style={{ color: colors.info }}>
                        {key}: {value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View
          className="flex-row px-4 py-4"
          style={{
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}>
          <TouchableOpacity
            className="mr-3 flex-1 rounded-lg py-3"
            style={{ backgroundColor: colors.error + '20' }}
            onPress={handleClear}>
            <Text className="text-center font-semibold" style={{ color: colors.error }}>
              Clear All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 rounded-lg py-3"
            style={{ backgroundColor: colors.primary }}
            onPress={handleApply}>
            <Text className="text-center font-semibold text-white">
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
