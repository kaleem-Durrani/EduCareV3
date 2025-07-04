import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, useTeacherClasses } from '../../../../contexts';
import { ActivityFilters as ActivityFiltersType } from '../../../../services';
import { SelectModal, SelectableItem } from '../../../../components';

interface ActivityFiltersProps {
  filters: ActivityFiltersType;
  onFiltersChange: (filters: ActivityFiltersType) => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { colors } = useTheme();
  const { classes, allStudents, studentsByClass } = useTeacherClasses();
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert classes to SelectableItem format
  const getClassItems = (): SelectableItem[] => {
    return classes.map(classItem => ({
      value: classItem._id,
      label: classItem.name,
      secondaryLabel: `${classItem.students.length} students`,
      originalData: classItem
    }));
  };

  // Convert students to SelectableItem format
  const getStudentItems = (): SelectableItem[] => {
    const students = filters.classId 
      ? studentsByClass[filters.classId] || []
      : allStudents;
    
    return students.map(student => ({
      value: student._id,
      label: student.fullName,
      secondaryLabel: `Enrollment #${student.rollNum}`,
      originalData: student
    }));
  };

  // Audience type options
  const audienceTypeItems: SelectableItem[] = [
    { value: 'all', label: 'All Students', secondaryLabel: 'Visible to everyone' },
    { value: 'class', label: 'Specific Class', secondaryLabel: 'Class-specific activities' },
    { value: 'student', label: 'Individual Student', secondaryLabel: 'Student-specific activities' },
  ];

  // Time filter options
  const timeFilterItems: SelectableItem[] = [
    { value: 'all', label: 'All Activities', secondaryLabel: 'Past, present, and future' },
    { value: 'past', label: 'Past Activities', secondaryLabel: 'Activities before today' },
    { value: 'today', label: 'Today\'s Activities', secondaryLabel: 'Activities happening today' },
    { value: 'upcoming', label: 'Upcoming Activities', secondaryLabel: 'Activities after today' },
  ];

  const handleClassSelect = (item: SelectableItem) => {
    const newFilters = { 
      ...filters, 
      classId: item.value,
      studentId: undefined // Reset student when class changes
    };
    onFiltersChange(newFilters);
  };

  const handleStudentSelect = (item: SelectableItem) => {
    onFiltersChange({ ...filters, studentId: item.value });
  };

  const handleAudienceTypeSelect = (item: SelectableItem) => {
    const newFilters = {
      ...filters,
      audienceType: item.value as 'all' | 'class' | 'student',
      // Reset class/student filters when changing audience type
      classId: item.value === 'class' ? filters.classId : undefined,
      studentId: item.value === 'student' ? filters.studentId : undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleTimeFilterSelect = (item: SelectableItem) => {
    const newFilters = {
      ...filters,
      timeFilter: item.value as 'all' | 'past' | 'today' | 'upcoming',
      // Reset custom date range when using time filter
      startDate: undefined,
      endDate: undefined,
    };
    onFiltersChange(newFilters);
  };

  const handleDateRangeSelect = (range: 'today' | 'week' | 'month' | 'clear') => {
    const today = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    switch (range) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        startDate = weekStart.toISOString().split('T')[0];
        endDate = weekEnd.toISOString().split('T')[0];
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        startDate = monthStart.toISOString().split('T')[0];
        endDate = monthEnd.toISOString().split('T')[0];
        break;
      case 'clear':
        startDate = undefined;
        endDate = undefined;
        break;
    }

    onFiltersChange({
      ...filters,
      startDate,
      endDate,
      // Reset time filter when using custom date range
      timeFilter: range === 'clear' ? undefined : filters.timeFilter
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof ActivityFiltersType]);

  return (
    <View className="mb-4">
      {/* Filter Toggle */}
      <TouchableOpacity
        className="flex-row justify-between items-center p-4 rounded-lg border"
        style={{ 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View className="flex-row items-center">
          <Text className="text-lg font-medium mr-2" style={{ color: colors.textPrimary }}>
            🔍 Filters
          </Text>
          {hasActiveFilters && (
            <View 
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-xs">Active</Text>
            </View>
          )}
        </View>
        <Text className="text-xl" style={{ color: colors.textSecondary }}>
          {isExpanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Filter Options */}
      {isExpanded && (
        <View 
          className="mt-2 p-4 rounded-lg border"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border 
          }}
        >
          {/* Time Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
              ⏰ Time Period
            </Text>
            <SelectModal
              items={timeFilterItems}
              selectedValue={filters.timeFilter || 'all'}
              placeholder="All activities"
              title="Select Time Period"
              onSelect={handleTimeFilterSelect}
            />
          </View>

          {/* Date Range Quick Filters */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
              📅 Custom Date Range
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'clear', label: 'Clear Range' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  className="mr-2 mb-2 px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: (option.key === 'clear' && !filters.startDate) ||
                                   (option.key !== 'clear' && filters.startDate)
                                   ? colors.primary : colors.background,
                    borderColor: colors.border
                  }}
                  onPress={() => handleDateRangeSelect(option.key as any)}
                >
                  <Text
                    className="text-sm"
                    style={{
                      color: (option.key === 'clear' && !filters.startDate) ||
                             (option.key !== 'clear' && filters.startDate)
                             ? 'white' : colors.textPrimary
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Audience Type Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
              👥 Audience Type
            </Text>
            <SelectModal
              items={audienceTypeItems}
              selectedValue={filters.audienceType}
              placeholder="All audience types"
              title="Select Audience Type"
              onSelect={handleAudienceTypeSelect}
            />
          </View>

          {/* Class Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
              🏫 Class
            </Text>
            <SelectModal
              items={getClassItems()}
              selectedValue={filters.classId}
              placeholder="All classes"
              title="Select Class"
              searchEnabled={true}
              searchPlaceholder="Search classes..."
              onSelect={handleClassSelect}
            />
          </View>

          {/* Student Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
              👶 Student
            </Text>
            <SelectModal
              items={getStudentItems()}
              selectedValue={filters.studentId}
              placeholder="All students"
              title="Select Student"
              searchEnabled={true}
              searchPlaceholder="Search students..."
              onSelect={handleStudentSelect}
            />
          </View>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <TouchableOpacity
              className="p-3 rounded-lg border"
              style={{ 
                backgroundColor: colors.background,
                borderColor: '#EF4444' 
              }}
              onPress={clearAllFilters}
            >
              <Text className="text-center font-medium" style={{ color: '#EF4444' }}>
                🗑️ Clear All Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ActivityFilters;
