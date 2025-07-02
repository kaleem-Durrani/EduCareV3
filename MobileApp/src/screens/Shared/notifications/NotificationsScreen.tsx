import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';

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
      case 'payment':
        return '💳';
      case 'item':
        return '📦';
      case 'document':
        return '📄';
      default:
        return '🔔';
    }
  };

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
            Notifications
          </Text>
        </TouchableOpacity>
        {/* Vertical bar under title */}
        <View className="mt-2 h-6 w-1" style={{ backgroundColor: colors.primary }} />
      </View>

      <ScrollView className="flex-1 px-4">
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            className="mb-3 flex-row items-start rounded-lg p-4"
            style={{
              backgroundColor: notification.read ? colors.card : colors.primary + '10',
              borderColor: colors.border,
              borderWidth: 1,
            }}>
            <Text className="mr-3 text-2xl">{getNotificationIcon(notification.type)}</Text>

            <View className="flex-1">
              <Text className="mb-1 font-semibold" style={{ color: colors.textPrimary }}>
                {notification.title}
              </Text>
              <Text className="mb-2 text-sm" style={{ color: colors.textSecondary }}>
                {notification.message}
              </Text>
              <Text className="text-xs" style={{ color: colors.textMuted }}>
                {notification.date}
              </Text>
            </View>

            {!notification.read && (
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
