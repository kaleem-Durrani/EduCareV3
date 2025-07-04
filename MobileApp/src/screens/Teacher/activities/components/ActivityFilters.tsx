import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, useTeacherClasses } from '../../../../contexts';
import { ActivityFilters as ActivityFiltersType } from '../../../../services';
import { SelectModal, SelectableItem } from '../../../../components';

interface ActivityFiltersProps {
  filters: ActivityFiltersType;
  onFiltersChange: (filters: ActivityFiltersType) => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ filters, onFiltersChange }) => {
  const { colors } = useTheme();
  const { classes, allStudents, studentsByClass } = useTeacherClasses();
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert classes to SelectableItem format
  const getClassItems = (): SelectableItem[] => {
    return classes.map((classItem) => ({
      value: classItem._id,
      label: classItem.name,
      secondaryLabel: `${classItem.students.length} students`,
      originalData: classItem,
    }));
  };

  // Convert students to SelectableItem format
  const getStudentItems = (): SelectableItem[] => {
    const students = filters.classId ? studentsByClass[filters.classId] || [] : allStudents;

    return students.map((student) => ({
      value: student._id,
      label: student.fullName,
      secondaryLabel: `Enrollment #${student.rollNum}`,
      originalData: student,
    }));
  };

  // Audience type options
  const audienceTypeItems: SelectableItem[] = [
    { value: 'all', label: 'All Students', secondaryLabel: 'Visible to everyone' },
    { value: 'class', label: 'Specific Class', secondaryLabel: 'Class-specific activities' },
    {
      value: 'student',
      label: 'Individual Student',
      secondaryLabel: 'Student-specific activities',
    },
  ];

  // Time filter options
  const timeFilterItems: SelectableItem[] = [
    { value: 'all', label: 'All Activities', secondaryLabel: 'Past, present, and future' },
    { value: 'past', label: 'Past Activities', secondaryLabel: 'Activities before today' },
    { value: 'today', label: "Today's Activities", secondaryLabel: 'Activities happening today' },
    { value: 'upcoming', label: 'Upcoming Activities', secondaryLabel: 'Activities after today' },
  ];

  const handleClassSelect = (item: SelectableItem) => {
    const newFilters = {
      ...filters,
      classId: item.value,
      studentId: undefined, // Reset student when class changes
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

  const [selectedDateRange, setSelectedDateRange] = useState<string>('');

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

    setSelectedDateRange(range === 'clear' ? '' : range);
    onFiltersChange({
      ...filters,
      startDate,
      endDate,
      // Reset time filter when using custom date range
      timeFilter: range === 'clear' ? filters.timeFilter : undefined,
    });
  };

  const clearAllFilters = () => {
    setSelectedDateRange('');
    onFiltersChange({});
  };

  const clearIndividualFilter = (filterType: string) => {
    const newFilters = { ...filters };

    switch (filterType) {
      case 'timeFilter':
        delete newFilters.timeFilter;
        break;
      case 'dateRange':
        delete newFilters.startDate;
        delete newFilters.endDate;
        setSelectedDateRange('');
        break;
      case 'audienceType':
        delete newFilters.audienceType;
        break;
      case 'class':
        delete newFilters.classId;
        break;
      case 'student':
        delete newFilters.studentId;
        break;
    }

    onFiltersChange(newFilters);
  };

  const getActiveFilterTags = () => {
    const tags = [];

    if (filters.timeFilter && filters.timeFilter !== 'all') {
      const timeFilterLabel =
        timeFilterItems.find((item) => item.value === filters.timeFilter)?.label ||
        filters.timeFilter;
      tags.push({ key: 'timeFilter', label: timeFilterLabel });
    }

    if (filters.startDate || filters.endDate) {
      tags.push({ key: 'dateRange', label: 'Custom Date Range' });
    }

    if (filters.audienceType && filters.audienceType !== 'all') {
      const audienceLabel =
        audienceTypeItems.find((item) => item.value === filters.audienceType)?.label ||
        filters.audienceType;
      tags.push({ key: 'audienceType', label: audienceLabel });
    }

    if (filters.classId) {
      const classItem = classes.find((c) => c._id === filters.classId);
      tags.push({ key: 'class', label: `Class: ${classItem?.name || 'Unknown'}` });
    }

    if (filters.studentId) {
      const student = allStudents.find((s) => s._id === filters.studentId);
      tags.push({ key: 'student', label: `Student: ${student?.fullName || 'Unknown'}` });
    }

    return tags;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.timeFilter && filters.timeFilter !== 'all') count++;
    if (filters.startDate || filters.endDate) count++;
    if (filters.audienceType && filters.audienceType !== 'all') count++;
    if (filters.classId) count++;
    if (filters.studentId) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <View className="mb-4">
      {/* Filter Toggle */}
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-lg border p-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
        onPress={() => setIsExpanded(!isExpanded)}>
        <View className="flex-row items-center">
          <Text className="mr-2 text-lg font-medium" style={{ color: colors.textPrimary }}>
            🔍 Filters
          </Text>
          {hasActiveFilters && (
            <View className="rounded-full px-2 py-1" style={{ backgroundColor: colors.primary }}>
              <Text className="text-xs text-white">{getActiveFiltersCount()}</Text>
            </View>
          )}
        </View>
        <Text className="text-xl" style={{ color: colors.textSecondary }}>
          {isExpanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <View className="mt-2 flex-row flex-wrap">
          {getActiveFilterTags().map((tag) => (
            <View
              key={tag.key}
              className="mb-2 mr-2 flex-row items-center rounded-full border px-3 py-1"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.primary,
              }}>
              <Text className="mr-1 text-xs" style={{ color: colors.primary }}>
                {tag.label}
              </Text>
              <TouchableOpacity onPress={() => clearIndividualFilter(tag.key)}>
                <Text className="text-xs" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Filter Options */}
      {isExpanded && (
        <View
          className="mt-2 rounded-lg border p-4"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}>
          {/* Time Filter */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
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
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
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
                  className="mb-2 mr-2 rounded-lg border px-3 py-2"
                  style={{
                    backgroundColor:
                      selectedDateRange === option.key ||
                      (option.key === 'clear' && selectedDateRange === '')
                        ? colors.primary
                        : colors.background,
                    borderColor: colors.border,
                  }}
                  onPress={() => handleDateRangeSelect(option.key as any)}>
                  <Text
                    className="text-sm"
                    style={{
                      color:
                        selectedDateRange === option.key ||
                        (option.key === 'clear' && selectedDateRange === '')
                          ? 'white'
                          : colors.textPrimary,
                    }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Audience Type Filter */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
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
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                🏫 Class
              </Text>
              {filters.classId && (
                <TouchableOpacity onPress={() => clearIndividualFilter('class')}>
                  <Text className="text-sm" style={{ color: colors.primary }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                👶 Student
              </Text>
              {filters.studentId && (
                <TouchableOpacity onPress={() => clearIndividualFilter('student')}>
                  <Text className="text-sm" style={{ color: colors.primary }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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
              className="rounded-lg border p-3"
              style={{
                backgroundColor: colors.background,
                borderColor: '#EF4444',
              }}
              onPress={clearAllFilters}>
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
