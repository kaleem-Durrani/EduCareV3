import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useTheme, useTeacherClasses } from '../../../../contexts';
import { activityService, CreateActivityData } from '../../../../services';
import { SelectModal, SelectableItem } from '../../../../components';
import { useApi } from '../../../../hooks';

interface CreateActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onActivityCreated: () => void;
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  visible,
  onClose,
  onActivityCreated,
}) => {
  const { colors } = useTheme();
  const { classes, allStudents, studentsByClass } = useTeacherClasses();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [color, setColor] = useState('#3B82F6');
  const [audienceType, setAudienceType] = useState<'all' | 'class' | 'student'>('all');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Date/Time picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // API hook for creating activity
  const {
    request: createActivity,
    isLoading: isCreating,
    error: createError,
  } = useApi<any>(activityService.createActivity);

  // Predefined colors
  const colorOptions = [
    { value: '#3B82F6', label: 'Blue', color: '#3B82F6' },
    { value: '#10B981', label: 'Green', color: '#10B981' },
    { value: '#F59E0B', label: 'Yellow', color: '#F59E0B' },
    { value: '#EF4444', label: 'Red', color: '#EF4444' },
    { value: '#8B5CF6', label: 'Purple', color: '#8B5CF6' },
    { value: '#F97316', label: 'Orange', color: '#F97316' },
    { value: '#06B6D4', label: 'Cyan', color: '#06B6D4' },
    { value: '#84CC16', label: 'Lime', color: '#84CC16' },
  ];

  // Audience type options
  const audienceTypeItems: SelectableItem[] = [
    { value: 'all', label: 'All Students', secondaryLabel: 'Visible to everyone' },
    { value: 'class', label: 'Specific Class', secondaryLabel: 'Class-specific activity' },
    { value: 'student', label: 'Individual Student', secondaryLabel: 'Student-specific activity' },
  ];

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
    const students = selectedClassId ? studentsByClass[selectedClassId] || [] : allStudents;

    return students.map((student) => ({
      value: student._id,
      label: student.fullName,
      secondaryLabel: `Enrollment #${student.rollNum}`,
      originalData: student,
    }));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setColor('#3B82F6');
    setAudienceType('all');
    setSelectedClassId('');
    setSelectedStudentId('');
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAudienceTypeSelect = (item: SelectableItem) => {
    const newType = item.value as 'all' | 'class' | 'student';
    setAudienceType(newType);
    // Reset selections when changing audience type
    if (newType !== 'class') setSelectedClassId('');
    if (newType !== 'student') setSelectedStudentId('');
  };

  const handleClassSelect = (item: SelectableItem) => {
    setSelectedClassId(item.value);
    setSelectedStudentId(''); // Reset student when class changes
  };

  const handleStudentSelect = (item: SelectableItem) => {
    setSelectedStudentId(item.value);
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return 'Title is required';
    if (!description.trim()) return 'Description is required';

    if (audienceType === 'class' && !selectedClassId) {
      return 'Please select a class';
    }
    if (audienceType === 'student' && !selectedStudentId) {
      return 'Please select a student';
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    try {
      // Combine date and time
      const dateTime = new Date(selectedDate);
      dateTime.setHours(selectedTime.getHours());
      dateTime.setMinutes(selectedTime.getMinutes());

      const activityData: CreateActivityData = {
        title: title.trim(),
        description: description.trim(),
        date: dateTime.toISOString(),
        color,
        audience: {
          type: audienceType,
          class_id: audienceType === 'class' ? selectedClassId : undefined,
          student_id: audienceType === 'student' ? selectedStudentId : undefined,
        },
      };

      await createActivity(activityData);
      onActivityCreated();
      resetForm();
    } catch (error) {
      Alert.alert('Error', createError || 'Failed to create activity. Please try again.', [
        { text: 'OK' },
      ]);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View className="flex-1 justify-end">
        <View className="flex-1 bg-black/50" onTouchEnd={handleClose} />
        <View
          className="rounded-t-lg"
          style={{
            backgroundColor: colors.background,
            height: '80%',
            minHeight: 600,
          }}>
          {/* Header */}
          <View className="border-b p-4" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                🎯 Create Activity
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Content */}
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                📝 Title *
              </Text>
              <TextInput
                className="rounded-lg border p-4"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                placeholder="Enter activity title..."
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                📄 Description *
              </Text>
              <TextInput
                className="rounded-lg border p-4"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  minHeight: 80,
                }}
                placeholder="Enter activity description..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
                maxLength={500}
              />
            </View>

            {/* Date and Time */}
            <View className="mb-4 flex-row">
              <View className="mr-2 flex-1">
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                  📅 Date *
                </Text>
                <TouchableOpacity
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={{ color: colors.textPrimary }}>
                    {selectedDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="ml-2 flex-1">
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                  🕐 Time *
                </Text>
                <TouchableOpacity
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  onPress={() => setShowTimePicker(true)}>
                  <Text style={{ color: colors.textPrimary }}>
                    {selectedTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Color Selection */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                🎨 Color
              </Text>
              <View className="flex-row flex-wrap">
                {colorOptions.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.value}
                    className="mb-3 mr-3 h-12 w-12 rounded-full border-2"
                    style={{
                      backgroundColor: colorOption.color,
                      borderColor: color === colorOption.value ? colors.textPrimary : 'transparent',
                    }}
                    onPress={() => setColor(colorOption.value)}
                  />
                ))}
              </View>
            </View>

            {/* Audience Type */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                👥 Audience *
              </Text>
              <SelectModal
                items={audienceTypeItems}
                selectedValue={audienceType}
                placeholder="Select audience type"
                title="Select Audience Type"
                onSelect={handleAudienceTypeSelect}
              />
            </View>

            {/* Class Selection (if audience is class) */}
            {audienceType === 'class' && (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                  🏫 Class *
                </Text>
                <SelectModal
                  items={getClassItems()}
                  selectedValue={selectedClassId}
                  placeholder="Select a class"
                  title="Select Class"
                  searchEnabled={true}
                  searchPlaceholder="Search classes..."
                  onSelect={handleClassSelect}
                />
              </View>
            )}

            {/* Student Selection (if audience is student) */}
            {audienceType === 'student' && (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                  👶 Student *
                </Text>
                <SelectModal
                  items={getStudentItems()}
                  selectedValue={selectedStudentId}
                  placeholder="Select a student"
                  title="Select Student"
                  searchEnabled={true}
                  searchPlaceholder="Search students..."
                  onSelect={handleStudentSelect}
                />
              </View>
            )}
          </ScrollView>

          {/* Footer Buttons */}
          <View className="flex-row border-t p-4" style={{ borderTopColor: colors.border }}>
            <TouchableOpacity
              className="mr-2 flex-1 rounded-lg p-4"
              style={{ backgroundColor: colors.border }}
              onPress={handleClose}
              disabled={isCreating}>
              <Text className="text-center font-medium" style={{ color: colors.textPrimary }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-2 flex-1 rounded-lg p-4"
              style={{
                backgroundColor: isCreating ? colors.border : colors.primary,
                opacity: isCreating ? 0.6 : 1,
              }}
              onPress={handleSubmit}
              disabled={isCreating}>
              <Text className="text-center font-medium text-white">
                {isCreating ? 'Creating...' : 'Create Activity'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}>
            <View className="flex-1 items-center justify-center bg-black/50">
              <View
                className="mx-4 w-80 rounded-lg bg-white p-6"
                style={{ backgroundColor: colors.background }}>
                <Text
                  className="mb-4 text-center text-lg font-bold"
                  style={{ color: colors.textPrimary }}>
                  📅 Select Date
                </Text>

                {/* Simple Date Selector */}
                <View className="mb-4">
                  <Text className="mb-2 text-sm" style={{ color: colors.textSecondary }}>
                    Selected:{' '}
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="mr-2 flex-1 rounded-lg p-3"
                    style={{ backgroundColor: colors.border }}
                    onPress={() => setShowDatePicker(false)}>
                    <Text className="text-center font-medium" style={{ color: colors.textPrimary }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="ml-2 flex-1 rounded-lg p-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={() => setShowDatePicker(false)}>
                    <Text className="text-center font-medium text-white">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Time Picker Modal */}
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowTimePicker(false)}>
            <View className="flex-1 items-center justify-center bg-black/50">
              <View
                className="mx-4 w-80 rounded-lg bg-white p-6"
                style={{ backgroundColor: colors.background }}>
                <Text
                  className="mb-4 text-center text-lg font-bold"
                  style={{ color: colors.textPrimary }}>
                  🕐 Select Time
                </Text>

                {/* Simple Time Selector */}
                <View className="mb-4">
                  <Text className="mb-2 text-sm" style={{ color: colors.textSecondary }}>
                    Selected:{' '}
                    {selectedTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="mr-2 flex-1 rounded-lg p-3"
                    style={{ backgroundColor: colors.border }}
                    onPress={() => setShowTimePicker(false)}>
                    <Text className="text-center font-medium" style={{ color: colors.textPrimary }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="ml-2 flex-1 rounded-lg p-3"
                    style={{ backgroundColor: colors.primary }}
                    onPress={() => setShowTimePicker(false)}>
                    <Text className="text-center font-medium text-white">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

export default CreateActivityModal;
