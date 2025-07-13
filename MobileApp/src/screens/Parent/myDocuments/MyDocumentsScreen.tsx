import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import {
  documentService,
  StudentDocuments,
  StudentDocumentItem,
  ParentStudent,
} from '../../../services';
import { ChildSelector, ScreenHeader } from '../../../components';
import { DocumentCard, DocumentDetailModal } from './components';
import Toast from 'react-native-toast-message';

const MyDocumentsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<StudentDocumentItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Use parent children context
  const { children, isLoading: isLoadingChildren, refreshChildren } = useParentChildren();

  // API hook for fetching student documents
  const {
    request: fetchStudentDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
    data: documentsData,
  } = useApi<StudentDocuments>(documentService.getStudentDocuments);

  const handleChildSelect = async (child: ParentStudent) => {
    setSelectedChild(child);
    setHasSearched(true);

    const response = await documentService.getStudentDocuments(child._id);

    if (response.success) {
      await fetchStudentDocuments(child._id);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load documents',
        visibilityTime: 3000,
      });
    }
  };

  const handleChildReset = () => {
    setSelectedChild(null);
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await fetchStudentDocuments(selectedChild._id);
    }
  };

  const handleDocumentPress = (document: StudentDocumentItem) => {
    setSelectedDocument(document);
    setIsDetailModalVisible(true);
  };

  const getDocumentStats = () => {
    if (!documentsData?.documents) return { total: 0, submitted: 0, required: 0, pending: 0 };

    const total = documentsData.documents.length;
    const submitted = documentsData.documents.filter((doc) => doc.submitted).length;
    const required = documentsData.documents.filter((doc) => doc.document_type_id.required).length;
    const pending = documentsData.documents.filter(
      (doc) => doc.document_type_id.required && !doc.submitted
    ).length;

    return { total, submitted, required, pending };
  };

  const stats = getDocumentStats();
  const isLoading = isLoadingChildren || isLoadingDocuments;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="My Documents" navigation={navigation} showBackButton={true} />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        {/* Child Selector */}
        <View className="mt-4">
          <ChildSelector
            selectedChild={selectedChild}
            onChildSelect={handleChildSelect}
            onResetSelection={handleChildReset}
            placeholder="Select a child to view their documents"
            disabled={isLoadingChildren}
          />
        </View>

        {selectedChild && (
          <>
            {/* Loading State */}
            {isLoadingDocuments && (
              <View className="mt-8 items-center justify-center py-12">
                <Text className="text-lg" style={{ color: colors.textSecondary }}>
                  Loading {selectedChild.fullName}'s documents...
                </Text>
              </View>
            )}

            {/* Error State */}
            {documentsError && (
              <View className="mt-8 items-center justify-center py-12">
                <Text className="mb-4 text-6xl">⚠️</Text>
                <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
                  Error Loading Documents
                </Text>
                <Text
                  className="px-8 text-center text-base leading-6"
                  style={{ color: colors.textSecondary }}>
                  {documentsError || 'Something went wrong'}
                </Text>
                <TouchableOpacity
                  className="mt-4 rounded-lg px-6 py-3"
                  style={{ backgroundColor: colors.primary }}
                  onPress={() => fetchStudentDocuments(selectedChild._id)}>
                  <Text className="font-semibold text-white">Try Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Documents Content */}
            {documentsData && !isLoadingDocuments && (
              <View className="mt-4 pb-8">
                {/* Statistics Header */}
                <View
                  className="mb-6 rounded-xl p-5"
                  style={{
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.12,
                    shadowRadius: 10,
                    elevation: 5,
                  }}>
                  <View className="mb-4 flex-row items-center">
                    <View
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}>
                      <Text className="text-2xl">📄</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                        Document Status
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {selectedChild.fullName}'s document submission status
                      </Text>
                    </View>
                  </View>

                  {/* Stats Grid */}
                  <View className="flex-row flex-wrap">
                    <View className="mb-3 w-1/2 pr-2">
                      <View
                        className="rounded-lg p-3"
                        style={{ backgroundColor: colors.primary + '10' }}>
                        <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                          {stats.submitted}
                        </Text>
                        <Text className="text-sm" style={{ color: colors.primary }}>
                          Submitted
                        </Text>
                      </View>
                    </View>

                    <View className="mb-3 w-1/2 pl-2">
                      <View
                        className="rounded-lg p-3"
                        style={{ backgroundColor: '#10B981' + '10' }}>
                        <Text className="text-2xl font-bold" style={{ color: '#10B981' }}>
                          {stats.total}
                        </Text>
                        <Text className="text-sm" style={{ color: '#10B981' }}>
                          Total Documents
                        </Text>
                      </View>
                    </View>

                    <View className="mb-3 w-1/2 pr-2">
                      <View
                        className="rounded-lg p-3"
                        style={{ backgroundColor: '#F59E0B' + '10' }}>
                        <Text className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                          {stats.required}
                        </Text>
                        <Text className="text-sm" style={{ color: '#F59E0B' }}>
                          Required
                        </Text>
                      </View>
                    </View>

                    <View className="mb-3 w-1/2 pl-2">
                      <View
                        className="rounded-lg p-3"
                        style={{ backgroundColor: '#EF4444' + '10' }}>
                        <Text className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                          {stats.pending}
                        </Text>
                        <Text className="text-sm" style={{ color: '#EF4444' }}>
                          Pending
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="mt-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        Completion Progress
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0}%
                      </Text>
                    </View>
                    <View className="h-2 rounded-full" style={{ backgroundColor: colors.border }}>
                      <View
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: colors.primary,
                          width: `${stats.total > 0 ? (stats.submitted / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* Documents List */}
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                    All Documents
                  </Text>
                  <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: colors.primary + '20' }}>
                    <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                      {stats.total} Document{stats.total !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                {documentsData.documents && documentsData.documents.length > 0 ? (
                  documentsData.documents.map((document, index) => (
                    <DocumentCard
                      key={index}
                      document={document}
                      onPress={() => handleDocumentPress(document)}
                    />
                  ))
                ) : (
                  <View className="items-center py-12">
                    <Text className="mb-4 text-6xl">📄</Text>
                    <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                      No Documents Found
                    </Text>
                    <Text
                      className="px-8 text-center text-base leading-6"
                      style={{ color: colors.textSecondary }}>
                      No documents have been configured for {selectedChild.fullName}. Please contact
                      the school administration.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {/* Empty State */}
        {!selectedChild && !isLoading && hasSearched && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="mb-4 text-6xl">👶</Text>
            <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
              Select a Child
            </Text>
            <Text className="text-center" style={{ color: colors.textSecondary }}>
              Choose one of your children to view their document status
            </Text>
          </View>
        )}

        {/* No Children State */}
        {children.length === 0 && !isLoadingChildren && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="mb-4 text-6xl">👨‍👩‍👧‍👦</Text>
            <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
              No Children Found
            </Text>
            <Text className="text-center" style={{ color: colors.textSecondary }}>
              No children are associated with your account. Please contact the school
              administration.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Document Detail Modal */}
      <DocumentDetailModal
        visible={isDetailModalVisible}
        document={selectedDocument}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedDocument(null);
        }}
      />
    </SafeAreaView>
  );
};

export default MyDocumentsScreen;
