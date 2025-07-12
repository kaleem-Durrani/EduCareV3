import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { launchImageLibrary, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import { useTheme, useTeacherClasses } from '../../../../contexts';
import { Post, UpdatePostData, ClassStudent, EnrolledClass } from '../../../../services';
import Toast from 'react-native-toast-message';

interface EditPostModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: (postId: string, postData: UpdatePostData, mediaFiles?: File[]) => void;
  isUpdating: boolean;
  classes: EnrolledClass[];
  students: ClassStudent[];
  post: Post | null;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  visible,
  onClose,
  onUpdate,
  isUpdating,
  classes,
  students,
  post,
}) => {
  const { colors } = useTheme();
  const { classes: allClasses = [], studentsByClass = {} } = useTeacherClasses();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audienceType, setAudienceType] = useState<'all' | 'class' | 'individual'>('all');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);

  useEffect(() => {
    if (visible && post) {
      // Initialize form with post data
      setTitle(post.title);
      setContent(post.content);
      setAudienceType(post.audience.type);
      
      // Set selected class IDs
      if (post.audience.type === 'class' && post.audience.class_ids) {
        setSelectedClassIds(post.audience.class_ids.map(cls => cls._id));
      } else {
        setSelectedClassIds([]);
      }
      
      // Set selected student IDs
      if (post.audience.type === 'individual' && post.audience.student_ids) {
        setSelectedStudentIds(post.audience.student_ids.map(student => student._id));
      } else {
        setSelectedStudentIds([]);
      }
      
      // Clear media files (existing media will be preserved on backend)
      setMediaFiles([]);
    }
  }, [visible, post]);

  const handleUpdate = () => {
    if (!post) return;
    
    if (!title.trim() || !content.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields',
        visibilityTime: 3000,
      });
      return;
    }

    const postData: UpdatePostData = {
      title: title.trim(),
      content: content.trim(),
      audience: {
        type: audienceType,
        class_ids: audienceType === 'class' ? selectedClassIds : undefined,
        student_ids: audienceType === 'individual' ? selectedStudentIds : undefined,
      },
    };

    onUpdate(post._id, postData, mediaFiles.length > 0 ? mediaFiles : undefined);
  };

  const handleClassToggle = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleAddMedia = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as const,
      selectionLimit: 5,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets) {
        const newFiles = response.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || 'media_file',
          size: asset.fileSize,
        }));
        setMediaFiles((prev) => [...prev, ...newFiles]);
      }
    });
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const renderMediaItem = ({ item, index }: { item: any; index: number }) => (
    <View className="relative mr-2">
      <Image source={{ uri: item.uri }} className="h-20 w-20 rounded-lg" />
      <TouchableOpacity
        className="absolute -right-1 -top-1 h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.error }}
        onPress={() => handleRemoveMedia(index)}>
        <Text className="text-xs font-bold text-white">×</Text>
      </TouchableOpacity>
    </View>
  );

  const getStudentClass = (student: ClassStudent) => {
    // Find which class this student belongs to
    for (const [classId, classStudents] of Object.entries(studentsByClass)) {
      if (classStudents.some((s) => s._id === student._id)) {
        const classInfo = classes.find((c) => c._id === classId);
        return classInfo ? classInfo.name : 'Unknown Class';
      }
    }
    return 'Unknown Class';
  };

  const getFilteredStudents = () => {
    if (selectedClassIds.length === 0) return students;
    return students.filter((student) => {
      // Find which class this student belongs to
      for (const [classId, classStudents] of Object.entries(studentsByClass)) {
        if (classStudents.some((s) => s._id === student._id)) {
          return selectedClassIds.includes(classId);
        }
      }
      return false;
    });
  };

  if (!post) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <View className="flex-1 bg-black/50" onTouchEnd={onClose} />
        <View
          className="rounded-t-lg"
          style={{
            backgroundColor: colors.background,
            height: '85%',
            minHeight: 500,
          }}>
          {/* Header */}
          <View className="border-b p-4" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                ✏️ Edit Post
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Title *
              </Text>
              <TextInput
                className="rounded-lg border p-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                }}
                placeholder="Enter post title"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
                multiline={false}
              />
            </View>

            {/* Content Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Content *
              </Text>
              <TextInput
                className="rounded-lg border p-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.textPrimary,
                  minHeight: 100,
                }}
                placeholder="Write your post content here..."
                placeholderTextColor={colors.textMuted}
                value={content}
                onChangeText={setContent}
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            {/* Audience Selection */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Audience
              </Text>
              <View className="flex-row space-x-2">
                {(['all', 'class', 'individual'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`flex-1 rounded-lg border p-3 ${
                      audienceType === type ? 'border-2' : ''
                    }`}
                    style={{
                      borderColor: audienceType === type ? colors.primary : colors.border,
                      backgroundColor: audienceType === type ? colors.primary + '10' : colors.card,
                    }}
                    onPress={() => setAudienceType(type)}>
                    <Text
                      className="text-center text-sm font-medium"
                      style={{
                        color: audienceType === type ? colors.primary : colors.textPrimary,
                      }}>
                      {type === 'all' ? 'All Students' : type === 'class' ? 'Specific Classes' : 'Individual Students'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Class Selection */}
            {audienceType === 'class' && (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Select Classes
                </Text>
                <View className="flex-row flex-wrap">
                  {classes.map((cls) => (
                    <TouchableOpacity
                      key={cls._id}
                      className={`mb-2 mr-2 rounded-lg border px-3 py-2 ${
                        selectedClassIds.includes(cls._id) ? 'border-2' : ''
                      }`}
                      style={{
                        borderColor: selectedClassIds.includes(cls._id) ? colors.primary : colors.border,
                        backgroundColor: selectedClassIds.includes(cls._id) ? colors.primary + '10' : colors.card,
                      }}
                      onPress={() => handleClassToggle(cls._id)}>
                      <Text
                        className="text-sm"
                        style={{
                          color: selectedClassIds.includes(cls._id) ? colors.primary : colors.textPrimary,
                        }}>
                        {cls.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Student Selection */}
            {audienceType === 'individual' && (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Select Students
                </Text>
                <ScrollView className="max-h-40" nestedScrollEnabled>
                  {getFilteredStudents().map((student) => (
                    <TouchableOpacity
                      key={student._id}
                      className={`mb-2 flex-row items-center rounded-lg border p-3 ${
                        selectedStudentIds.includes(student._id) ? 'border-2' : ''
                      }`}
                      style={{
                        borderColor: selectedStudentIds.includes(student._id) ? colors.primary : colors.border,
                        backgroundColor: selectedStudentIds.includes(student._id) ? colors.primary + '10' : colors.card,
                      }}
                      onPress={() => handleStudentToggle(student._id)}>
                      <Text
                        className="flex-1 text-sm"
                        style={{
                          color: selectedStudentIds.includes(student._id) ? colors.primary : colors.textPrimary,
                        }}>
                        {student.fullName} - {getStudentClass(student)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Media Section */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                Add New Media (Optional)
              </Text>
              <TouchableOpacity
                className="mb-2 rounded-lg border border-dashed p-4"
                style={{ borderColor: colors.border }}
                onPress={handleAddMedia}>
                <Text className="text-center" style={{ color: colors.textSecondary }}>
                  📷 Tap to add photos/videos
                </Text>
              </TouchableOpacity>

              {mediaFiles.length > 0 && (
                <FlatList
                  data={mediaFiles}
                  renderItem={renderMediaItem}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="border-t p-4" style={{ borderTopColor: colors.border }}>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 rounded-lg border py-3"
                style={{ borderColor: colors.border }}
                onPress={onClose}>
                <Text className="text-center font-medium" style={{ color: colors.textSecondary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg py-3"
                style={{ backgroundColor: colors.primary }}
                onPress={handleUpdate}
                disabled={isUpdating}>
                <Text className="text-center font-medium text-white">
                  {isUpdating ? 'Updating...' : 'Update Post'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
