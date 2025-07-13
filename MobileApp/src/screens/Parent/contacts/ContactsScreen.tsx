import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { useParentChildren } from '../../../contexts/ParentChildrenContext';
import { useApi } from '../../../hooks';
import { studentService, StudentDetails, ParentStudent, StudentContact } from '../../../services';
import { ChildSelector, ScreenHeader } from '../../../components';
import { buildMediaUrl } from '../../../config';
import Toast from 'react-native-toast-message';

const ContactsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const {
    children,
    isLoading: isLoadingChildren,
    error: childrenError,
    refreshChildren,
  } = useParentChildren();

  // API hook for fetching student details
  const {
    request: fetchStudentDetails,
    isLoading: isLoadingStudent,
    error: studentError,
    data: studentDetails,
  } = useApi<StudentDetails>(studentService.getStudentBasicInfoForParent);

  const handleChildSelect = async (child: ParentStudent) => {
    setSelectedChild(child);
    setHasSearched(true);
    const response = await studentService.getStudentBasicInfoForParent(child._id);

    if (response.success) {
      await fetchStudentDetails(child._id);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message || 'Failed to load student details',
        visibilityTime: 3000,
      });
    }
  };

  const handleResetSelection = () => {
    setSelectedChild(null);
    setHasSearched(false);
  };

  const handleRefresh = async () => {
    await refreshChildren();
    if (selectedChild) {
      await fetchStudentDetails(selectedChild._id);
    }
  };

  const handlePhonePress = (phone: string, contactName: string) => {
    if (!phone) return;

    Alert.alert('Contact Options', `Contact ${contactName}`, [
      {
        text: 'Call',
        onPress: () => Linking.openURL(`tel:${phone}`),
      },
      {
        text: 'WhatsApp',
        onPress: () => Linking.openURL(`whatsapp://send?phone=${phone}`),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const getRelationshipEmoji = (relationship: string) => {
    const rel = relationship.toLowerCase();
    if (rel.includes('mom') || rel.includes('mother')) return '👩';
    if (rel.includes('dad') || rel.includes('father')) return '👨';
    if (rel.includes('grandma') || rel.includes('grandmother')) return '👵';
    if (rel.includes('grandpa') || rel.includes('grandfather')) return '👴';
    if (rel.includes('aunt')) return '👩‍🦱';
    if (rel.includes('uncle')) return '👨‍🦱';
    if (rel.includes('sister')) return '👧';
    if (rel.includes('brother')) return '👦';
    return '👤';
  };

  const renderContactCard = (contact: StudentContact, index: number) => (
    <View
      key={index}
      className="mb-4 rounded-xl p-5"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
      }}>
      <View className="flex-row items-center">
        {/* Contact Photo or Avatar */}
        <View className="mr-4">
          {contact.photoUrl ? (
            <Image
              source={{ uri: buildMediaUrl(contact.photoUrl) }}
              className="h-16 w-16 rounded-full"
              style={{
                borderWidth: 3,
                borderColor: colors.primary + '30',
              }}
            />
          ) : (
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.primary + '20' }}>
              <Text className="text-2xl">{getRelationshipEmoji(contact.relationship)}</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        <View className="flex-1">
          <Text className="mb-1 text-xl font-bold" style={{ color: colors.textPrimary }}>
            {contact.name}
          </Text>
          <View
            className="mb-2 self-start rounded-full px-3 py-1"
            style={{ backgroundColor: colors.info + '20' }}>
            <Text className="text-sm font-semibold" style={{ color: colors.info }}>
              {contact.relationship}
            </Text>
          </View>
          {contact.phone && (
            <TouchableOpacity
              className="mt-2 flex-row items-center"
              onPress={() => handlePhonePress(contact.phone!, contact.name)}>
              <View
                className="mr-2 h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.success + '20' }}>
                <Text className="text-sm">📞</Text>
              </View>
              <Text className="text-base font-semibold" style={{ color: colors.success }}>
                {contact.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const isLoading = isLoadingChildren || isLoadingStudent;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Emergency Contacts" navigation={navigation} showBackButton={true} />

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
            onResetSelection={handleResetSelection}
            placeholder="Select a child to view their emergency contacts"
            disabled={isLoadingChildren}
          />
        </View>

        {/* Loading State */}
        {isLoadingStudent && selectedChild && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="text-lg" style={{ color: colors.textSecondary }}>
              Loading {selectedChild.fullName}'s contacts...
            </Text>
          </View>
        )}

        {/* Error State */}
        {(childrenError || studentError) && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="mb-4 text-6xl">⚠️</Text>
            <Text className="mb-2 text-xl font-bold" style={{ color: colors.error }}>
              Error Loading Contacts
            </Text>
            <Text
              className="px-8 text-center text-base leading-6"
              style={{ color: colors.textSecondary }}>
              {childrenError || studentError || 'Something went wrong'}
            </Text>
          </View>
        )}

        {/* Contacts List */}
        {studentDetails && selectedChild && !isLoadingStudent && (
          <View className="mt-4 pb-8">
            {/* Header */}
            <View className="mb-6 flex-row items-center">
              <View
                className="mr-3 h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary + '20' }}>
                <Text className="text-2xl">👥</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                  Emergency Contacts
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  {selectedChild.fullName}'s emergency contacts
                </Text>
              </View>
              <View
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: colors.primary + '20' }}>
                <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                  {studentDetails.contacts?.length || 0} Contact
                  {(studentDetails.contacts?.length || 0) !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {/* Contacts */}
            {studentDetails.contacts && studentDetails.contacts.length > 0 ? (
              studentDetails.contacts.map((contact, index) => renderContactCard(contact, index))
            ) : (
              <View className="items-center py-12">
                <Text className="mb-4 text-6xl">📞</Text>
                <Text className="mb-2 text-xl font-bold" style={{ color: colors.textPrimary }}>
                  No Emergency Contacts
                </Text>
                <Text
                  className="px-8 text-center text-base leading-6"
                  style={{ color: colors.textSecondary }}>
                  No emergency contacts have been added for {selectedChild.fullName}. Please contact
                  the school administration to add emergency contacts.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Empty State */}
        {!selectedChild && !isLoading && hasSearched && (
          <View className="mt-8 items-center justify-center py-12">
            <Text className="mb-4 text-6xl">👶</Text>
            <Text className="mb-2 text-xl font-semibold" style={{ color: colors.textPrimary }}>
              Select a Child
            </Text>
            <Text className="text-center" style={{ color: colors.textSecondary }}>
              Choose one of your children to view their emergency contacts
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
    </SafeAreaView>
  );
};

export default ContactsScreen;
