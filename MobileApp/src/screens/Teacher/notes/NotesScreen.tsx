import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useTeacherClasses } from '../../../contexts/TeacherClassesContext';
import { useApi } from '../../../hooks';
import {
  noteService,
  Note,
  StudentNotesResponse,
  CreateNoteData,
  UpdateNoteData,
  ClassStudent,
} from '../../../services';
import {
  NotesList,
  CreateNoteModal,
  EditNoteModal,
  NoteDetailModal,
  StudentSelector,
} from './components';

const NotesScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { allStudents, classes, studentsByClass } = useTeacherClasses();

  // State management
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [showNoteDetailModal, setShowNoteDetailModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // API hooks - only for GET requests
  const {
    request: fetchStudentNotes,
    isLoading: isLoadingNotes,
    data: notesData,
  } = useApi<StudentNotesResponse>(noteService.getStudentNotes);

  // Loading states for other operations
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);

  // Load notes when student is selected
  useEffect(() => {
    if (selectedStudent) {
      loadStudentNotes(1);
    }
  }, [selectedStudent]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStudentNotes = async (page: number = 1, limit: number = pageSize) => {
    if (!selectedStudent) return;

    await fetchStudentNotes(selectedStudent._id, { page, limit });
  };

  // Update notes when data changes from useApi hook
  useEffect(() => {
    if (notesData) {
      setNotes(notesData.notes);
      setPagination(notesData.pagination);
    }
  }, [notesData]);

  const handleStudentSelect = (student: ClassStudent) => {
    setSelectedStudent(student);
    setNotes([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });
  };

  const handleResetSelection = () => {
    setSelectedStudent(null);
    setNotes([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });
  };

  const handleCreateNote = async (content: string) => {
    if (!selectedStudent) return;

    setIsCreatingNote(true);
    const noteData: CreateNoteData = {
      student_id: selectedStudent._id,
      content,
    };

    const result = await noteService.createNote(noteData);
    if (result.success && result.data?.note) {
      setNotes((prev) => [result.data!.note, ...prev]);
      setShowCreateNoteModal(false);
      Alert.alert('Success', 'Note created successfully');
    } else {
      Alert.alert('Error', result.message || 'Failed to create note');
    }
    setIsCreatingNote(false);
  };

  const handleUpdateNote = async (noteId: string, content: string) => {
    setIsUpdatingNote(true);
    const updateData: UpdateNoteData = {
      content,
    };

    const result = await noteService.updateNote(noteId, updateData);
    if (result.success && result.data?.note) {
      setNotes((prev) => prev.map((note) => (note._id === noteId ? result.data!.note : note)));
      setSelectedNote(null);
      setShowEditNoteModal(false);
      Alert.alert('Success', 'Note updated successfully');
    } else {
      Alert.alert('Error', result.message || 'Failed to update note');
    }
    setIsUpdatingNote(false);
  };

  const handleDeleteNote = (note: Note) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await noteService.deleteNote(note._id);
          if (result.success) {
            setNotes((prev) => prev.filter((n) => n._id !== note._id));
            Alert.alert('Success', 'Note deleted successfully');
          } else {
            Alert.alert('Error', result.message || 'Failed to delete note');
          }
        },
      },
    ]);
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setShowEditNoteModal(true);
  };

  const openDetailModal = (note: Note) => {
    setSelectedNote(note);
    setShowNoteDetailModal(true);
  };

  const handlePageChange = async (page: number) => {
    if (selectedStudent) {
      await loadStudentNotes(page, pageSize);
    }
  };

  const handlePageSizeChange = async (size: number) => {
    setPageSize(size);
    if (selectedStudent) {
      await loadStudentNotes(1, size);
    }
  };

  const refreshNotes = async () => {
    if (selectedStudent) {
      await loadStudentNotes(pagination.currentPage, pageSize);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      {/* Navigation */}
      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Notes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Student Selection */}
      <View className="px-4 py-2">
        <StudentSelector
          classes={classes}
          allStudents={allStudents}
          studentsByClass={studentsByClass}
          onStudentSelect={handleStudentSelect}
          onResetSelection={handleResetSelection}
        />
      </View>

      {/* Notes List */}
      {selectedStudent && (
        <View className="flex-1 px-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
              Notes ({pagination.totalItems})
            </Text>
            <TouchableOpacity
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: colors.primary }}
              onPress={() => setShowCreateNoteModal(true)}>
              <Text className="font-medium text-white">+ Add Note</Text>
            </TouchableOpacity>
          </View>

          <NotesList
            notes={notes}
            selectedStudent={selectedStudent}
            isLoading={isLoadingNotes}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pageSize}
            onRefresh={refreshNotes}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onViewNote={openDetailModal}
            onEditNote={openEditModal}
            onDeleteNote={handleDeleteNote}
          />
        </View>
      )}

      {/* Create Note Modal */}
      <CreateNoteModal
        visible={showCreateNoteModal}
        student={selectedStudent}
        isCreating={isCreatingNote}
        onClose={() => setShowCreateNoteModal(false)}
        onCreate={handleCreateNote}
      />

      {/* Edit Note Modal */}
      <EditNoteModal
        visible={showEditNoteModal}
        note={selectedNote}
        isUpdating={isUpdatingNote}
        onClose={() => setShowEditNoteModal(false)}
        onUpdate={handleUpdateNote}
      />

      {/* Note Detail Modal */}
      <NoteDetailModal
        visible={showNoteDetailModal}
        note={selectedNote}
        onClose={() => setShowNoteDetailModal(false)}
      />
    </SafeAreaView>
  );
};

export default NotesScreen;
