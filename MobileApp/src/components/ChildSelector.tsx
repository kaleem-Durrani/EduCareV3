import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts';
import { useParentChildren } from '../contexts/ParentChildrenContext';
import { ParentStudent } from '../services';
import { SelectModal, SelectableItem } from '.';
import { buildMediaUrl } from '../config';

interface ChildSelectorProps {
  selectedChild: ParentStudent | null;
  onChildSelect: (child: ParentStudent) => void;
  onResetSelection: () => void;
  placeholder?: string;
  showAsTag?: boolean;
  disabled?: boolean;
}

export const ChildSelector: React.FC<ChildSelectorProps> = ({
  selectedChild,
  onChildSelect,
  onResetSelection,
  placeholder = 'Select a child',
  showAsTag = false,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { children } = useParentChildren();
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  // Convert children to SelectableItem format
  const getChildItems = (): SelectableItem[] => {
    return children.map((child) => ({
      value: child._id,
      label: child.fullName,
      secondaryLabel: `${child.current_class?.name || 'No Class'} • Enrollment #${child.rollNum}`,
      photoUrl: child.photoUrl,
      originalData: child,
    }));
  };

  const handleChildSelect = (item: SelectableItem) => {
    const child = item.originalData as ParentStudent;
    setSelectedChildId(item.value);
    onChildSelect(child);
  };

  const handleResetSelection = () => {
    onResetSelection();
    setSelectedChildId('');
  };

  const childItems = getChildItems();

  // Render as tag (compact mode)
  if (showAsTag) {
    return (
      <View className="mb-4">
        {selectedChild ? (
          <View className="flex-row items-center">
            <View
              className="mr-2 flex-row items-center rounded-full border px-3 py-2"
              style={{
                backgroundColor: colors.primary + '10',
                borderColor: colors.primary,
              }}>
              {selectedChild.photoUrl && (
                <Image
                  source={{ uri: buildMediaUrl(selectedChild.photoUrl) }}
                  className="mr-2 h-6 w-6 rounded-full"
                />
              )}
              <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                {selectedChild.fullName}
              </Text>
              <TouchableOpacity className="ml-2" onPress={handleResetSelection}>
                <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <SelectModal
          items={childItems}
          selectedValue={selectedChildId}
          placeholder={placeholder}
          title="Select Child"
          searchEnabled={true}
          searchPlaceholder="Search children..."
          onSelect={handleChildSelect}
        />
      </View>
    );
  }

  // Render as full selector (expanded mode)
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
        Select Child
      </Text>

      {selectedChild ? (
        <View
          className="mb-2 rounded-lg border p-4"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.primary,
            borderWidth: 2,
          }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              {selectedChild.photoUrl && (
                <Image
                  source={{ uri: buildMediaUrl(selectedChild.photoUrl) }}
                  className="mr-3 h-12 w-12 rounded-full"
                />
              )}
              <View className="flex-1">
                <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  {selectedChild.fullName}
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  {selectedChild.current_class?.name || 'No Class'} • Enrollment #
                  {selectedChild.rollNum}
                </Text>
              </View>
            </View>
            <View className="space-y-2">
              <TouchableOpacity
                className="rounded-lg px-3 py-2"
                style={{ backgroundColor: colors.error + '20' }}
                onPress={handleResetSelection}>
                <Text className="text-sm" style={{ color: colors.error }}>
                  Clear
                </Text>
              </TouchableOpacity>
              {/* <SelectModal
                items={childItems}
                selectedValue={selectedChildId}
                placeholder="Change"
                title="Select Child"
                searchEnabled={true}
                searchPlaceholder="Search children..."
                onSelect={handleChildSelect}
                containerStyle={{
                  backgroundColor: colors.primary + '20',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              /> */}
            </View>
          </View>
        </View>
      ) : (
        <SelectModal
          items={childItems}
          selectedValue={selectedChildId}
          placeholder={placeholder}
          title="Select Child"
          searchEnabled={true}
          searchPlaceholder="Search children..."
          onSelect={handleChildSelect}
        />
      )}
    </View>
  );
};
