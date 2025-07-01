import React from 'react';
import { 
  Box, 
  VStack, 
  HStack,
  Text, 
  Button, 
  ButtonText
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ParentStackParamList } from '../../types';

type StudentProfileScreenNavigationProp = StackNavigationProp<ParentStackParamList, 'StudentProfile'>;
type StudentProfileScreenRouteProp = RouteProp<ParentStackParamList, 'StudentProfile'>;

interface Props {
  navigation: StudentProfileScreenNavigationProp;
  route: StudentProfileScreenRouteProp;
}

const StudentProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { studentId } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box 
        flex={1} 
        backgroundColor="$backgroundLight0"
        $dark-backgroundColor="$backgroundDark950"
      >
        {/* Header */}
        <HStack 
          justifyContent="space-between" 
          alignItems="center" 
          p="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderLight300"
          $dark-borderBottomColor="$borderDark700"
        >
          <Text fontSize="$xl" fontWeight="$bold" color="$textLight900" $dark-color="$textDark100">
            Student Profile
          </Text>
          <Button size="sm" variant="outline" action="secondary" onPress={() => navigation.goBack()}>
            <ButtonText>Back</ButtonText>
          </Button>
        </HStack>

        {/* Content */}
        <VStack flex={1} p="$4" space="md">
          <Text fontSize="$md" color="$textLight600" $dark-color="$textDark400">
            Student ID: {studentId}
          </Text>
          
          <Text fontSize="$lg" color="$textLight900" $dark-color="$textDark100">
            This is a placeholder for the Student Profile screen.
          </Text>
          
          <Text fontSize="$md" color="$textLight600" $dark-color="$textDark400">
            Here you would display detailed information about the student including:
          </Text>
          
          <VStack space="sm" ml="$4">
            <Text>• Student photo and basic info</Text>
            <Text>• Academic performance</Text>
            <Text>• Attendance records</Text>
            <Text>• Recent activities</Text>
            <Text>• Contact information</Text>
          </VStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default StudentProfileScreen;
