import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useTeacherClasses } from '../../../../contexts';
import { activityService, UpdateActivityData, Activity } from '../../../../services';
import { SelectModal, SelectableItem } from '../../../../components';
import { useApi } from '../../../../hooks';

interface EditActivityModalProps {
  visible: boolean;
  activity: Activity;
  onClose: () => void;
  onActivityUpdated: () => void;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  visible,
  activity,
  onClose,
  onActivityUpdated,
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

  // API hook for updating activity
  const {
    request: updateActivity,
    isLoading: isUpdating,
    error: updateError,
  } = useApi<any>(activityService.updateActivity);

  // Date/Time picker handlers
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
  };

  // Initialize form with activity data
  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDescription(activity.description);

      const activityDate = new Date(activity.date);
      setSelectedDate(activityDate);
      setSelectedTime(activityDate);

      setColor(activity.color);
      setAudienceType(activity.audience.type);
      setSelectedClassId(activity.audience.class_id?._id || '');
      setSelectedStudentId(activity.audience.student_id?._id || '');
    }
  }, [activity]);

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

      const activityData: UpdateActivityData = {
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

      await updateActivity(activity._id, activityData);
      onActivityUpdated();
    } catch (error) {
      Alert.alert('Error', updateError || 'Failed to update activity. Please try again.', [
        { text: 'OK' },
      ]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <View className="flex-1 bg-black/50" onTouchEnd={onClose} />
        <View
          className="rounded-t-lg"
          style={{
            backgroundColor: colors.background,
            height: '80%',
          }}>
          {/* Header */}
          <View className="border-b p-4" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                ✏️ Edit Activity
              </Text>
              <TouchableOpacity onPress={onClose}>
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
              onPress={onClose}
              disabled={isUpdating}>
              <Text className="text-center font-medium" style={{ color: colors.textPrimary }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-2 flex-1 rounded-lg p-4"
              style={{
                backgroundColor: isUpdating ? colors.border : colors.primary,
                opacity: isUpdating ? 0.6 : 1,
              }}
              onPress={handleSubmit}
              disabled={isUpdating}>
              <Text className="text-center font-medium text-white">
                {isUpdating ? 'Updating...' : 'Update Activity'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default EditActivityModal;
