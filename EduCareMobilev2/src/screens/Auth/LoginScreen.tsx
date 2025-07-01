import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack,
  Text, 
  Input, 
  InputField,
  Button, 
  ButtonText,
  Pressable,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  Alert,
  AlertIcon,
  AlertText,
  InfoIcon
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'teacher' | 'admin'>('parent');

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    try {
      await login(email, password, role);
    } catch (error) {
      // Error is handled by the auth context
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
          {/* Logo/Title */}
          <Text 
            fontSize="$3xl" 
            fontWeight="$bold" 
            color="$primary600"
            mb="$8"
          >
            EduCare
          </Text>

          {/* Error Alert */}
          {error && (
            <Alert action="error" variant="solid" mb="$4">
              <AlertIcon as={InfoIcon} />
              <AlertText>{error}</AlertText>
            </Alert>
          )}

          {/* Login Form */}
          <VStack space="md" w="$full">
            {/* Role Selection */}
            <Select selectedValue={role} onValueChange={(value) => setRole(value as any)}>
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder="Select role" />
                <SelectIcon />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Parent" value="parent" />
                  <SelectItem label="Teacher" value="teacher" />
                </SelectContent>
              </SelectPortal>
            </Select>

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

            {/* Password Input */}
            <Input variant="outline" size="md">
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Input>

            {/* Login Button */}
            <Button 
              size="md" 
              variant="solid" 
              action="primary"
              onPress={handleLogin}
              isDisabled={isLoading || !email || !password}
              mt="$4"
            >
              <ButtonText>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </ButtonText>
            </Button>

            {/* Forgot Password Link */}
            <HStack justifyContent="center" mt="$4">
              <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                <Text color="$primary600" fontSize="$sm">
                  Forgot Password?
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default LoginScreen;
