import React from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../../../contexts';
import { Note, ClassStudent } from '../../../../services';
import { NoteItem } from './NoteItem';

interface NotesListProps {
  notes: Note[];
  selectedStudent: ClassStudent;
  isLoading: boolean;
  isLoadingMore: boolean;
  totalItems: number;
  onRefresh: () => void;
  onLoadMore: () => void;
  onViewNote: (note: Note) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedStudent,
  isLoading,
  isLoadingMore,
  totalItems,
  onRefresh,
  onLoadMore,
  onViewNote,
  onEditNote,
  onDeleteNote,
}) => {
  const { colors } = useTheme();

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteItem
      note={item}
      onView={onViewNote}
      onEdit={onEditNote}
      onDelete={onDeleteNote}
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.textSecondary }}>Loading notes...</Text>
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg" style={{ color: colors.textSecondary }}>
          📝 No notes yet
        </Text>
        <Text className="mt-2 text-center" style={{ color: colors.textSecondary }}>
          Create the first note for {selectedStudent.fullName}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      renderItem={renderNoteItem}
      keyExtractor={(item) => item._id}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        isLoadingMore ? (
          <View className="py-4">
            <Text className="text-center" style={{ color: colors.textSecondary }}>
              Loading more notes...
            </Text>
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
};
