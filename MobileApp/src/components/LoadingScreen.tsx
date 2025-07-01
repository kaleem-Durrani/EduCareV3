import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  const { colors } = useTheme();

  return (
    <View 
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: colors.background }}
    >
      <ActivityIndicator 
        size="large" 
        color={colors.primary}
        className="mb-4"
      />
      <Text 
        className="text-base"
        style={{ color: colors.textSecondary }}
      >
        {message}
      </Text>
    </View>
  );
};

export default LoadingScreen;
