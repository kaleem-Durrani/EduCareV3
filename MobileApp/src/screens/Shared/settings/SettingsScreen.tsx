import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useTheme } from '../../../contexts';

interface Props {
  navigation: any;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, toggleTheme, isDark } = useTheme();

  const { logout } = useAuth();

  const handleContact = () => {
    // WhatsApp to director's number as per guidelines
    Linking.openURL('whatsapp://send?phone=+59163090969');
  };

  const handleFeedback = () => {
    // TODO: Navigate to feedback form
    console.log('Open feedback form');
  };

  const SettingItem = ({
    icon,
    title,
    onPress,
    rightElement,
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className="flex-row items-center border-b p-4"
      style={{ borderBottomColor: colors.borderLight }}
      onPress={onPress}>
      <Text className="mr-4 text-2xl">{icon}</Text>
      <Text className="flex-1 text-base" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
      {rightElement || (
        <Text className="text-xl" style={{ color: colors.textMuted }}>
          →
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      {/* Back Button and Title */}
      <View className="border-b px-4 py-2" style={{ borderBottomColor: colors.border }}>
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Settings
          </Text>
        </TouchableOpacity>
        {/* Vertical bar under title */}
        <View className="mt-2 h-6 w-1" style={{ backgroundColor: colors.primary }} />
      </View>

      <ScrollView className="flex-1">
        {/* App Settings */}
        <View className="mt-4">
          <Text className="px-4 py-2 text-sm font-semibold" style={{ color: colors.textSecondary }}>
            APP SETTINGS
          </Text>

          <SettingItem
            icon="🌙"
            title={`Theme: ${isDark ? 'Dark' : 'Light'} Mode`}
            onPress={toggleTheme}
            rightElement={
              <View
                className="h-6 w-12 rounded-full p-1"
                style={{ backgroundColor: isDark ? colors.primary : colors.border }}>
                <View
                  className={`h-4 w-4 rounded-full ${isDark ? 'ml-auto' : ''}`}
                  style={{ backgroundColor: colors.surface }}
                />
              </View>
            }
          />

          <SettingItem
            icon="🔔"
            title="Notifications"
            onPress={() => console.log('Notification settings')}
          />

          <SettingItem icon="🔒" title="Privacy" onPress={() => console.log('Privacy settings')} />

          <SettingItem
            icon="📱"
            title="App Version"
            onPress={() => {}}
            rightElement={<Text style={{ color: colors.textMuted }}>v1.0.0</Text>}
          />
        </View>

        {/* Support */}
        <View className="mt-6">
          <Text className="px-4 py-2 text-sm font-semibold" style={{ color: colors.textSecondary }}>
            SUPPORT
          </Text>

          <SettingItem icon="💬" title="Contact Director" onPress={handleContact} />

          <SettingItem icon="📢" title="Send Feedback" onPress={handleFeedback} />

          <SettingItem icon="❓" title="Help & FAQ" onPress={() => console.log('Help')} />
        </View>

        {/* Account */}
        <View className="mb-6 mt-6">
          <Text className="px-4 py-2 text-sm font-semibold" style={{ color: colors.textSecondary }}>
            ACCOUNT
          </Text>

          <SettingItem icon="🚪" title="Logout" onPress={() => logout()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
