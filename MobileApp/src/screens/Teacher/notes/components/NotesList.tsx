import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../../../../contexts';
import { Note, ClassStudent } from '../../../../services';
import { NoteItem } from './NoteItem';
import { PaginationControls } from '../../../../components';

interface NotesListProps {
  notes: Note[];
  selectedStudent: ClassStudent;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewNote: (note: Note) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedStudent,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onRefresh,
  onPageChange,
  onPageSizeChange,
  onViewNote,
  onEditNote,
  onDeleteNote,
}) => {
  const { colors } = useTheme();

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteItem note={item} onView={onViewNote} onEdit={onEditNote} onDelete={onDeleteNote} />
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
    <View className="flex-1">
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
        itemName="notes"
      />
    </View>
  );
};
