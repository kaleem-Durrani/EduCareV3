import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';

const DriverScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Driver
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
          Driver Screen
        </Text>
        <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
          Driver module functionality (needs clarification from client).
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default DriverScreen;
