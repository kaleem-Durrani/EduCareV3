import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../contexts';
import { ParentStudent, StudentBoxStatus, StudentBoxItemStatus } from '../../../../services';

interface ParentBoxStatusContentProps {
  selectedChild: ParentStudent | null;
  boxStatus: StudentBoxStatus | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const ParentBoxStatusContent: React.FC<ParentBoxStatusContentProps> = ({
  selectedChild,
  boxStatus,
  isLoading,
  error,
  onRetry,
}) => {
  const { colors } = useTheme();

  const renderBoxItem = ({ item }: { item: StudentBoxItemStatus }) => (
    <View
      className="mb-3 rounded-lg border p-3"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
            {item.item_id.name}
          </Text>
          {item.item_id.description && (
            <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
              {item.item_id.description}
            </Text>
          )}
          {item.notes && (
            <Text className="mt-1 text-sm italic" style={{ color: colors.textSecondary }}>
              Note: {item.notes}
            </Text>
          )}
        </View>
        
        <View className="ml-3 items-center">
          <View
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor: item.has_item ? '#10B981' : '#EF4444',
            }}
          >
            <Text className="text-sm font-bold text-white">
              {item.has_item ? 'YES' : 'NO'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Loading Box Status...
          </Text>
          <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
            Please wait while we fetch your child's box status.
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Error Loading Box Status
          </Text>
          <Text className="text-sm text-center mb-4" style={{ color: colors.textSecondary }}>
            {error}
          </Text>
          <TouchableOpacity
            className="rounded-lg bg-blue-500 px-6 py-3"
            onPress={onRetry}
          >
            <Text className="font-medium text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!boxStatus) {
    return (
      <View
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Box Status Not Found
          </Text>
          <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
            Unable to load box status for this child.
          </Text>
        </View>
      </View>
    );
  }

  const totalItems = boxStatus.items?.length || 0;
  const checkedItems = boxStatus.items?.filter(item => item.has_item).length || 0;
  const completionPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        📦 Box Status - {selectedChild?.fullName}
      </Text>

      {/* Summary Card */}
      <View
        className="rounded-lg p-4 mb-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <Text className="text-base font-medium mb-2" style={{ color: colors.textPrimary }}>
          📊 Summary
        </Text>
        <View className="flex-row justify-between">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Items Checked: {checkedItems}/{totalItems}
          </Text>
          <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            {completionPercentage}% Complete
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View className="mt-2 h-2 rounded-full bg-gray-200">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${completionPercentage}%`,
              backgroundColor: completionPercentage === 100 ? '#10B981' : '#3B82F6',
            }}
          />
        </View>
      </View>

      {/* Box Items List */}
      <View
        className="rounded-lg p-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }}
      >
        <Text className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
          📋 Items Checklist
        </Text>

        {boxStatus.items && boxStatus.items.length > 0 ? (
          <FlatList
            data={boxStatus.items}
            keyExtractor={(item) => item.item_id._id}
            renderItem={renderBoxItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center py-4">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              No box items available
            </Text>
          </View>
        )}
      </View>

      {/* Read-only Notice */}
      <View className="mt-4 rounded-lg bg-blue-50 p-3">
        <Text className="text-sm text-center text-blue-700">
          ℹ️ This is a read-only view. Only teachers can update box status.
        </Text>
      </View>
    </View>
  );
};

export default ParentBoxStatusContent;
