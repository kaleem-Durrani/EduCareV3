import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { authService } from '../../../services';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../types';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    const result = await authService.forgotPassword({ email });

    if (result.success) {
      setMessage('Password reset instructions have been sent to your email.');
    } else {
      setError(result.message || 'Failed to send reset instructions');
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header with Logo */}
      <View className="items-center pb-4 pt-8">
        <Text className="mb-2 text-2xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        {/* Black line under logo */}
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <View className="flex-1 justify-center px-6">
        {/* Title */}
        <Text className="mb-4 text-center text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Forgot Password
        </Text>

        <Text className="mb-8 text-center" style={{ color: colors.textSecondary }}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        {/* Success Message */}
        {message ? (
          <View className="mb-4 rounded-lg p-4" style={{ backgroundColor: colors.success + '20' }}>
            <Text className="text-center" style={{ color: colors.success }}>
              {message}
            </Text>
          </View>
        ) : null}

        {/* Error Message */}
        {error ? (
          <View className="mb-4 rounded-lg p-4" style={{ backgroundColor: colors.error + '20' }}>
            <Text className="text-center" style={{ color: colors.error }}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Email Input */}
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
            Email
          </Text>
          <TextInput
            className="w-full rounded-lg border p-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
              setMessage('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Send Instructions Button */}
        <TouchableOpacity
          className="mb-4 w-full rounded-lg py-4"
          style={{ backgroundColor: colors.primary }}
          onPress={handleForgotPassword}
          disabled={isLoading || !email}>
          <Text
            className="text-center text-lg font-semibold"
            style={{ color: colors.textOnPrimary }}>
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity className="mt-4" onPress={() => navigation.goBack()}>
          <Text className="text-center" style={{ color: colors.primary }}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
