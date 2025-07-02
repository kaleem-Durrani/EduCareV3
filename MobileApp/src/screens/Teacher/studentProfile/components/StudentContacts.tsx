import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentDetails, StudentContact } from '../../../../services';
import { ENV } from '../../../../config';

interface StudentContactsProps {
  student: StudentDetails;
}

const StudentContacts: React.FC<StudentContactsProps> = ({ student }) => {
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

  return (
    <View
      className="mb-6 rounded-lg p-4"
      style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border, 
        borderWidth: 1 
      }}
    >
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        📞 Emergency Contacts
      </Text>

      {student.contacts && student.contacts.length > 0 ? (
        student.contacts.map((contact, index) => renderContactCard(contact, index))
      ) : (
        <View className="items-center py-4">
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            No emergency contacts available
          </Text>
        </View>
      )}
    </View>
  );
};

export default StudentContacts;
