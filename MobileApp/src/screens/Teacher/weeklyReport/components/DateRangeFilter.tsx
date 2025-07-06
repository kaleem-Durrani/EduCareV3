import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../../contexts';

interface DateRangeFilterProps {
  dateRange: { start?: string; end?: string };
  onDateRangeChange: (range: { start?: string; end?: string }) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const { colors } = useTheme();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onDateRangeChange({ ...dateRange, start: dateString });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      onDateRangeChange({ ...dateRange, end: dateString });
    }
  };

  const clearDateRange = () => {
    onDateRangeChange({});
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
        Filter by Date Range
      </Text>

      <View className="flex-row items-center">
        {/* Start Date */}
        <TouchableOpacity
          className="mr-2 flex-1 rounded-lg border p-3"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          onPress={() => setShowStartPicker(true)}>
          <View className="flex-row items-center">
            <Icon name="date-range" size={20} color={colors.textSecondary} />
            <Text className="ml-2 flex-1" style={{ color: colors.textPrimary }}>
              {formatDate(dateRange.start)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* End Date */}
        <TouchableOpacity
          className="ml-2 flex-1 rounded-lg border p-3"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          onPress={() => setShowEndPicker(true)}>
          <View className="flex-row items-center">
            <Icon name="date-range" size={20} color={colors.textSecondary} />
            <Text className="ml-2 flex-1" style={{ color: colors.textPrimary }}>
              {formatDate(dateRange.end)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Clear Button */}
        {(dateRange.start || dateRange.end) && (
          <TouchableOpacity
            className="ml-2 rounded-lg p-3"
            style={{ backgroundColor: '#EF4444' }}
            onPress={clearDateRange}>
            <Icon name="clear" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={dateRange.start ? new Date(dateRange.start) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={dateRange.end ? new Date(dateRange.end) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
        />
      )}
    </View>
  );
};
