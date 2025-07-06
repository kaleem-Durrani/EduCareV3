import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../../contexts';

interface DayInputFormProps {
  selectedDay: string;
  dayData: {
    toilet: string;
    food_intake: string;
    friends_interaction: string;
    studies_mood: string;
  };
  onDataChange: (field: string, value: string) => void;
}

export const DayInputForm: React.FC<DayInputFormProps> = ({
  selectedDay,
  dayData,
  onDataChange,
}) => {
  const { colors } = useTheme();

  const fields = [
    {
      key: 'toilet',
      label: 'Toilet',
      icon: 'toilet',
      iconType: 'MaterialCommunityIcons',
      placeholder: 'e.g., Pee 💧, Poop 💩, Both',
      multiline: false,
    },
    {
      key: 'food_intake',
      label: 'Food Intake',
      icon: 'restaurant',
      iconType: 'MaterialIcons',
      placeholder: 'e.g., Ate well 🍎, Picky, Good appetite',
      multiline: false,
    },
    {
      key: 'friends_interaction',
      label: 'Friends Interaction',
      icon: 'group',
      iconType: 'MaterialIcons',
      placeholder: 'e.g., Played well 🤝, Shy, Social',
      multiline: false,
    },
    {
      key: 'studies_mood',
      label: 'Studies & Mood',
      icon: 'school',
      iconType: 'MaterialIcons',
      placeholder: 'e.g., Focused 📚, Happy, Distracted',
      multiline: true,
    },
  ];

  const getDayName = (day: string) => {
    const dayNames: Record<string, string> = {
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
    };
    return dayNames[day] || day;
  };

  return (
    <ScrollView className="flex-1">
      <View className="mb-4">
        <Text className="text-center text-xl font-bold" style={{ color: colors.primary }}>
          {getDayName(selectedDay)}
        </Text>
        <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
          Fill in the daily report details
        </Text>
      </View>

      {fields.map((field) => (
        <View key={field.key} className="mb-4">
          <View className="mb-2 flex-row items-center">
            {field.iconType === 'MaterialCommunityIcons' ? (
              <MaterialCommunityIcons name={field.icon} size={20} color={colors.primary} />
            ) : (
              <Icon name={field.icon} size={20} color={colors.primary} />
            )}
            <Text className="ml-2 font-medium" style={{ color: colors.textPrimary }}>
              {field.label}
            </Text>
          </View>

          <TextInput
            className="rounded-lg border p-3"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary,
              textAlignVertical: field.multiline ? 'top' : 'center',
            }}
            placeholder={field.placeholder}
            placeholderTextColor={colors.textSecondary}
            value={dayData[field.key as keyof typeof dayData]}
            onChangeText={(value) => onDataChange(field.key, value)}
            multiline={field.multiline}
            numberOfLines={field.multiline ? 3 : 1}
          />
        </View>
      ))}
    </ScrollView>
  );
};
