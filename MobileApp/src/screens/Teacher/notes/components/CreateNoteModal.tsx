import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../../contexts';
import { ClassStudent } from '../../../../services';

interface CreateNoteModalProps {
  visible: boolean;
  student: ClassStudent | null;
  isCreating: boolean;
  onClose: () => void;
  onCreate: (content: string) => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  visible,
  student,
  isCreating,
  onClose,
  onCreate,
}) => {
  const { colors } = useTheme();
  const [noteContent, setNoteContent] = useState('');

  const handleClose = () => {
    setNoteContent('');
    onClose();
  };

  const handleCreate = () => {
    if (noteContent.trim()) {
      onCreate(noteContent.trim());
      setNoteContent('');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <View className="flex-1 justify-end">
        <View className="flex-1 bg-black/50" onTouchEnd={handleClose} />
        <View
          className="rounded-t-lg"
          style={{
            backgroundColor: colors.background,
            height: '70%',
            minHeight: 400,
          }}>
          {/* Header */}
          <View className="border-b p-4" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                📝 Create Note
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            {student && (
              <Text className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
                For: {student.fullName}
              </Text>
            )}
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-4">
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
              Note Content *
            </Text>
            <TextInput
              className="rounded-lg border p-4"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
                minHeight: 120,
                textAlignVertical: 'top',
              }}
              placeholder="Enter note content..."
              placeholderTextColor={colors.textSecondary}
              value={noteContent}
              onChangeText={setNoteContent}
              multiline
              maxLength={2000}
            />
            <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
              {noteContent.length}/2000 characters
            </Text>
          </ScrollView>

          {/* Footer */}
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
              onPress={handleCreate}
              disabled={isCreating || !noteContent.trim()}>
              <Text className="text-center font-medium text-white">
                {isCreating ? 'Creating...' : 'Create Note'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
