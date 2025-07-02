import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useAuth } from '../../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login({ email, password, role });

    if (!result.success) {
      setError(result.message || 'Login failed');
    }
    // If successful, navigation will be handled automatically by the auth context

    setIsLoading(false);
  };

  const openTermsOfService = () => {
    // TODO: Replace with actual Terms of Service URL
    Linking.openURL('https://example.com/terms');
  };

  const openPrivacyPolicy = () => {
    // TODO: Replace with actual Privacy Policy URL
    Linking.openURL('https://example.com/privacy');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header with Logo */}
      <View className="items-center pb-4 pt-8">
        {/* TODO: Replace with actual EDUCARE logo */}
        <Text className="mb-2 text-2xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        {/* Black line under logo */}
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <View className="flex-1 justify-center px-6">
        {/* Login Form */}
        <View className="space-y-4">
          {/* Role Selection */}
          <View>
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              I am a
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="flex-1 rounded-lg border p-4"
                style={{
                  backgroundColor: role === 'parent' ? colors.primary : colors.surface,
                  borderColor: role === 'parent' ? colors.primary : colors.border,
                }}
                onPress={() => setRole('parent')}>
                <Text
                  className="text-center font-medium"
                  style={{
                    color: role === 'parent' ? colors.textOnPrimary : colors.textPrimary,
                  }}>
                  Parent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg border p-4"
                style={{
                  backgroundColor: role === 'teacher' ? colors.primary : colors.surface,
                  borderColor: role === 'teacher' ? colors.primary : colors.border,
                }}
                onPress={() => setRole('teacher')}>
                <Text
                  className="text-center font-medium"
                  style={{
                    color: role === 'teacher' ? colors.textOnPrimary : colors.textPrimary,
                  }}>
                  Teacher
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Email Input */}
          <View>
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              Email/Username
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
                setError(''); // Clear error when user types
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              Password
            </Text>
            <TextInput
              className="w-full rounded-lg border p-4"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(''); // Clear error when user types
              }}
              secureTextEntry
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View className="mt-2">
              <Text className="text-center text-sm" style={{ color: colors.error }}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            className="mt-6 w-full rounded-lg py-4"
            style={{
              backgroundColor: isLoading || !email || !password ? colors.textMuted : colors.primary,
              opacity: isLoading || !email || !password ? 0.6 : 1,
            }}
            onPress={handleLogin}
            disabled={isLoading || !email || !password}>
            <Text
              className="text-center text-lg font-semibold"
              style={{ color: colors.textOnPrimary }}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity className="mt-4" onPress={() => navigation.navigate('ForgotPassword')}>
            <Text className="text-center" style={{ color: colors.primary }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View className="mt-8">
          <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
            By logging in, you agree to our{' '}
            <Text style={{ color: colors.primary }} onPress={openTermsOfService}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text style={{ color: colors.primary }} onPress={openPrivacyPolicy}>
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
