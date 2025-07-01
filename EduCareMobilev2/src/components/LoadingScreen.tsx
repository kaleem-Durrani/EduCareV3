import React from 'react';
import { Box, Spinner, Text } from '@gluestack-ui/themed';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <Box 
      flex={1} 
      justifyContent="center" 
      alignItems="center" 
      backgroundColor="$backgroundLight0"
      $dark-backgroundColor="$backgroundDark950"
    >
      <Spinner size="large" color="$primary500" />
      <Text 
        mt="$4" 
        fontSize="$md" 
        color="$textLight600"
        $dark-color="$textDark400"
      >
        {message}
      </Text>
    </Box>
  );
};

export default LoadingScreen;
