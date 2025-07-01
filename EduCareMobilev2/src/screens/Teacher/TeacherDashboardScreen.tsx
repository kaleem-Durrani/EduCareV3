import React from 'react';
import { 
  Box, 
  VStack, 
  HStack,
  Text, 
  Button, 
  ButtonText,
  ScrollView
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { TeacherStackParamList } from '../../types';

type TeacherDashboardScreenNavigationProp = StackNavigationProp<TeacherStackParamList, 'TeacherDashboard'>;

interface Props {
  navigation: TeacherDashboardScreenNavigationProp;
}

const TeacherDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Class List', screen: 'ClassList' as const },
    { title: 'Student Profile', screen: 'StudentProfile' as const, studentId: 'demo-student-id' },
  ];

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
          <VStack>
            <Text fontSize="$xl" fontWeight="$bold" color="$textLight900" $dark-color="$textDark100">
              Welcome, {user?.name}
            </Text>
            <Text fontSize="$sm" color="$textLight600" $dark-color="$textDark400">
              Teacher Dashboard
            </Text>
          </VStack>
          <Button size="sm" variant="outline" action="secondary" onPress={logout}>
            <ButtonText>Logout</ButtonText>
          </Button>
        </HStack>

        {/* Content */}
        <ScrollView flex={1} p="$4">
          <VStack space="md">
            <Text fontSize="$lg" fontWeight="$semibold" mb="$2">
              Quick Actions
            </Text>
            
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                action="primary"
                size="lg"
                onPress={() => {
                  if (item.screen === 'StudentProfile') {
                    navigation.navigate(item.screen, { studentId: item.studentId! });
                  } else {
                    navigation.navigate(item.screen);
                  }
                }}
                mb="$2"
              >
                <ButtonText>{item.title}</ButtonText>
              </Button>
            ))}
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

export default TeacherDashboardScreen;
