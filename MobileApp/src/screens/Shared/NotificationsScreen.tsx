import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts';

interface Props {
  navigation: any;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  // TODO: Fetch actual notifications
  const notifications = [
    {
      id: '1',
      title: 'Payment Due',
      message: 'Monthly payment is due in 3 days',
      date: '2024-01-15',
      type: 'payment',
      read: false,
    },
    {
      id: '2',
      title: 'Missing Item',
      message: 'Toothbrush is missing from My Box',
      date: '2024-01-14',
      type: 'item',
      read: false,
    },
    {
      id: '3',
      title: 'Document Required',
      message: 'Please submit updated ID copy',
      date: '2024-01-13',
      type: 'document',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💳';
      case 'item': return '📦';
      case 'document': return '📄';
      default: return '🔔';
    }
  };

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
            Notifications
          </Text>
        </TouchableOpacity>
        {/* Vertical bar under title */}
        <View 
          className="w-1 h-6 mt-2"
          style={{ backgroundColor: colors.primary }}
        />
      </View>

      <ScrollView className="flex-1 px-4">
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            className="p-4 rounded-lg mb-3 flex-row items-start"
            style={{ 
              backgroundColor: notification.read ? colors.card : colors.primary + '10',
              borderColor: colors.border,
              borderWidth: 1
            }}
          >
            <Text className="text-2xl mr-3">{getNotificationIcon(notification.type)}</Text>
            
            <View className="flex-1">
              <Text 
                className="font-semibold mb-1"
                style={{ color: colors.textPrimary }}
              >
                {notification.title}
              </Text>
              <Text 
                className="text-sm mb-2"
                style={{ color: colors.textSecondary }}
              >
                {notification.message}
              </Text>
              <Text 
                className="text-xs"
                style={{ color: colors.textMuted }}
              >
                {notification.date}
              </Text>
            </View>

            {!notification.read && (
              <View 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
