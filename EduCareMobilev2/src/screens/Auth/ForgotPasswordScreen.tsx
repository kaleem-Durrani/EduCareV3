import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Input, 
  InputField,
  Button, 
  ButtonText,
  Pressable,
  Alert,
  AlertIcon,
  AlertText,
  InfoIcon
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
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

    try {
      // TODO: Implement forgot password API call
      // await AuthService.forgotPassword(email);
      setMessage('Password reset instructions have been sent to your email.');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box 
        flex={1} 
        backgroundColor="$backgroundLight0"
        $dark-backgroundColor="$backgroundDark950"
        justifyContent="center"
        px="$6"
      >
        <VStack space="lg" alignItems="center">
          {/* Title */}
          <Text 
            fontSize="$2xl" 
            fontWeight="$bold" 
            color="$textLight900"
            $dark-color="$textDark100"
            mb="$4"
          >
            Forgot Password
          </Text>

          <Text 
            fontSize="$md" 
            color="$textLight600"
            $dark-color="$textDark400"
            textAlign="center"
            mb="$6"
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          {/* Error Alert */}
          {error && (
            <Alert action="error" variant="solid" mb="$4">
              <AlertIcon as={InfoIcon} />
              <AlertText>{error}</AlertText>
            </Alert>
          )}

          {/* Success Alert */}
          {message && (
            <Alert action="success" variant="solid" mb="$4">
              <AlertIcon as={InfoIcon} />
              <AlertText>{message}</AlertText>
            </Alert>
          )}

          {/* Form */}
          <VStack space="md" w="$full">
            {/* Email Input */}
            <Input variant="outline" size="md">
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>

            {/* Submit Button */}
            <Button 
              size="md" 
              variant="solid" 
              action="primary"
              onPress={handleForgotPassword}
              isDisabled={isLoading || !email}
              mt="$4"
            >
              <ButtonText>
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </ButtonText>
            </Button>

            {/* Back to Login Link */}
            <Pressable onPress={() => navigation.goBack()} mt="$4">
              <Text color="$primary600" fontSize="$sm" textAlign="center">
                Back to Login
              </Text>
            </Pressable>
          </VStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
