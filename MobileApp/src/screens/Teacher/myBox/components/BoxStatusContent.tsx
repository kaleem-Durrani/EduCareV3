import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Switch } from 'react-native';
import { useTheme } from '../../../../contexts';
import { ClassStudent, StudentBoxStatus, StudentBoxItemStatus } from '../../../../services';

interface BoxStatusContentProps {
  selectedStudent: ClassStudent | null;
  boxStatus: StudentBoxStatus | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
  onRetry: () => void;
  onUpdateBoxStatus: (items: any[]) => Promise<void>;
}

const BoxStatusContent: React.FC<BoxStatusContentProps> = ({
  selectedStudent,
  boxStatus,
  isLoading,
  error,
  isUpdating,
  updateError,
  onRetry,
  onUpdateBoxStatus,
}) => {
  const { colors } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [itemStatuses, setItemStatuses] = useState<Record<string, boolean>>({});
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local state when boxStatus changes
  useEffect(() => {
    if (boxStatus && boxStatus.items) {
      const statuses: Record<string, boolean> = {};
      const notes: Record<string, string> = {};
      
      boxStatus.items.forEach(item => {
        statuses[item.item_id._id] = item.has_item;
        notes[item.item_id._id] = item.notes || '';
      });
      
      setItemStatuses(statuses);
      setItemNotes(notes);
      setHasChanges(false);
    }
  }, [boxStatus]);

  const handleItemToggle = (itemId: string, value: boolean) => {
    setItemStatuses(prev => ({
      ...prev,
      [itemId]: value
    }));
    setHasChanges(true);
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setItemNotes(prev => ({
      ...prev,
      [itemId]: note
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!boxStatus) return;

    const items = boxStatus.items.map(item => ({
      item_id: item.item_id._id,
      has_item: itemStatuses[item.item_id._id] || false,
      notes: itemNotes[item.item_id._id] || ''
    }));

    await onUpdateBoxStatus(items);
    setEditMode(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    // Reset to original values
    if (boxStatus && boxStatus.items) {
      const statuses: Record<string, boolean> = {};
      const notes: Record<string, string> = {};
      
      boxStatus.items.forEach(item => {
        statuses[item.item_id._id] = item.has_item;
        notes[item.item_id._id] = item.notes || '';
      });
      
      setItemStatuses(statuses);
      setItemNotes(notes);
    }
    setEditMode(false);
    setHasChanges(false);
  };

  const renderBoxItem = ({ item }: { item: StudentBoxItemStatus }) => (
    <View
      className="mb-3 p-4 rounded-lg border"
      style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border 
      }}
    >
      {/* Item Header */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
            {item.item_id.name}
          </Text>
          {item.item_id.description && (
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {item.item_id.description}
            </Text>
          )}
        </View>

        {/* Status Toggle */}
        <View className="items-center">
          <Switch
            value={itemStatuses[item.item_id._id] || false}
            onValueChange={(value) => handleItemToggle(item.item_id._id, value)}
            disabled={!editMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={itemStatuses[item.item_id._id] ? '#ffffff' : '#f4f3f4'}
          />
          <Text className="text-xs mt-1" style={{ 
            color: itemStatuses[item.item_id._id] ? colors.primary : colors.textSecondary 
          }}>
            {itemStatuses[item.item_id._id] ? 'YES' : 'NO'}
          </Text>
        </View>
      </View>

      {/* Notes Section */}
      {editMode ? (
        <TextInput
          className="p-3 rounded-lg border mt-2"
          style={{ 
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.textPrimary,
            minHeight: 40
          }}
          placeholder="Add notes..."
          placeholderTextColor={colors.textSecondary}
          value={itemNotes[item.item_id._id] || ''}
          onChangeText={(text) => handleNoteChange(item.item_id._id, text)}
          multiline
          textAlignVertical="top"
        />
      ) : (
        item.notes && (
          <View 
            className="p-3 rounded-lg mt-2"
            style={{ backgroundColor: colors.background }}
          >
            <Text className="text-sm" style={{ color: colors.textPrimary }}>
              📝 {item.notes}
            </Text>
          </View>
        )
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Loading box status...
        </Text>
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
          borderWidth: 1 
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Failed to Load Box Status
          </Text>
          <Text className="text-sm text-center mb-4" style={{ color: colors.textSecondary }}>
            {error}
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={onRetry}
          >
            <Text className="text-white font-medium">Try Again</Text>
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
          borderWidth: 1 
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
            Box Status Not Found
          </Text>
          <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
            Unable to load box status for this student.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        📦 Box Status - {selectedStudent?.fullName}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row mb-4 space-x-3">
        {!editMode ? (
          <TouchableOpacity
            className="flex-1 p-3 rounded-lg"
            style={{ backgroundColor: colors.primary }}
            onPress={() => setEditMode(true)}
          >
            <Text className="text-center text-white font-medium">
              ✏️ Edit Status
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              className="flex-1 p-3 rounded-lg mr-2"
              style={{ 
                backgroundColor: hasChanges && !isUpdating ? '#10B981' : colors.border,
                opacity: hasChanges && !isUpdating ? 1 : 0.6
              }}
              onPress={handleSave}
              disabled={!hasChanges || isUpdating}
            >
              <Text className="text-center text-white font-medium">
                {isUpdating ? '💾 Saving...' : '💾 Save'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 p-3 rounded-lg"
              style={{ backgroundColor: '#EF4444' }}
              onPress={handleCancel}
              disabled={isUpdating}
            >
              <Text className="text-center text-white font-medium">
                ❌ Cancel
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Update Error */}
      {updateError && (
        <View 
          className="p-3 rounded-lg mb-4"
          style={{ backgroundColor: '#FEE2E2', borderColor: '#EF4444', borderWidth: 1 }}
        >
          <Text className="text-sm" style={{ color: '#DC2626' }}>
            ❌ {updateError}
          </Text>
        </View>
      )}

      {/* Box Items List */}
      <View
        className="rounded-lg p-4"
        style={{ 
          backgroundColor: colors.card, 
          borderColor: colors.border, 
          borderWidth: 1 
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
            scrollEnabled={false} // Disable scroll since we're inside a ScrollView
          />
        ) : (
          <View className="items-center py-4">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              No box items available
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BoxStatusContent;
