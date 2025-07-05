import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { launchImageLibrary, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import { useTheme } from '../../../../contexts';
import { CreatePostData, ClassStudent, EnrolledClass } from '../../../../services';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (postData: CreatePostData, mediaFiles?: File[]) => void;
  isCreating: boolean;
  classes: EnrolledClass[];
  students: ClassStudent[];
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onCreate,
  isCreating,
  classes,
  students,
}) => {
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audienceType, setAudienceType] = useState<'all' | 'class' | 'individual'>('all');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      // Reset form when modal opens
      setTitle('');
      setContent('');
      setAudienceType('all');
      setSelectedClassIds([]);
      setSelectedStudentIds([]);
      setMediaFiles([]);
    }
  }, [visible]);

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const postData: CreatePostData = {
      title: title.trim(),
      content: content.trim(),
      audience: {
        type: audienceType,
        class_ids: audienceType === 'class' ? selectedClassIds : undefined,
        student_ids: audienceType === 'individual' ? selectedStudentIds : undefined,
      },
    };

    onCreate(postData, mediaFiles.length > 0 ? mediaFiles : undefined);
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

  const handleMediaSelect = () => {
    Alert.alert('Select Media', 'Choose media type to add', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Photos', onPress: () => selectMedia('photo') },
      { text: 'Videos', onPress: () => selectMedia('video') },
      { text: 'Mixed', onPress: () => selectMedia('mixed') },
    ]);
  };

  const selectMedia = (type: 'photo' | 'video' | 'mixed') => {
    const mediaType: MediaType = type === 'mixed' ? 'mixed' : type;

    const options = {
      mediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as const,
      selectionLimit: type === 'photo' ? 10 : type === 'video' ? 5 : 15, // Total limit for mixed
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets) {
        const newFiles = response.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || `media_${Date.now()}`,
          size: asset.fileSize,
        }));

        setMediaFiles((prev) => [...prev, ...newFiles]);
      }
    });
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const renderMediaItem = ({ item, index }: { item: any; index: number }) => {
    const isVideo = item.type?.startsWith('video/');

    return (
      <View className="relative mb-2 mr-2">
        <View className="relative">
          {isVideo ? (
            <View
              className="h-20 w-20 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.card }}>
              <Text className="text-2xl">🎥</Text>
              <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
                Video
              </Text>
            </View>
          ) : (
            <Image source={{ uri: item.uri }} className="h-20 w-20 rounded-lg" resizeMode="cover" />
          )}

          <TouchableOpacity
            className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: 'red' }}
            onPress={() => removeMediaFile(index)}>
            <Text className="text-xs font-bold text-white">×</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAudienceSelector = () => {
    return (
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
          Audience *
        </Text>

        {/* Audience Type Buttons */}
        <View className="mb-3 flex-row">
          {[
            { key: 'all', label: '👥 All Classes' },
            { key: 'class', label: '🏫 Specific Classes' },
            { key: 'individual', label: '👤 Individual Students' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              className={`mr-2 rounded-lg px-3 py-2 ${
                audienceType === option.key ? 'bg-blue-500' : 'border'
              }`}
              style={{
                borderColor: audienceType === option.key ? 'transparent' : colors.border,
                backgroundColor: audienceType === option.key ? colors.primary : colors.card,
              }}
              onPress={() => setAudienceType(option.key as any)}>
              <Text
                className={`text-sm ${audienceType === option.key ? 'text-white' : ''}`}
                style={{ color: audienceType === option.key ? 'white' : colors.textPrimary }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Class Selection */}
        {audienceType === 'class' && (
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              Select Classes:
            </Text>
            <ScrollView className="max-h-32">
              {classes.map((cls) => (
                <TouchableOpacity
                  key={cls._id}
                  className={`mb-1 rounded-lg border p-2 ${
                    selectedClassIds.includes(cls._id) ? 'bg-blue-100' : ''
                  }`}
                  style={{
                    borderColor: selectedClassIds.includes(cls._id)
                      ? colors.primary
                      : colors.border,
                    backgroundColor: selectedClassIds.includes(cls._id)
                      ? colors.primary + '20'
                      : colors.card,
                  }}
                  onPress={() => handleClassToggle(cls._id)}>
                  <Text style={{ color: colors.textPrimary }}>
                    {selectedClassIds.includes(cls._id) ? '✓ ' : ''}
                    {cls.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Student Selection */}
        {audienceType === 'individual' && (
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              Select Students:
            </Text>
            <ScrollView className="max-h-32">
              {students.map((student) => (
                <TouchableOpacity
                  key={student._id}
                  className={`mb-1 rounded-lg border p-2 ${
                    selectedStudentIds.includes(student._id) ? 'bg-blue-100' : ''
                  }`}
                  style={{
                    borderColor: selectedStudentIds.includes(student._id)
                      ? colors.primary
                      : colors.border,
                    backgroundColor: selectedStudentIds.includes(student._id)
                      ? colors.primary + '20'
                      : colors.card,
                  }}
                  onPress={() => handleStudentToggle(student._id)}>
                  <Text style={{ color: colors.textPrimary }}>
                    {selectedStudentIds.includes(student._id) ? '✓ ' : ''}
                    {student.fullName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{ backgroundColor: colors.card }}>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-lg" style={{ color: colors.primary }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
            Create Post
          </Text>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={isCreating}
            className={`rounded-lg px-4 py-2 ${isCreating ? 'opacity-50' : ''}`}
            style={{ backgroundColor: colors.primary }}>
            <Text className="font-medium text-white">{isCreating ? 'Creating...' : 'Create'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
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
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
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
                minHeight: 120,
                textAlignVertical: 'top',
              }}
              placeholder="Write your post content here..."
              placeholderTextColor={colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={1000}
            />
          </View>

          {/* Audience Selector */}
          {renderAudienceSelector()}

          {/* Media Selection */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              Media (Optional) - {mediaFiles.length} files selected
            </Text>

            {/* Selected Media Preview */}
            {mediaFiles.length > 0 && (
              <View className="mb-3">
                <FlatList
                  data={mediaFiles}
                  renderItem={renderMediaItem}
                  keyExtractor={(item, index) => `${item.uri}_${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                />
              </View>
            )}

            {/* Add Media Button */}
            <TouchableOpacity
              className="rounded-lg border border-dashed p-4"
              style={{ borderColor: colors.border }}
              onPress={handleMediaSelect}>
              <Text className="text-center" style={{ color: colors.textSecondary }}>
                📷{' '}
                {mediaFiles.length > 0
                  ? 'Add more photos or videos'
                  : 'Tap to add photos or videos'}
              </Text>
              <Text className="mt-1 text-center text-xs" style={{ color: colors.textSecondary }}>
                Support for up to 10 images and 5 videos
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
