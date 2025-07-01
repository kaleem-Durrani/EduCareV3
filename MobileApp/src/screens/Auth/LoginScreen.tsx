import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual login logic
      console.log('Login attempt:', { email, password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
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
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header with Logo */}
      <View className="items-center pt-8 pb-4">
        {/* TODO: Replace with actual EDUCARE logo */}
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
        {/* Login Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <Text 
              className="text-sm font-medium mb-2"
              style={{ color: colors.textPrimary }}
            >
              Email/Username
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

          {/* Password Input */}
          <View>
            <Text 
              className="text-sm font-medium mb-2"
              style={{ color: colors.textPrimary }}
            >
              Password
            </Text>
            <TextInput
              className="w-full p-4 rounded-lg border"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary
              }}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="w-full py-4 rounded-lg mt-6"
            style={{ backgroundColor: colors.primary }}
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
          >
            <Text 
              className="text-center font-semibold text-lg"
              style={{ color: colors.textOnPrimary }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity
            className="mt-4"
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text 
              className="text-center"
              style={{ color: colors.primary }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View className="mt-8">
          <Text 
            className="text-center text-sm"
            style={{ color: colors.textSecondary }}
          >
            By logging in, you agree to our{' '}
            <Text 
              style={{ color: colors.primary }}
              onPress={openTermsOfService}
            >
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text 
              style={{ color: colors.primary }}
              onPress={openPrivacyPolicy}
            >
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
