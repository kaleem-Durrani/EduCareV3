import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../../../../contexts';

interface FilterState {
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'content';
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
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSortChange = (field: 'sortBy' | 'sortOrder', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getActiveFiltersCount = () => {
    return Object.keys(localFilters).filter(key => {
      const value = localFilters[key as keyof FilterState];
      // Don't count default sort values as active filters
      if (key === 'sortBy' && value === 'createdAt') return false;
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
              Filter Notes
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Filter notes by date range and sort options
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
          {/* Date Range Section */}
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
                <Text className="text-lg">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Date Range
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Filter notes by creation date
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
            <View className="mb-4">
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

            {/* Quick Date Presets */}
            <View className="mt-4">
              <Text className="mb-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Quick Presets
              </Text>
              <View className="flex-row flex-wrap">
                <TouchableOpacity
                  className="mb-2 mr-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: colors.primary + '20' }}
                  onPress={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setLocalFilters(prev => ({
                      ...prev,
                      dateFrom: lastWeek.toISOString().split('T')[0],
                      dateTo: today.toISOString().split('T')[0],
                    }));
                  }}>
                  <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                    Last Week
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="mb-2 mr-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: colors.primary + '20' }}
                  onPress={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    setLocalFilters(prev => ({
                      ...prev,
                      dateFrom: lastMonth.toISOString().split('T')[0],
                      dateTo: today.toISOString().split('T')[0],
                    }));
                  }}>
                  <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                    Last Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sort Options Section */}
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
                <Text className="text-lg">🔄</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Sort Options
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Choose how to sort the notes
                </Text>
              </View>
            </View>

            {/* Sort By */}
            <View className="mb-4">
              <Text className="mb-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Sort By
              </Text>
              <View className="flex-row flex-wrap">
                {[
                  { value: 'createdAt', label: 'Created Date' },
                  { value: 'updatedAt', label: 'Updated Date' },
                  { value: 'content', label: 'Content' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className="mb-2 mr-2 rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: localFilters.sortBy === option.value
                        ? colors.primary
                        : colors.primary + '20',
                    }}
                    onPress={() => handleSortChange('sortBy', option.value)}>
                    <Text
                      className="text-sm font-medium"
                      style={{
                        color: localFilters.sortBy === option.value
                          ? 'white'
                          : colors.primary,
                      }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Order */}
            <View>
              <Text className="mb-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Sort Order
              </Text>
              <View className="flex-row">
                {[
                  { value: 'desc', label: 'Newest First' },
                  { value: 'asc', label: 'Oldest First' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className="mr-2 rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: localFilters.sortOrder === option.value
                        ? colors.primary
                        : colors.primary + '20',
                    }}
                    onPress={() => handleSortChange('sortOrder', option.value)}>
                    <Text
                      className="text-sm font-medium"
                      style={{
                        color: localFilters.sortOrder === option.value
                          ? 'white'
                          : colors.primary,
                      }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
                  if (key === 'sortBy' && value === 'createdAt') return null;
                  if (key === 'sortOrder' && value === 'desc') return null;
                  
                  return (
                    <View
                      key={key}
                      className="mb-2 mr-2 rounded-full px-3 py-1"
                      style={{ backgroundColor: colors.info + '20' }}>
                      <Text className="text-sm font-medium" style={{ color: colors.info }}>
                        {key === 'dateFrom' ? 'From' : key === 'dateTo' ? 'To' : key}: {
                          key === 'dateFrom' || key === 'dateTo'
                            ? new Date(value).toLocaleDateString()
                            : value
                        }
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
