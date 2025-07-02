import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ParentStackParamList } from '../../../types';

type ContactsScreenNavigationProp = StackNavigationProp<ParentStackParamList, 'Contacts'>;
type ContactsScreenRouteProp = RouteProp<ParentStackParamList, 'Contacts'>;

interface Props {
  navigation: ContactsScreenNavigationProp;
  route: ContactsScreenRouteProp;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  whatsapp: string;
  photo?: string;
}

const ContactsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  // TODO: Fetch actual family data
  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Maria Doe',
      relationship: 'Mom',
      phone: '+59163090969',
      whatsapp: '+59163090969',
    },
    {
      id: '2',
      name: 'Carlos Doe',
      relationship: 'Dad',
      phone: '+59163090970',
      whatsapp: '+59163090970',
    },
    {
      id: '3',
      name: 'Ana Rodriguez',
      relationship: 'Aunt',
      phone: '+59163090971',
      whatsapp: '+59163090971',
    },
  ];

  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (whatsappNumber: string) => {
    Linking.openURL(`whatsapp://send?phone=${whatsappNumber}`);
  };

  const FamilyMemberCard = ({ member }: { member: FamilyMember }) => (
    <View
      className="mb-4 flex-row items-center rounded-lg p-4"
      style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
      {/* Enlarged Photo for Identity Verification */}
      <View
        className="mr-4 h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}>
        <Text className="text-3xl">👤</Text>
      </View>

      {/* Member Info */}
      <View className="flex-1">
        <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
          {member.name}
        </Text>
        <Text className="mb-2 text-sm" style={{ color: colors.textSecondary }}>
          {member.relationship}
        </Text>

        {/* Contact Actions */}
        <View className="flex-row space-x-4">
          {/* Phone Icon */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => handlePhoneCall(member.phone)}>
            <Text className="mr-1 text-2xl">📞</Text>
            <Text className="text-sm" style={{ color: colors.primary }}>
              Call
            </Text>
          </TouchableOpacity>

          {/* WhatsApp Icon */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => handleWhatsApp(member.whatsapp)}>
            <Text className="mr-1 text-2xl">💬</Text>
            <Text className="text-sm" style={{ color: colors.success }}>
              WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      {/* Back Button */}
      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Contacts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Student Photo and Summary */}
        <View
          className="mb-6 items-center rounded-lg p-4"
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
          <View
            className="mb-4 h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primary }}>
            <Text className="text-3xl">👶</Text>
          </View>
          <Text className="text-center text-lg font-bold" style={{ color: colors.textPrimary }}>
            John Alexander Doe
          </Text>
          <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
            Red Class
          </Text>
        </View>

        {/* Family Members List */}
        <Text className="mb-4 text-lg font-bold" style={{ color: colors.textPrimary }}>
          Family Members
        </Text>

        {familyMembers.map((member) => (
          <FamilyMemberCard key={member.id} member={member} />
        ))}

        {/* Edit Button (Only visible to administrators) */}
        <View className="mb-6 mt-6">
          <TouchableOpacity
            className="rounded-lg px-6 py-3 opacity-50"
            style={{ backgroundColor: colors.primary }}
            disabled={true}>
            <Text className="text-center font-semibold" style={{ color: colors.textOnPrimary }}>
              Edit Info (Admin Only)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactsScreen;
