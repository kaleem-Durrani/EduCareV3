import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ParentStackParamList } from '../../types';

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
      className="p-4 rounded-lg mb-4 flex-row items-center"
      style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
    >
      {/* Enlarged Photo for Identity Verification */}
      <View 
        className="w-20 h-20 rounded-full mr-4 items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-3xl">👤</Text>
      </View>
      
      {/* Member Info */}
      <View className="flex-1">
        <Text 
          className="text-lg font-bold"
          style={{ color: colors.textPrimary }}
        >
          {member.name}
        </Text>
        <Text 
          className="text-sm mb-2"
          style={{ color: colors.textSecondary }}
        >
          {member.relationship}
        </Text>
        
        {/* Contact Actions */}
        <View className="flex-row space-x-4">
          {/* Phone Icon */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => handlePhoneCall(member.phone)}
          >
            <Text className="text-2xl mr-1">📞</Text>
            <Text 
              className="text-sm"
              style={{ color: colors.primary }}
            >
              Call
            </Text>
          </TouchableOpacity>
          
          {/* WhatsApp Icon */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => handleWhatsApp(member.whatsapp)}
          >
            <Text className="text-2xl mr-1">💬</Text>
            <Text 
              className="text-sm"
              style={{ color: colors.success }}
            >
              WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View className="items-center pt-4 pb-4">
        <Text 
          className="text-xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          Centro Infantil EDUCARE
        </Text>
        <View 
          className="w-full h-px"
          style={{ backgroundColor: '#000000' }}
        />
      </View>

      {/* Back Button */}
      <View className="px-4 py-2">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-2xl mr-2">←</Text>
          <Text 
            className="text-lg font-medium"
            style={{ color: colors.primary }}
          >
            Contacts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Student Photo and Summary */}
        <View 
          className="p-4 rounded-lg mb-6 items-center"
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
        >
          <View 
            className="w-16 h-16 rounded-full mb-4 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-3xl">👶</Text>
          </View>
          <Text 
            className="text-lg font-bold text-center"
            style={{ color: colors.textPrimary }}
          >
            John Alexander Doe
          </Text>
          <Text 
            className="text-sm text-center"
            style={{ color: colors.textSecondary }}
          >
            Red Class
          </Text>
        </View>

        {/* Family Members List */}
        <Text 
          className="text-lg font-bold mb-4"
          style={{ color: colors.textPrimary }}
        >
          Family Members
        </Text>

        {familyMembers.map((member) => (
          <FamilyMemberCard key={member.id} member={member} />
        ))}

        {/* Edit Button (Only visible to administrators) */}
        <View className="mt-6 mb-6">
          <TouchableOpacity
            className="py-3 px-6 rounded-lg opacity-50"
            style={{ backgroundColor: colors.primary }}
            disabled={true}
          >
            <Text 
              className="text-center font-semibold"
              style={{ color: colors.textOnPrimary }}
            >
              Edit Info (Admin Only)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactsScreen;
