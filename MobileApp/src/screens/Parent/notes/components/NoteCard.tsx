import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Note } from '../../../../services';

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return '👨‍💼';
      case 'teacher':
        return '👩‍🏫';
      case 'parent':
        return '👨‍👩‍👧‍👦';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return '#8B5CF6'; // Purple
      case 'teacher':
        return '#10B981'; // Green
      case 'parent':
        return '#F59E0B'; // Orange
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View
      className="mb-4 rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
      }}>
      
      {/* Header */}
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-2">
            <Text className="mr-2 text-lg">
              {getRoleIcon(note.createdBy.role)}
            </Text>
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              {note.createdBy.fullName}
            </Text>
            <View
              className="ml-2 rounded-full px-2 py-1"
              style={{ backgroundColor: getRoleColor(note.createdBy.role) + '20' }}>
              <Text
                className="text-xs font-semibold capitalize"
                style={{ color: getRoleColor(note.createdBy.role) }}>
                {note.createdBy.role}
              </Text>
            </View>
          </View>
          
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {formatDate(note.createdAt)}
          </Text>
        </View>
        
        {/* Updated indicator */}
        {note.updatedBy && note.updatedAt !== note.createdAt && (
          <View
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: colors.info + '20' }}>
            <Text className="text-xs font-medium" style={{ color: colors.info }}>
              Edited
            </Text>
          </View>
        )}
      </View>

      {/* Note Content */}
      <View
        className="rounded-lg p-4"
        style={{
          backgroundColor: colors.background,
          borderLeftWidth: 4,
          borderLeftColor: getRoleColor(note.createdBy.role),
        }}>
        <Text
          className="text-base leading-6"
          style={{ color: colors.textPrimary }}>
          {note.content}
        </Text>
      </View>

      {/* Footer with update info */}
      {note.updatedBy && note.updatedAt !== note.createdAt && (
        <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            Last updated by {note.updatedBy.fullName} on {formatDate(note.updatedAt)}
          </Text>
        </View>
      )}
    </View>
  );
};
