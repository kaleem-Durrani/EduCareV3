import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts';
import { useParentChildren } from '../../../../contexts/ParentChildrenContext';
import { ParentStudent } from '../../../../services';
import { SelectModal, SelectableItem } from '../../../../components';

interface ChildSelectorProps {
  selectedChild: ParentStudent | null;
  onChildSelect: (child: ParentStudent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChildSelector: React.FC<ChildSelectorProps> = ({
  selectedChild,
  onChildSelect,
  placeholder = 'Select a child',
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { children, isLoading } = useParentChildren();

  // Convert children to selectable items
  const childItems: SelectableItem[] = children.map((child) => ({
    label: `${child.fullName} (${child.current_class?.name || 'No Class'})`,
    value: child._id,
    originalData: child,
  }));

  const handleChildSelect = (item: SelectableItem) => {
    const child = item.originalData as ParentStudent;
    onChildSelect(child);
  };

  if (isLoading) {
    return (
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
          Select Child
        </Text>
        <View
          className="rounded-lg border p-3"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <Text style={{ color: colors.textSecondary }}>Loading children...</Text>
        </View>
      </View>
    );
  }

  if (children.length === 0) {
    return (
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
          Select Child
        </Text>
        <View
          className="rounded-lg border p-3"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <Text style={{ color: colors.textSecondary }}>No children found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
        Select Child
      </Text>

      <SelectModal
        items={childItems}
        selectedValue={selectedChild?._id || ''}
        placeholder={placeholder}
        title="👶 Select Child"
        searchEnabled={true}
        searchPlaceholder="Search children..."
        onSelect={handleChildSelect}
        disabled={disabled}
      />
    </View>
  );
};
