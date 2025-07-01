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

type WeeklyReportScreenNavigationProp = StackNavigationProp<ParentStackParamList, 'WeeklyReport'>;
type WeeklyReportScreenRouteProp = RouteProp<ParentStackParamList, 'WeeklyReport'>;

interface Props {
  navigation: WeeklyReportScreenNavigationProp;
  route: WeeklyReportScreenRouteProp;
}

const WeeklyReportScreen: React.FC<Props> = ({ navigation, route }) => {
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
            Weekly Report
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
            Weekly Report Screen
          </Text>
          
          <Text fontSize="$md" color="$textLight600" $dark-color="$textDark400">
            This screen will display the student's weekly report.
          </Text>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default WeeklyReportScreen;
