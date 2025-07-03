import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../../../contexts';
import { EnrolledClass, ClassStudent } from '../../../../services';

interface StudentSelectorProps {
  classes: EnrolledClass[];
  allStudents: ClassStudent[];
  studentsByClass: Record<string, ClassStudent[]>;
  onStudentSelect: (student: ClassStudent) => void;
}

type SelectionMode = 'all' | 'byClass';

const StudentSelector: React.FC<StudentSelectorProps> = ({
  classes,
  allStudents,
  studentsByClass,
  onStudentSelect,
}) => {
  const { colors } = useTheme();
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('all');
  const [selectedClass, setSelectedClass] = useState<EnrolledClass | null>(null);
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);

  const getStudentsForSelection = (): ClassStudent[] => {
    if (selectionMode === 'all') {
      return allStudents;
    } else {
      return selectedClass ? studentsByClass[selectedClass._id] || [] : [];
    }
  };

  const handleModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectedClass(null);
  };

  const handleClassSelect = (classItem: EnrolledClass) => {
    setSelectedClass(classItem);
    setIsClassModalVisible(false);
  };

  const handleStudentSelect = (student: ClassStudent) => {
    onStudentSelect(student);
    setIsStudentModalVisible(false);
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
    renderItem: any
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
          <View className="p-4 border-b" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  const canSelectStudent = selectionMode === 'all' || (selectionMode === 'byClass' && selectedClass);
  const studentsToShow = getStudentsForSelection();

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
        classes,
        renderClassItem
      )}

      {renderModal(
        isStudentModalVisible,
        () => setIsStudentModalVisible(false),
        'Select Student',
        studentsToShow,
        renderStudentItem
      )}
    </View>
  );
};

export default StudentSelector;
