import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual forgot password logic
      console.log('Forgot password for:', email);
      setMessage('Password reset instructions have been sent to your email.');
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header with Logo */}
      <View className="items-center pt-8 pb-4">
        <Text 
          className="text-2xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          Centro Infantil EDUCARE
        </Text>
        {/* Black line under logo */}
        <View 
          className="w-full h-px"
          style={{ backgroundColor: '#000000' }}
        />
      </View>

      <View className="flex-1 px-6 justify-center">
        {/* Title */}
        <Text 
          className="text-2xl font-bold text-center mb-4"
          style={{ color: colors.textPrimary }}
        >
          Forgot Password
        </Text>

        <Text 
          className="text-center mb-8"
          style={{ color: colors.textSecondary }}
        >
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        {/* Success Message */}
        {message ? (
          <View 
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: colors.success + '20' }}
          >
            <Text 
              className="text-center"
              style={{ color: colors.success }}
            >
              {message}
            </Text>
          </View>
        ) : null}

        {/* Email Input */}
        <View className="mb-6">
          <Text 
            className="text-sm font-medium mb-2"
            style={{ color: colors.textPrimary }}
          >
            Email
          </Text>
          <TextInput
            className="w-full p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary
            }}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Send Instructions Button */}
        <TouchableOpacity
          className="w-full py-4 rounded-lg mb-4"
          style={{ backgroundColor: colors.primary }}
          onPress={handleForgotPassword}
          disabled={isLoading || !email}
        >
          <Text 
            className="text-center font-semibold text-lg"
            style={{ color: colors.textOnPrimary }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          className="mt-4"
          onPress={() => navigation.goBack()}
        >
          <Text 
            className="text-center"
            style={{ color: colors.primary }}
          >
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
