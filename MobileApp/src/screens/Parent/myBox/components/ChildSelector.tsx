import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../../../contexts';
import { ParentStudent } from '../../../../services';

interface ChildSelectorProps {
  children: ParentStudent[];
  selectedChild: ParentStudent | null;
  onChildSelect: (child: ParentStudent) => void;
  onResetSelection: () => void;
  isLoading?: boolean;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({
  children,
  selectedChild,
  onChildSelect,
  onResetSelection,
  isLoading = false,
}) => {
  const { colors } = useTheme();

  const renderChildItem = ({ item }: { item: ParentStudent }) => (
    <TouchableOpacity
      className="mb-2 rounded-lg border p-3"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      onPress={() => onChildSelect(item)}
      disabled={isLoading}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
            {item.fullName}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Roll No: {item.rollNum} • {item.current_class?.name || 'No Class'}
          </Text>
        </View>
        <View className="ml-2">
          <Text className="text-lg">👶</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedChild) {
    return (
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            Selected Child
          </Text>
          <TouchableOpacity
            className="rounded-lg bg-gray-500 px-3 py-1"
            onPress={onResetSelection}
            disabled={isLoading}
          >
            <Text className="text-sm font-medium text-white">Change</Text>
          </TouchableOpacity>
        </View>
        
        <View
          className="rounded-lg border p-3"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.primary,
            borderWidth: 2,
          }}
        >
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                {selectedChild.fullName}
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Roll No: {selectedChild.rollNum} • {selectedChild.current_class?.name || 'No Class'}
              </Text>
            </View>
            <View className="ml-2">
              <Text className="text-lg">👶</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-4">
      <Text className="mb-3 text-lg font-bold" style={{ color: colors.textPrimary }}>
        Select Your Child
      </Text>
      
      {children.length === 0 ? (
        <View
          className="rounded-lg border p-4"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <Text className="text-center text-base" style={{ color: colors.textSecondary }}>
            No children found
          </Text>
        </View>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item._id}
          renderItem={renderChildItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

export default ChildSelector;
