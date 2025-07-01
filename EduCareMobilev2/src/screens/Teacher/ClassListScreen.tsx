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
import { TeacherStackParamList } from '../../types';

type ClassListScreenNavigationProp = StackNavigationProp<TeacherStackParamList, 'ClassList'>;

interface Props {
  navigation: ClassListScreenNavigationProp;
}

const ClassListScreen: React.FC<Props> = ({ navigation }) => {
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
            Class List
          </Text>
          <Button size="sm" variant="outline" action="secondary" onPress={() => navigation.goBack()}>
            <ButtonText>Back</ButtonText>
          </Button>
        </HStack>

        {/* Content */}
        <VStack flex={1} p="$4" space="md">
          <Text fontSize="$lg" color="$textLight900" $dark-color="$textDark100">
            Class List Screen
          </Text>
          
          <Text fontSize="$md" color="$textLight600" $dark-color="$textDark400">
            This screen will display the list of classes assigned to the teacher.
          </Text>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default ClassListScreen;
