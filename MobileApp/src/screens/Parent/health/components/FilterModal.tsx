import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../../../../contexts';

interface FilterState {
  type?: 'height' | 'weight';
  period?: 'week' | 'month' | '3months' | '6months' | 'year';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'type' | 'value';
  sortOrder?: 'asc' | 'desc';
}

interface FilterModalProps {
  visible: boolean;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ visible, filters, onApply, onClose }) => {
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
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const handleTypeChange = (type: 'height' | 'weight') => {
    setLocalFilters((prev) => ({
      ...prev,
      type: prev.type === type ? undefined : type,
    }));
  };

  const handlePeriodChange = (period: 'week' | 'month' | '3months' | '6months' | 'year') => {
    setLocalFilters((prev) => ({
      ...prev,
      period: prev.period === period ? undefined : period,
      // Clear custom dates when period is selected
      dateFrom: undefined,
      dateTo: undefined,
    }));
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
      // Clear period when custom dates are used
      period: undefined,
    }));
  };

  const handleSortChange = (sortBy: 'date' | 'type' | 'value', sortOrder: 'asc' | 'desc') => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
    }));
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getActiveFiltersCount = () => {
    return Object.keys(localFilters).filter((key) => {
      const value = localFilters[key as keyof FilterState];
      // Don't count default sort values as active filters
      if (key === 'sortBy' && value === 'date') return false;
      if (key === 'sortOrder' && value === 'desc') return false;
      return !!value;
    }).length;
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
              Filter Health Metrics
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Filter metrics by type, period, and sorting options
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
          {/* Metric Type Filter */}
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
                <Text className="text-lg">📊</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Metric Type
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Filter by health metric type
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap">
              {[
                { value: 'height', label: 'Height', icon: '📏', color: '#3B82F6' },
                { value: 'weight', label: 'Weight', icon: '⚖️', color: '#10B981' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className="mb-2 mr-2 flex-row items-center rounded-lg px-3 py-2"
                  style={{
                    backgroundColor:
                      localFilters.type === option.value ? option.color : option.color + '20',
                  }}
                  onPress={() => handleTypeChange(option.value as any)}>
                  <Text className="mr-2">{option.icon}</Text>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: localFilters.type === option.value ? 'white' : option.color,
                    }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Period Filter */}
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
                <Text className="text-lg">⏰</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Time Period
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Filter by time period
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap">
              {[
                { value: 'week', label: 'Last Week', icon: '📅' },
                { value: 'month', label: 'Last Month', icon: '📅' },
                { value: '3months', label: 'Last 3 Months', icon: '📅' },
                { value: '6months', label: 'Last 6 Months', icon: '📅' },
                { value: 'year', label: 'Last Year', icon: '📅' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className="mb-2 mr-2 flex-row items-center rounded-lg px-3 py-2"
                  style={{
                    backgroundColor:
                      localFilters.period === option.value ? colors.primary : colors.primary + '20',
                  }}
                  onPress={() => handlePeriodChange(option.value as any)}>
                  <Text className="mr-2">{option.icon}</Text>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: localFilters.period === option.value ? 'white' : colors.primary,
                    }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Date Range */}
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
                style={{ backgroundColor: colors.info + '20' }}>
                <Text className="text-lg">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Custom Date Range
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Set specific start and end dates
                </Text>
              </View>
            </View>

            {/* From Date */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                From Date
              </Text>
              <TextInput
                className="rounded-lg border px-4 py-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={formatDateForInput(localFilters.dateFrom)}
                onChangeText={(text) => handleDateChange('dateFrom', text)}
              />
            </View>

            {/* To Date */}
            <View>
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                To Date
              </Text>
              <TextInput
                className="rounded-lg border px-4 py-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={formatDateForInput(localFilters.dateTo)}
                onChangeText={(text) => handleDateChange('dateTo', text)}
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
                  Choose how to sort the metrics
                </Text>
              </View>
            </View>

            <View className="space-y-3">
              {[
                { sortBy: 'date', sortOrder: 'desc', label: 'Newest First' },
                { sortBy: 'date', sortOrder: 'asc', label: 'Oldest First' },
                { sortBy: 'type', sortOrder: 'asc', label: 'Type A-Z' },
                { sortBy: 'value', sortOrder: 'desc', label: 'Highest Value' },
                { sortBy: 'value', sortOrder: 'asc', label: 'Lowest Value' },
              ].map((option) => (
                <TouchableOpacity
                  key={`${option.sortBy}-${option.sortOrder}`}
                  className="flex-row items-center rounded-lg px-3 py-2"
                  style={{
                    backgroundColor:
                      localFilters.sortBy === option.sortBy &&
                      localFilters.sortOrder === option.sortOrder
                        ? colors.primary
                        : colors.primary + '20',
                  }}
                  onPress={() => handleSortChange(option.sortBy as any, option.sortOrder as any)}>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color:
                        localFilters.sortBy === option.sortBy &&
                        localFilters.sortOrder === option.sortOrder
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
                  if (key === 'sortBy' && value === 'date') return null;
                  if (key === 'sortOrder' && value === 'desc') return null;

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
            <Text className="text-center font-semibold text-white">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
