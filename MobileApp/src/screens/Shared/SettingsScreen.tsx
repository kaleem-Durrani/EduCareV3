import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';

interface Props {
  navigation: any;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, toggleTheme, isDark } = useTheme();

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
    rightElement 
  }: { 
    icon: string; 
    title: string; 
    onPress: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b"
      style={{ borderBottomColor: colors.borderLight }}
      onPress={onPress}
    >
      <Text className="text-2xl mr-4">{icon}</Text>
      <Text 
        className="flex-1 text-base"
        style={{ color: colors.textPrimary }}
      >
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
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View className="items-center pt-4 pb-4">
        <Text 
          className="text-xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          Centro Infantil EDUCARE
        </Text>
        <View 
          className="w-full h-px"
          style={{ backgroundColor: '#000000' }}
        />
      </View>

      {/* Back Button and Title */}
      <View className="px-4 py-2 border-b" style={{ borderBottomColor: colors.border }}>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-2xl mr-2">←</Text>
          <Text 
            className="text-lg font-medium"
            style={{ color: colors.primary }}
          >
            Settings
          </Text>
        </TouchableOpacity>
        {/* Vertical bar under title */}
        <View 
          className="w-1 h-6 mt-2"
          style={{ backgroundColor: colors.primary }}
        />
      </View>

      <ScrollView className="flex-1">
        {/* App Settings */}
        <View className="mt-4">
          <Text 
            className="px-4 py-2 text-sm font-semibold"
            style={{ color: colors.textSecondary }}
          >
            APP SETTINGS
          </Text>
          
          <SettingItem
            icon="🌙"
            title={`Theme: ${isDark ? 'Dark' : 'Light'} Mode`}
            onPress={toggleTheme}
            rightElement={
              <View 
                className="w-12 h-6 rounded-full p-1"
                style={{ backgroundColor: isDark ? colors.primary : colors.border }}
              >
                <View 
                  className={`w-4 h-4 rounded-full ${isDark ? 'ml-auto' : ''}`}
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
          
          <SettingItem
            icon="🔒"
            title="Privacy"
            onPress={() => console.log('Privacy settings')}
          />
          
          <SettingItem
            icon="📱"
            title="App Version"
            onPress={() => {}}
            rightElement={
              <Text style={{ color: colors.textMuted }}>v1.0.0</Text>
            }
          />
        </View>

        {/* Support */}
        <View className="mt-6">
          <Text 
            className="px-4 py-2 text-sm font-semibold"
            style={{ color: colors.textSecondary }}
          >
            SUPPORT
          </Text>
          
          <SettingItem
            icon="💬"
            title="Contact Director"
            onPress={handleContact}
          />
          
          <SettingItem
            icon="📢"
            title="Send Feedback"
            onPress={handleFeedback}
          />
          
          <SettingItem
            icon="❓"
            title="Help & FAQ"
            onPress={() => console.log('Help')}
          />
        </View>

        {/* Account */}
        <View className="mt-6 mb-6">
          <Text 
            className="px-4 py-2 text-sm font-semibold"
            style={{ color: colors.textSecondary }}
          >
            ACCOUNT
          </Text>
          
          <SettingItem
            icon="🚪"
            title="Logout"
            onPress={() => console.log('Logout')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
