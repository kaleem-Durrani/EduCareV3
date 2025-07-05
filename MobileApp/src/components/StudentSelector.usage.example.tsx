// Example usage of the global StudentSelector component
// This file shows different ways to use the StudentSelector

import React, { useState } from 'react';
import { View } from 'react-native';
import { StudentSelector } from './StudentSelector';
import { ClassStudent } from '../services';

export const StudentSelectorExamples = () => {
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(null);

  const handleStudentSelect = (student: ClassStudent) => {
    setSelectedStudent(student);
  };

  const handleResetSelection = () => {
    setSelectedStudent(null);
  };

  return (
    <View>
      {/* 1. Tag Mode (Collapsible) - Perfect for Notes, Activities, etc. */}
      <StudentSelector
        selectedStudent={selectedStudent}
        onStudentSelect={handleStudentSelect}
        onResetSelection={handleResetSelection}
        placeholder="Select a student to view notes"
        showAsTag={true}
        compact={true}
      />

      {/* 2. Regular Mode (Always Expanded) - Perfect for Forms, Filters */}
      <StudentSelector
        selectedStudent={selectedStudent}
        onStudentSelect={handleStudentSelect}
        onResetSelection={handleResetSelection}
        placeholder="Choose a student"
        showAsTag={false}
        compact={false}
      />

      {/* 3. Compact Regular Mode - For smaller spaces */}
      <StudentSelector
        selectedStudent={selectedStudent}
        onStudentSelect={handleStudentSelect}
        onResetSelection={handleResetSelection}
        placeholder="Student"
        showAsTag={false}
        compact={true}
      />

      {/* 4. Disabled Mode - For read-only views */}
      <StudentSelector
        selectedStudent={selectedStudent}
        onStudentSelect={handleStudentSelect}
        onResetSelection={handleResetSelection}
        placeholder="Student (read-only)"
        showAsTag={true}
        compact={true}
        disabled={true}
      />
    </View>
  );
};

/*
USAGE PATTERNS:

1. NOTES SCREEN (Current Implementation):
   - showAsTag={true} + compact={true}
   - Saves space, shows selected student as tag
   - Auto-closes after selection

2. ACTIVITIES SCREEN:
   - showAsTag={true} + compact={true}
   - Same pattern as notes

3. REPORTS/ANALYTICS SCREEN:
   - showAsTag={false} + compact={false}
   - Always visible for filtering
   - User can see all options

4. QUICK ACTIONS/MODALS:
   - showAsTag={false} + compact={true}
   - Smaller footprint in modals
   - Still shows all options

5. READ-ONLY VIEWS:
   - disabled={true}
   - Shows current selection but prevents changes

PROPS EXPLANATION:

- selectedStudent: Currently selected student (can be null)
- onStudentSelect: Callback when student is selected
- onResetSelection: Callback when selection is cleared
- placeholder: Text shown when no student selected
- showAsTag: true = collapsible tag mode, false = always expanded
- compact: true = smaller spacing, false = normal spacing
- disabled: true = read-only mode, false = interactive

FEATURES:

✅ Uses TeacherClassesContext internally (no need to pass data)
✅ Two selection modes: "All Students" and "By Class"
✅ Search functionality in both modes
✅ Responsive design that works on all screen sizes
✅ Consistent with app's design system
✅ Auto-closes in tag mode after selection
✅ Shows student info with class and roll number
✅ Handles edge cases (no students, no classes, etc.)
*/
