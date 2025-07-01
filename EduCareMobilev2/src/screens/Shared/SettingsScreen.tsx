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
import { useAuth } from '../../contexts';

const SettingsScreen: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box 
        flex={1} 
        backgroundColor="$backgroundLight0"
        $dark-backgroundColor="$backgroundDark950"
      >
        {/* Header */}
        <HStack 
          justifyContent="center" 
          alignItems="center" 
          p="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderLight300"
          $dark-borderBottomColor="$borderDark700"
        >
          <Text fontSize="$xl" fontWeight="$bold" color="$textLight900" $dark-color="$textDark100">
            Settings
          </Text>
        </HStack>

        {/* Content */}
        <VStack flex={1} p="$4" space="md">
          <Text fontSize="$lg" color="$textLight900" $dark-color="$textDark100">
            Settings Screen
          </Text>
          
          <Text fontSize="$md" color="$textLight600" $dark-color="$textDark400">
            User: {user?.name} ({user?.role})
          </Text>
          
          <Text fontSize="$md" color="$textLight600" $dark-color="$textDark400">
            This screen will contain app settings and user preferences.
          </Text>

          <Button 
            variant="solid" 
            action="negative" 
            onPress={logout}
            mt="$4"
          >
            <ButtonText>Logout</ButtonText>
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default SettingsScreen;
