import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ParentStackParamList } from '../../types';

type BasicInformationScreenNavigationProp = StackNavigationProp<ParentStackParamList, 'BasicInformation'>;
type BasicInformationScreenRouteProp = RouteProp<ParentStackParamList, 'BasicInformation'>;

interface Props {
  navigation: BasicInformationScreenNavigationProp;
  route: BasicInformationScreenRouteProp;
}

const BasicInformationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  // TODO: Fetch actual student data
  const studentData = {
    photo: null,
    fullName: 'John Alexander Doe',
    firstName: 'John',
    class: 'Red Class',
    schedule: 'Morning (8:00 AM - 12:00 PM)',
    age: 4,
    dateOfBirth: '2020-03-15',
    allergies: 'Peanuts, Dairy',
    likes: 'Playing with blocks, Drawing',
    dislikes: 'Loud noises',
    additionalInfo: 'Very social child, loves to help others',
    authorizedPhotos: true,
  };

  const InfoRow = ({ label, value }: { label: string; value: string | boolean }) => (
    <View className="mb-4">
      <Text 
        className="text-sm font-medium mb-1"
        style={{ color: '#4169e1' }} // Specific color from guidelines
      >
        {label}
      </Text>
      <Text 
        className="text-base"
        style={{ color: '#4169e1' }} // Specific color from guidelines
      >
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
      </Text>
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
            Basic Information
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
            className="w-24 h-24 rounded-full mb-4 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-4xl">👶</Text>
          </View>
          <Text 
            className="text-xl font-bold text-center"
            style={{ color: colors.textPrimary }}
          >
            {studentData.fullName}
          </Text>
          <Text 
            className="text-sm text-center"
            style={{ color: colors.textSecondary }}
          >
            {studentData.class}
          </Text>
        </View>

        {/* Information Fields */}
        <View 
          className="p-4 rounded-lg"
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
        >
          <InfoRow label="Full name" value={studentData.fullName} />
          <InfoRow label="Class" value={studentData.class} />
          <InfoRow label="Schedule" value={studentData.schedule} />
          <InfoRow label="First name" value={studentData.firstName} />
          <InfoRow 
            label="Age" 
            value={`${studentData.age} years (Born: ${studentData.dateOfBirth})`} 
          />
          <InfoRow label="Allergies" value={studentData.allergies} />
          <InfoRow label="Likes/Dislikes" value={`Likes: ${studentData.likes} | Dislikes: ${studentData.dislikes}`} />
          <InfoRow label="Additional information" value={studentData.additionalInfo} />
          <InfoRow label="Authorized photos/videos" value={studentData.authorizedPhotos} />
        </View>

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

export default BasicInformationScreen;
