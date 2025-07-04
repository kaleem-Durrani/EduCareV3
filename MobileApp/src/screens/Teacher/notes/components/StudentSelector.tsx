import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../contexts';
import { EnrolledClass, ClassStudent } from '../../../../services';
import { SelectModal, SelectableItem } from '../../../../components';

interface StudentSelectorProps {
  classes: EnrolledClass[];
  allStudents: ClassStudent[];
  studentsByClass: Record<string, ClassStudent[]>;
  onStudentSelect: (student: ClassStudent) => void;
  onResetSelection: () => void;
}

type SelectionMode = 'all' | 'byClass';

const StudentSelector: React.FC<StudentSelectorProps> = ({
  classes,
  allStudents,
  studentsByClass,
  onStudentSelect,
  onResetSelection,
}) => {
  const { colors } = useTheme();
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('all');
  const [selectedClass, setSelectedClass] = useState<EnrolledClass | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Convert classes to SelectableItem format
  const getClassItems = (): SelectableItem[] => {
    return classes.map(classItem => ({
      value: classItem._id,
      label: classItem.name,
      secondaryLabel: `${classItem.students.length} student${classItem.students.length !== 1 ? 's' : ''}`,
      originalData: classItem
    }));
  };

  // Convert students to SelectableItem format
  const getStudentItems = (): SelectableItem[] => {
    const students = selectionMode === 'all'
      ? allStudents
      : selectedClass ? studentsByClass[selectedClass._id] || [] : [];

    return students.map(student => ({
      value: student._id,
      label: student.fullName,
      secondaryLabel: `Enrollment #${student.rollNum}`,
      originalData: student
    }));
  };

  const handleModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectedClass(null);
    setSelectedClassId('');
    setSelectedStudentId('');
    onResetSelection(); // Reset student selection when mode changes
  };

  const handleClassSelect = (item: SelectableItem) => {
    const classItem = item.originalData as EnrolledClass;
    setSelectedClass(classItem);
    setSelectedClassId(item.value);
    setSelectedStudentId(''); // Reset student selection
    onResetSelection(); // Reset student selection when class changes
  };

  const handleStudentSelect = (item: SelectableItem) => {
    const student = item.originalData as ClassStudent;
    setSelectedStudentId(item.value);
    onStudentSelect(student);
  };

  const classItems = getClassItems();
  const studentItems = getStudentItems();
  const canSelectStudent = selectionMode === 'all' || (selectionMode === 'byClass' && selectedClass);

  return (
    <View>
      {/* Mode Toggle */}
      <View className="mb-4 flex-row rounded-lg border" style={{ borderColor: colors.border }}>
        <TouchableOpacity
          className="flex-1 rounded-l-lg p-3"
          style={{
            backgroundColor: selectionMode === 'all' ? colors.primary : 'transparent'
          }}
          onPress={() => handleModeChange('all')}
        >
          <Text 
            className="text-center font-medium"
            style={{ 
              color: selectionMode === 'all' ? 'white' : colors.textPrimary 
            }}
          >
            All Students
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="flex-1 rounded-r-lg p-3"
          style={{
            backgroundColor: selectionMode === 'byClass' ? colors.primary : 'transparent'
          }}
          onPress={() => handleModeChange('byClass')}
        >
          <Text 
            className="text-center font-medium"
            style={{ 
              color: selectionMode === 'byClass' ? 'white' : colors.textPrimary 
            }}
          >
            By Class
          </Text>
        </TouchableOpacity>
      </View>

      {/* Class Selector (only for byClass mode) */}
      {selectionMode === 'byClass' && (
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
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
        <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
          Select Student
        </Text>
        <SelectModal
          items={studentItems}
          selectedValue={selectedStudentId}
          placeholder={canSelectStudent
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
  );
};

export default StudentSelector;
