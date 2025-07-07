import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { SelectModal, SelectableItem } from '../../../../components';

interface MonthPickerProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  disabled?: boolean;
}

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// Generate years (current year ± 2 years)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export const MonthPicker: React.FC<MonthPickerProps> = ({
  selectedMonth,
  selectedYear,
  onMonthSelect,
  onYearSelect,
  disabled = false,
}) => {
  const { colors } = useTheme();

  const monthItems: SelectableItem[] = MONTHS.map((month) => ({
    label: month.label,
    value: month.value.toString(),
    originalData: month.value,
  }));

  const yearItems: SelectableItem[] = YEARS.map((year) => ({
    label: year.toString(),
    value: year.toString(),
    originalData: year,
  }));

  const handleMonthSelect = (item: SelectableItem) => {
    const month = item.originalData as number;
    onMonthSelect(month);
  };

  const handleYearSelect = (item: SelectableItem) => {
    const year = item.originalData as number;
    onYearSelect(year);
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
        Select Month & Year
      </Text>

      <View className="flex-row space-x-2">
        {/* Month Selector */}
        <View className="flex-1" style={{ marginRight: 8 }}>
          <SelectModal
            items={monthItems}
            selectedValue={selectedMonth.toString()}
            placeholder="Select Month"
            title="📅 Select Month"
            onSelect={handleMonthSelect}
            disabled={disabled}
          />
        </View>

        {/* Year Selector */}
        <View className="flex-1" style={{ marginLeft: 8 }}>
          <SelectModal
            items={yearItems}
            selectedValue={selectedYear.toString()}
            placeholder="Select Year"
            title="📅 Select Year"
            onSelect={handleYearSelect}
            disabled={disabled}
          />
        </View>
      </View>
    </View>
  );
};
