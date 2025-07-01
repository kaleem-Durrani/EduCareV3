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
import { TeacherStackParamList } from '../../types';

type StudentProfileScreenNavigationProp = StackNavigationProp<TeacherStackParamList, 'StudentProfile'>;
type StudentProfileScreenRouteProp = RouteProp<TeacherStackParamList, 'StudentProfile'>;

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
            Student Profile (Teacher View)
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
            Student Profile Screen (Teacher View)
          </Text>
          
          <Text fontSize="$md" color="$textLight600" $dark-color="$textDark400">
            This screen will display student information from the teacher's perspective.
          </Text>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default StudentProfileScreen;
