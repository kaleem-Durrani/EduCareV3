import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../../contexts';
import { Note } from '../../../../services';

interface NoteDetailModalProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  visible,
  note,
  onClose,
}) => {
  const { colors } = useTheme();

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <View className="flex-1 bg-black/50" onTouchEnd={onClose} />
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
                👁️ Note Details
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-4">
            {note && (
              <>
                <View className="mb-4">
                  <Text
                    className="mb-2 text-sm font-medium"
                    style={{ color: colors.textSecondary }}>
                    Student
                  </Text>
                  <Text className="text-lg" style={{ color: colors.textPrimary }}>
                    {note.student_id.fullName}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    {note.student_id.class_id.name}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text
                    className="mb-2 text-sm font-medium"
                    style={{ color: colors.textSecondary }}>
                    Note Content
                  </Text>
                  <View
                    className="rounded-lg border p-4"
                    style={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    }}>
                    <Text style={{ color: colors.textPrimary, lineHeight: 24 }}>
                      {note.content}
                    </Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text
                    className="mb-2 text-sm font-medium"
                    style={{ color: colors.textSecondary }}>
                    Created
                  </Text>
                  <Text style={{ color: colors.textPrimary }}>
                    {formatDate(note.createdAt)}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    By: {note.createdBy.fullName} ({note.createdBy.role})
                  </Text>
                </View>

                {note.updatedBy &&
                  note.updatedBy._id !== note.createdBy._id && (
                    <View className="mb-4">
                      <Text
                        className="mb-2 text-sm font-medium"
                        style={{ color: colors.textSecondary }}>
                        Last Updated
                      </Text>
                      <Text style={{ color: colors.textPrimary }}>
                        {formatDate(note.updatedAt)}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        By: {note.updatedBy.fullName} ({note.updatedBy.role})
                      </Text>
                    </View>
                  )}
              </>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="border-t p-4" style={{ borderTopColor: colors.border }}>
            <TouchableOpacity
              className="rounded-lg p-4"
              style={{ backgroundColor: colors.primary }}
              onPress={onClose}>
              <Text className="text-center font-medium text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
