import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';

const MyBoxScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="items-center pt-4 pb-4">
        <Text className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="w-full h-px" style={{ backgroundColor: '#000000' }} />
      </View>
      
      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="text-2xl mr-2">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            MyBox
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg text-center" style={{ color: colors.textPrimary }}>
          MyBox Screen
        </Text>
        <Text className="text-sm text-center mt-2" style={{ color: colors.textSecondary }}>
          Shows status of child's items (YES/NO). View-only for parents.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MyBoxScreen;