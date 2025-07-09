import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts';
import { useTeacherClasses } from '../contexts/TeacherClassesContext';
import { ClassStudent, EnrolledClass } from '../services';
import { SelectModal, SelectableItem } from '.';
import { buildMediaUrl } from '../config';

interface StudentSelectorProps {
  selectedStudent: ClassStudent | null;
  onStudentSelect: (student: ClassStudent) => void;
  onResetSelection: () => void;
  placeholder?: string;
  showAsTag?: boolean;
  compact?: boolean;
  disabled?: boolean;
}

type SelectionMode = 'all' | 'byClass';

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  selectedStudent,
  onStudentSelect,
  onResetSelection,
  placeholder = 'Select a student',
  showAsTag = false,
  compact = false,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { allStudents, classes, studentsByClass } = useTeacherClasses();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('all');
  const [selectedClass, setSelectedClass] = useState<EnrolledClass | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Convert classes to SelectableItem format
  const getClassItems = (): SelectableItem[] => {
    return classes.map((classItem) => ({
      value: classItem._id,
      label: classItem.name,
      secondaryLabel: `${classItem.students.length} student${classItem.students.length !== 1 ? 's' : ''}`,
      originalData: classItem,
    }));
  };

  // Convert students to SelectableItem format
  const getStudentItems = (): SelectableItem[] => {
    const students =
      selectionMode === 'all'
        ? allStudents
        : selectedClass
          ? studentsByClass[selectedClass._id] || []
          : [];

    return students.map((student) => ({
      value: student._id,
      label: student.fullName,
      secondaryLabel: `Enrollment #${student.rollNum}`,
      photoUrl: student.photoUrl, // Pass the photo URL
      originalData: student,
    }));
  };

  const getStudentClass = (student: ClassStudent) => {
    // Find which class this student belongs to
    for (const [classId, students] of Object.entries(studentsByClass)) {
      if (students.some((s) => s._id === student._id)) {
        const classInfo = classes.find((c) => c._id === classId);
        return classInfo ? classInfo.name : 'Unknown Class';
      }
    }
    return 'Unknown Class';
  };

  const handleModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectedClass(null);
    setSelectedClassId('');
    setSelectedStudentId('');
  };

  const handleClassSelect = (item: SelectableItem) => {
    const classItem = item.originalData as EnrolledClass;
    setSelectedClass(classItem);
    setSelectedClassId(item.value);
    setSelectedStudentId('');
  };

  const handleStudentSelect = (item: SelectableItem) => {
    const student = item.originalData as ClassStudent;
    setSelectedStudentId(item.value);
    onStudentSelect(student);
    if (showAsTag) {
      setIsExpanded(false); // Close after selection if showing as tag
    }
  };

  const handleResetSelection = () => {
    onResetSelection();
    setSelectedStudentId('');
    if (showAsTag) {
      setIsExpanded(false);
    }
  };

  const classItems = getClassItems();
  const studentItems = getStudentItems();
  const canSelectStudent =
    selectionMode === 'all' || (selectionMode === 'byClass' && selectedClass);

  // Tag display mode
  if (showAsTag) {
    return (
      <View className={compact ? 'mb-2' : 'mb-4'}>
        {/* Header with Selected Student or Select Button */}
        <View className="flex-row items-center justify-between">
          {selectedStudent ? (
            <View className="mr-3 flex-1">
              <View
                className="flex-row items-center rounded-lg px-3 py-2"
                style={{
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                  borderWidth: 1,
                }}>
                {/* Student Photo or Emoji */}
                <View className="mr-3">
                  <View className="h-10 w-10 overflow-hidden rounded-full">
                    {selectedStudent.photoUrl ? (
                      <Image
                        source={{ uri: buildMediaUrl(selectedStudent.photoUrl) }}
                        className="h-full w-full"
                        resizeMode="cover"
                        onError={() => {
                          console.log('Failed to load student image:', selectedStudent.fullName);
                        }}
                      />
                    ) : (
                      <View
                        className="h-full w-full items-center justify-center"
                        style={{ backgroundColor: colors.primary }}>
                        <Text className="text-lg text-white">👶</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="font-medium" style={{ color: colors.primary }}>
                    {selectedStudent.fullName}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    {getStudentClass(selectedStudent)} • Roll #{selectedStudent.rollNum}
                  </Text>
                </View>
                <TouchableOpacity
                  className="ml-2 rounded-full p-1"
                  style={{ backgroundColor: colors.primary }}
                  onPress={handleResetSelection}
                  disabled={disabled}>
                  <Text className="px-1 text-xs font-bold text-white">✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              className="mr-3 flex-1 rounded-lg px-4 py-3"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderStyle: 'dashed',
                opacity: disabled ? 0.6 : 1,
              }}
              onPress={() => setIsExpanded(true)}
              disabled={disabled}>
              <Text className="text-center" style={{ color: colors.textSecondary }}>
                👶 {placeholder}
              </Text>
            </TouchableOpacity>
          )}

          {/* Expand/Collapse Button */}
          {selectedStudent && (
            <TouchableOpacity
              className="rounded-lg px-3 py-2"
              style={{
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                borderWidth: 1,
                opacity: disabled ? 0.6 : 1,
              }}
              onPress={() => setIsExpanded(!isExpanded)}
              disabled={disabled}>
              <Text className="font-medium text-white">{isExpanded ? 'Close' : 'Change'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Expanded Student Selection */}
        {isExpanded && (
          <View
            className="mt-3 rounded-lg p-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Select Student
              </Text>
              <TouchableOpacity
                className="rounded-full p-2"
                style={{ backgroundColor: colors.border }}
                onPress={() => setIsExpanded(false)}>
                <Text style={{ color: colors.textPrimary }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Mode Toggle */}
            <View
              className="mb-4 flex-row rounded-lg border"
              style={{ borderColor: colors.border }}>
              <TouchableOpacity
                className="flex-1 rounded-l-lg p-3"
                style={{
                  backgroundColor: selectionMode === 'all' ? colors.primary : 'transparent',
                }}
                onPress={() => handleModeChange('all')}>
                <Text
                  className="text-center font-medium"
                  style={{
                    color: selectionMode === 'all' ? 'white' : colors.textPrimary,
                  }}>
                  All Students
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-r-lg p-3"
                style={{
                  backgroundColor: selectionMode === 'byClass' ? colors.primary : 'transparent',
                }}
                onPress={() => handleModeChange('byClass')}>
                <Text
                  className="text-center font-medium"
                  style={{
                    color: selectionMode === 'byClass' ? 'white' : colors.textPrimary,
                  }}>
                  By Class
                </Text>
              </TouchableOpacity>
            </View>

            {/* Class Selector (only for byClass mode) */}
            {selectionMode === 'byClass' && (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Select Class
                </Text>
                <SelectModal
                  items={classItems}
                  selectedValue={selectedClassId}
                  placeholder="Choose a class..."
                  title="Select Class"
                  searchEnabled={true}
                  searchPlaceholder="Search classes..."
                  onSelect={handleClassSelect}
                />
              </View>
            )}

            {/* Student Selector */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                Select Student
              </Text>
              <SelectModal
                items={studentItems}
                selectedValue={selectedStudentId}
                placeholder={
                  canSelectStudent
                    ? `Choose from ${studentItems.length} student${studentItems.length !== 1 ? 's' : ''}...`
                    : 'Select a class first...'
                }
                title="👶 Select Student"
                searchEnabled={true}
                searchPlaceholder="Search students..."
                onSelect={handleStudentSelect}
                disabled={!canSelectStudent}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  // Regular display mode (original functionality)
  return (
    <View className={compact ? 'mb-2' : 'mb-4'}>
      {/* Mode Toggle */}
      <View className="mb-4 flex-row rounded-lg border" style={{ borderColor: colors.border }}>
        <TouchableOpacity
          className="flex-1 rounded-l-lg p-3"
          style={{
            backgroundColor: selectionMode === 'all' ? colors.primary : 'transparent',
          }}
          onPress={() => handleModeChange('all')}
          disabled={disabled}>
          <Text
            className="text-center font-medium"
            style={{
              color: selectionMode === 'all' ? 'white' : colors.textPrimary,
            }}>
            All Students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 rounded-r-lg p-3"
          style={{
            backgroundColor: selectionMode === 'byClass' ? colors.primary : 'transparent',
          }}
          onPress={() => handleModeChange('byClass')}
          disabled={disabled}>
          <Text
            className="text-center font-medium"
            style={{
              color: selectionMode === 'byClass' ? 'white' : colors.textPrimary,
            }}>
            By Class
          </Text>
        </TouchableOpacity>
      </View>

      {/* Class Selector (only for byClass mode) */}
      {selectionMode === 'byClass' && (
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
            Select Class
          </Text>
          <SelectModal
            items={classItems}
            selectedValue={selectedClassId}
            placeholder="Choose a class..."
            title="Select Class"
            searchEnabled={true}
            searchPlaceholder="Search classes..."
            onSelect={handleClassSelect}
            disabled={disabled}
          />
        </View>
      )}

      {/* Student Selector */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
          Select Student
        </Text>
        <SelectModal
          items={studentItems}
          selectedValue={selectedStudentId}
          placeholder={
            canSelectStudent
              ? `Choose from ${studentItems.length} student${studentItems.length !== 1 ? 's' : ''}...`
              : 'Select a class first...'
          }
          title="👶 Select Student"
          searchEnabled={true}
          searchPlaceholder="Search students..."
          onSelect={handleStudentSelect}
          disabled={!canSelectStudent || disabled}
        />
      </View>
    </View>
  );
};
