import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useTheme } from '../../../../contexts';
import { ClassStudent, StudentDetails, StudentContact } from '../../../../services';
import { ENV } from '../../../../config';

interface StudentContactInfoProps {
  selectedStudent: ClassStudent | null;
  studentDetails: StudentDetails | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const StudentContactInfo: React.FC<StudentContactInfoProps> = ({
  selectedStudent,
  studentDetails,
  isLoading,
  error,
  onRetry,
}) => {
  const { colors } = useTheme();

  const handlePhonePress = (phone: string, contactName: string) => {
    if (!phone) return;
    
    Alert.alert(
      'Contact Options',
      `Contact ${contactName}`,
      [
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phone}`)
        },
        {
          text: 'WhatsApp',
          onPress: () => Linking.openURL(`whatsapp://send?phone=${phone}`)
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderContactCard = (contact: StudentContact, index: number) => (
    <View
      key={index}
      className="mb-3 p-4 rounded-lg border"
      style={{ 
        backgroundColor: colors.background, 
        borderColor: colors.border 
      }}
    >
      <View className="flex-row items-center">
        {/* Contact Photo */}
        <View className="w-12 h-12 rounded-full mr-4 overflow-hidden">
          {contact.photoUrl ? (
            <Image
              source={{ uri: `${ENV.SERVER_URL}/${contact.photoUrl}` }}
              className="w-full h-full"
              resizeMode="cover"
              onError={() => {
                console.log('Failed to load contact image');
              }}
            />
          ) : (
            <View
              className="w-full h-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-lg">👤</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        <View className="flex-1">
          <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
            {contact.name}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {contact.relationship}
          </Text>
          {contact.phone && (
            <TouchableOpacity 
              onPress={() => handlePhonePress(contact.phone!, contact.name)}
              className="mt-1"
            >
              <Text className="text-sm" style={{ color: colors.primary }}>
                📞 {contact.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Contact Action */}
        {contact.phone && (
          <TouchableOpacity
            className="p-2 rounded-full"
            style={{ backgroundColor: colors.primary }}
            onPress={() => handlePhonePress(contact.phone!, contact.name)}
          >
            <Text className="text-white text-sm">💬</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Loading student contacts...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className="rounded-lg p-6"
        style={{ 
          backgroundColor: colors.card, 
          borderColor: colors.border, 
          borderWidth: 1 
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Failed to Load Contacts
          </Text>
          <Text className="text-sm text-center mb-4" style={{ color: colors.textSecondary }}>
            {error}
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={onRetry}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!studentDetails) {
    return (
      <View
        className="rounded-lg p-6"
        style={{ 
          backgroundColor: colors.card, 
          borderColor: colors.border, 
          borderWidth: 1 
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Student Not Found
          </Text>
          <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
            Unable to load student information.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        👤 Student Information
      </Text>

      {/* Student Header */}
      <View
        className="mb-4 rounded-lg p-4"
        style={{ 
          backgroundColor: colors.card, 
          borderColor: colors.border, 
          borderWidth: 1 
        }}
      >
        <View className="flex-row items-center">
          {/* Student Photo */}
          <View className="w-16 h-16 rounded-full mr-4 overflow-hidden">
            {studentDetails.photoUrl ? (
              <Image
                source={{ uri: `${ENV.SERVER_URL}/${studentDetails.photoUrl}` }}
                className="w-full h-full"
                resizeMode="cover"
                onError={() => {
                  console.log('Failed to load student image');
                }}
              />
            ) : (
              <View
                className="w-full h-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white text-2xl">👶</Text>
              </View>
            )}
          </View>

          {/* Student Info */}
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {studentDetails.fullName}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {studentDetails.current_class?.name || 'No class assigned'}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Enrollment #{studentDetails.rollNum}
            </Text>
          </View>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View
        className="rounded-lg p-4"
        style={{ 
          backgroundColor: colors.card, 
          borderColor: colors.border, 
          borderWidth: 1 
        }}
      >
        <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
          📞 Emergency Contacts
        </Text>

        {studentDetails.contacts && studentDetails.contacts.length > 0 ? (
          studentDetails.contacts.map((contact, index) => renderContactCard(contact, index))
        ) : (
          <View className="items-center py-4">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              No emergency contacts available
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default StudentContactInfo;
