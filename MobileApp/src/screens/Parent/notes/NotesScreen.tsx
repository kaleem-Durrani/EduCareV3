import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { noteService, Note } from '../../../services';

interface Props {
  navigation: any;
  route: {
    params: {
      studentId: string;
    };
  };
}

const NotesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    fetchNotes();
  }, [studentId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await noteService.getStudentNotesForParent(studentId, {
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.success) {
        setNotes(response.data.notes || []);
        setStudentInfo(response.data.student);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      Alert.alert('Error', 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  };

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

  const renderNoteItem = ({ item }: { item: Note }) => (
    <View className="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
            {item.createdBy?.fullName || 'Teacher'}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        <View className="rounded-full bg-blue-100 px-2 py-1">
          <Text className="text-xs font-medium text-blue-800">
            {item.createdBy?.role || 'Teacher'}
          </Text>
        </View>
      </View>

      <Text className="text-base leading-6" style={{ color: colors.textPrimary }}>
        {item.content}
      </Text>

      {item.updatedAt !== item.createdAt && (
        <Text className="mt-2 text-xs italic" style={{ color: colors.textSecondary }}>
          Updated: {formatDate(item.updatedAt)}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Notes
          </Text>
        </TouchableOpacity>
      </View>

      {studentInfo && (
        <View className="px-4 py-2">
          <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
            {studentInfo.fullName} - Roll #{studentInfo.rollNum}
          </Text>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
            Loading notes...
          </Text>
        </View>
      ) : notes.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Notes Found
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            No notes have been written about this student yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NotesScreen;
