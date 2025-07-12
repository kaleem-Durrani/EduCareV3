import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../../../../contexts';
import { StudentContact } from '../../../../services';
import { buildMediaUrl } from '../../../../config';

interface ContactCardProps {
  contacts: StudentContact[];
}

export const ContactCard: React.FC<ContactCardProps> = ({ contacts }) => {
  const { colors } = useTheme();

  const handlePhonePress = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
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

  if (!contacts || contacts.length === 0) {
    return (
      <View
        className="mb-6 rounded-xl p-6"
        style={{
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
        <View className="flex-row items-center mb-4">
          <Text className="text-2xl mr-3">👥</Text>
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            Emergency Contacts
          </Text>
        </View>
        <Text className="text-center" style={{ color: colors.textSecondary }}>
          No emergency contacts available
        </Text>
      </View>
    );
  }

  return (
    <View
      className="mb-6 rounded-xl p-6"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Text className="text-2xl mr-3">👥</Text>
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Emergency Contacts
        </Text>
        <View
          className="ml-auto rounded-full px-3 py-1"
          style={{ backgroundColor: colors.primary + '20' }}>
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            {contacts.length} Contact{contacts.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Contacts List */}
      <View className="space-y-4">
        {contacts.map((contact, index) => (
          <View
            key={index}
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.background,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}>
            <View className="flex-row items-center">
              {/* Contact Photo or Avatar */}
              <View className="mr-4">
                {contact.photoUrl ? (
                  <Image
                    source={{ uri: buildMediaUrl(contact.photoUrl) }}
                    className="h-16 w-16 rounded-full"
                    style={{
                      borderWidth: 2,
                      borderColor: colors.border,
                    }}
                  />
                ) : (
                  <View
                    className="h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.primary + '20' }}>
                    <Text className="text-2xl">
                      {getRelationshipEmoji(contact.relationship)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Contact Info */}
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {contact.name}
                </Text>
                <Text className="text-base" style={{ color: colors.primary }}>
                  {contact.relationship}
                </Text>
                {contact.phone && (
                  <TouchableOpacity
                    className="mt-2 flex-row items-center"
                    onPress={() => handlePhonePress(contact.phone!)}>
                    <Text className="text-2xl mr-2">📞</Text>
                    <Text
                      className="text-base font-semibold underline"
                      style={{ color: colors.info }}>
                      {contact.phone}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
