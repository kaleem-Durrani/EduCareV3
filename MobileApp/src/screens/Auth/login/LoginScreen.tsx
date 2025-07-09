import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, Image, ScrollView } from 'react-native'; // Removed Animated
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useAuth } from '../../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'teacher' | null>(null); // Default to null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole: 'parent' | 'teacher') => {
    setRole(selectedRole);
  };

  const handleLogin = async () => {
    if (!role) {
      Toast.show({
        type: 'error',
        text1: 'Role Selection Required',
        text2: 'Please select whether you are a Parent or a Teacher.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

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
      <View className="mb-2 flex-row items-center justify-between px-4">
        <Image
          source={require('../../../../assets/EducareLogo.png')}
          className="h-24 w-24 flex-1"
          resizeMode="contain"
        />
      </View>
      <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />

      <ScrollView className="flex-1 px-6">
        {/* Login Form */}
        <View className="space-y-4">
          {/* Role Selection */}
          <View>
            <Text
              className="mb-6 mt-6 text-center text-2xl font-medium"
              style={{ color: colors.textPrimary }}>
              I am a
            </Text>
            <View className="mb-8 flex-row items-center justify-around">
              {/* Parent Role Selection */}
              <TouchableOpacity
                className={`items-center justify-center rounded-full border px-6 py-3 transition-all duration-200 ${
                  role === 'parent'
                    ? 'border-primary bg-primary scale-125'
                    : 'border-border bg-surface scale-100'
                }`}
                style={{
                  backgroundColor: role === 'parent' ? colors.primary : colors.surface,
                  borderColor: role === 'parent' ? colors.primary : colors.border,
                }}
                onPress={() => handleRoleSelect('parent')}>
                <Icon
                  name="account-child" // Icon for Parent (group of people)
                  size={40}
                  color={role === 'parent' ? colors.textOnPrimary : colors.textPrimary}
                  className={`transition-transform duration-200 ${role === 'parent' ? 'scale-150' : 'scale-100'}`}
                />
                <Text
                  className="mt-2 text-center font-medium"
                  style={{
                    color: role === 'parent' ? colors.textOnPrimary : colors.textPrimary,
                  }}>
                  Parent
                </Text>
              </TouchableOpacity>

              {/* Teacher Role Selection */}
              <TouchableOpacity
                className={`items-center justify-center rounded-full border px-6 py-3 transition-all duration-200 ${
                  role === 'teacher'
                    ? 'border-primary bg-primary scale-125'
                    : 'border-border bg-surface scale-100'
                }`}
                style={{
                  backgroundColor: role === 'teacher' ? colors.primary : colors.surface,
                  borderColor: role === 'teacher' ? colors.primary : colors.border,
                }}
                onPress={() => handleRoleSelect('teacher')}>
                <Icon
                  name="school" // Icon for Teacher (school/education related)
                  size={40}
                  color={role === 'teacher' ? colors.textOnPrimary : colors.textPrimary}
                  className={`transition-transform duration-200 ${role === 'teacher' ? 'scale-150' : 'scale-100'}`}
                />
                <Text
                  className="mt-2 text-center font-medium"
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
            className="mb-8 mt-6 w-full rounded-lg py-4"
            style={{
              backgroundColor:
                isLoading || !email || !password || !role ? colors.textMuted : colors.primary,
              opacity: isLoading || !email || !password || !role ? 0.6 : 1,
            }}
            onPress={handleLogin}
            disabled={isLoading || !email || !password || !role}>
            <Text
              className="text-center text-lg font-semibold"
              style={{ color: colors.textOnPrimary }}>
              {isLoading ? 'Signing In...' : 'Sign In'}
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
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default LoginScreen;
