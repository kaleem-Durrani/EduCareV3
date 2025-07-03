import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { useTheme } from '../../../../contexts';
import { EnrolledClass, ClassStudent } from '../../../../services';

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
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [classSearchText, setClassSearchText] = useState('');
  const [studentSearchText, setStudentSearchText] = useState('');

  const getStudentsForSelection = (): ClassStudent[] => {
    if (selectionMode === 'all') {
      return allStudents;
    } else {
      return selectedClass ? studentsByClass[selectedClass._id] || [] : [];
    }
  };

  const getFilteredClasses = (): EnrolledClass[] => {
    if (!classSearchText.trim()) return classes;
    return classes.filter(classItem =>
      classItem.name.toLowerCase().includes(classSearchText.toLowerCase()) ||
      (classItem.description && classItem.description.toLowerCase().includes(classSearchText.toLowerCase()))
    );
  };

  const getFilteredStudents = (): ClassStudent[] => {
    const students = getStudentsForSelection();
    if (!studentSearchText.trim()) return students;
    return students.filter(student =>
      student.fullName.toLowerCase().includes(studentSearchText.toLowerCase()) ||
      student.rollNum.toString().includes(studentSearchText)
    );
  };

  const handleModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectedClass(null);
    onResetSelection(); // Reset student selection when mode changes
  };

  const handleClassSelect = (classItem: EnrolledClass) => {
    setSelectedClass(classItem);
    setIsClassModalVisible(false);
    setClassSearchText(''); // Reset search
    onResetSelection(); // Reset student selection when class changes
  };

  const handleStudentSelect = (student: ClassStudent) => {
    onStudentSelect(student);
    setIsStudentModalVisible(false);
    setStudentSearchText(''); // Reset search
  };

  const renderClassItem = ({ item }: { item: EnrolledClass }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={() => handleClassSelect(item)}
    >
      <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
        {item.name}
      </Text>
      {item.description && (
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          {item.description}
        </Text>
      )}
      <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
        {item.students.length} student{item.students.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );

  const renderStudentItem = ({ item }: { item: ClassStudent }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={() => handleStudentSelect(item)}
    >
      <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
        {item.fullName}
      </Text>
      <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
        Enrollment #{item.rollNum}
      </Text>
    </TouchableOpacity>
  );

  const renderModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    data: any[],
    renderItem: any,
    searchText: string,
    onSearchChange: (text: string) => void,
    searchPlaceholder: string
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View
          className="bg-black/50 flex-1"
          onTouchEnd={onClose}
        />
        <View
          className="rounded-t-lg max-h-96"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="p-4 border-b" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary
              }}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={onSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* List */}
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="p-4 items-center">
                <Text style={{ color: colors.textSecondary }}>
                  No results found
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const canSelectStudent = selectionMode === 'all' || (selectionMode === 'byClass' && selectedClass);
  const studentsToShow = getStudentsForSelection();
  const filteredClasses = getFilteredClasses();
  const filteredStudents = getFilteredStudents();

  return (
    <View className="mb-6">
      <Text className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
        📞 Select Student for Contacts
      </Text>

      {/* Selection Mode Toggle */}
      <View className="flex-row mb-4 rounded-lg overflow-hidden" style={{ backgroundColor: colors.border }}>
        <TouchableOpacity
          className="flex-1 p-3"
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
          className="flex-1 p-3"
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
          <TouchableOpacity
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }}
            onPress={() => setIsClassModalVisible(true)}
          >
            <Text className="text-base" style={{ 
              color: selectedClass ? colors.textPrimary : colors.textSecondary 
            }}>
              {selectedClass ? selectedClass.name : 'Choose a class...'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Student Selector */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
          Select Student
        </Text>
        <TouchableOpacity
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: canSelectStudent ? colors.card : colors.border,
            borderColor: colors.border,
            opacity: canSelectStudent ? 1 : 0.6
          }}
          onPress={() => canSelectStudent && setIsStudentModalVisible(true)}
          disabled={!canSelectStudent}
        >
          <Text className="text-base" style={{ 
            color: canSelectStudent ? colors.textPrimary : colors.textSecondary 
          }}>
            {canSelectStudent 
              ? `Choose from ${studentsToShow.length} student${studentsToShow.length !== 1 ? 's' : ''}...`
              : 'Select a class first...'
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {renderModal(
        isClassModalVisible,
        () => setIsClassModalVisible(false),
        'Select Class',
        filteredClasses,
        renderClassItem,
        classSearchText,
        setClassSearchText,
        'Search classes...'
      )}

      {renderModal(
        isStudentModalVisible,
        () => setIsStudentModalVisible(false),
        'Select Student',
        filteredStudents,
        renderStudentItem,
        studentSearchText,
        setStudentSearchText,
        'Search students...'
      )}
    </View>
  );
};

export default StudentSelector;
