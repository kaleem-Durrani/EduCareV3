import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../../contexts';
import { Note } from '../../../../services';

interface NoteItemProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onView,
  onEdit,
  onDelete,
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <View
      className="mb-4 rounded-lg border p-4"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}>
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          {formatDate(note.createdAt)}
        </Text>
        <View className="flex-row">
          <TouchableOpacity
            className="ml-2 rounded p-1"
            style={{ backgroundColor: colors.primary }}
            onPress={() => onView(note)}>
            <Text className="text-xs text-white">👁️ View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="ml-2 rounded p-1"
            style={{ backgroundColor: colors.secondary }}
            onPress={() => onEdit(note)}>
            <Text className="text-xs text-white">✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="ml-2 rounded p-1"
            style={{ backgroundColor: '#EF4444' }}
            onPress={() => onDelete(note)}>
            <Text className="text-xs text-white">🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mb-2" style={{ color: colors.textPrimary }}>
        {truncateText(note.content)}
      </Text>

      {note.content.length > 100 && (
        <TouchableOpacity onPress={() => onView(note)}>
          <Text className="text-sm" style={{ color: colors.primary }}>
            Read more...
          </Text>
        </TouchableOpacity>
      )}

      <View className="mt-2 border-t pt-2" style={{ borderTopColor: colors.border }}>
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          Created by: {note.createdBy.fullName} ({note.createdBy.role})
        </Text>
        {note.updatedBy && note.updatedBy._id !== note.createdBy._id && (
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Updated by: {note.updatedBy.fullName} ({note.updatedBy.role})
          </Text>
        )}
      </View>
    </View>
  );
};
