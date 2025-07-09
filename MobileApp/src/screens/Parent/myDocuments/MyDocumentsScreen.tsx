import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { documentService } from '../../../services';
import { ParentStackParamList } from '../../../types';

interface DocumentStatus {
  document_type_id: {
    _id: string;
    name: string;
    description: string;
    required: boolean;
  };
  submitted: boolean;
  submission_date?: string;
  notes: string;
}

interface Props {
  navigation: any;
  route: {
    params: {
      studentId: string;
    };
  };
}

const MyDocumentsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  const [documents, setDocuments] = useState<DocumentStatus[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    fetchDocuments();
  }, [studentId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getStudentDocuments(studentId);

      if (response.success) {
        setDocuments(response.data?.documents);
        setStudentInfo(response.data?.student_id);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert('Error', 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#10B981'; // Green
      case 'pending':
        return '#F59E0B'; // Yellow
      case 'not_submitted':
        return '#EF4444'; // Red
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'YES';
      case 'pending':
        return 'PENDING';
      case 'not_submitted':
        return 'NO';
      default:
        return 'UNKNOWN';
    }
  };

  const renderDocumentItem = ({ item }: { item: DocumentStatus }) => (
    <View className="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
            {item.document_type_id.name}
          </Text>
          {item.document_type_id.description && (
            <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
              {item.document_type_id.description}
            </Text>
          )}
          {item.document_type_id.required && (
            <Text className="mt-1 text-xs font-medium" style={{ color: '#EF4444' }}>
              Required
            </Text>
          )}
        </View>
        <View className="ml-4">
          {/* <Text className="text-base font-bold" style={{ color: getStatusColor(item.status) }}>
            {getStatusText(item.status)}
          </Text> */}
        </View>
      </View>
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
            My Documents
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
            Loading documents...
          </Text>
        </View>
      ) : documents?.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Documents Found
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            No document requirements have been set up for this student.
          </Text>
        </View>
      ) : (
        <FlatList
          data={documents || []}
          renderItem={renderDocumentItem}
          keyExtractor={(item, index) => item.document_type_id._id || `doc-${index}`}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default MyDocumentsScreen;
