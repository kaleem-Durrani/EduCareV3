import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Note } from '../../../../services';

interface EditNoteModalProps {
  visible: boolean;
  note: Note | null;
  isUpdating: boolean;
  onClose: () => void;
  onUpdate: (noteId: string, content: string) => void;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  visible,
  note,
  isUpdating,
  onClose,
  onUpdate,
}) => {
  const { colors } = useTheme();
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (note) {
      setNoteContent(note.content);
    }
  }, [note]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleUpdate = () => {
    if (note && noteContent.trim()) {
      onUpdate(note._id, noteContent.trim());
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
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
                ✏️ Edit Note
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            {note && (
              <Text className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
                Created: {formatDate(note.createdAt)}
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
              onPress={handleUpdate}
              disabled={isUpdating || !noteContent.trim()}>
              <Text className="text-center font-medium text-white">
                {isUpdating ? 'Updating...' : 'Update Note'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
