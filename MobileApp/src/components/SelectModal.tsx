import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from '../contexts';
import { buildMediaUrl } from '../config';

// Generic interface for selectable items
export interface SelectableItem {
  value: string;
  label: string;
  secondaryLabel?: string;
  photoUrl?: string; // Optional photo URL for displaying images
  [key: string]: any; // Allow additional properties
}

interface SelectModalProps {
  // Data
  items: SelectableItem[];
  selectedValue?: string;

  // Display
  placeholder: string;
  title: string;

  // Search functionality
  searchEnabled?: boolean;
  searchPlaceholder?: string;

  // Callbacks
  onSelect: (item: SelectableItem) => void;

  // Styling
  disabled?: boolean;
  containerStyle?: any;
}

const SelectModal: React.FC<SelectModalProps> = ({
  items,
  selectedValue,
  placeholder,
  title,
  searchEnabled = false,
  searchPlaceholder = 'Search...',
  onSelect,
  disabled = false,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Find selected item for display
  const selectedItem = items.find((item) => item.value === selectedValue);

  // Filter items based on search text
  const getFilteredItems = (): SelectableItem[] => {
    if (!searchEnabled || !searchText.trim()) return items;

    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.secondaryLabel &&
          item.secondaryLabel.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  const handleItemSelect = (item: SelectableItem) => {
    onSelect(item);
    setIsModalVisible(false);
    setSearchText(''); // Reset search
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSearchText(''); // Reset search when closing
  };

  const renderItem = ({ item }: { item: SelectableItem }) => (
    <TouchableOpacity
      className="flex-row items-center border-b p-4"
      style={{ borderBottomColor: colors.border }}
      onPress={() => handleItemSelect(item)}>
      <View className="flex-1">
        <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
          {item.label}
        </Text>
        {item.secondaryLabel && (
          <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
            {item.secondaryLabel}
          </Text>
        )}
      </View>

      {/* Photo on the right */}
      {item.photoUrl && (
        <View className="ml-3">
          <View className="h-12 w-12 overflow-hidden rounded-full">
            <Image
              source={{ uri: buildMediaUrl(item.photoUrl) }}
              className="h-full w-full"
              resizeMode="cover"
              onError={() => {
                Toast.show({
                  type: 'error',
                  text1: 'Image Load Error',
                  text2: `Failed to load image for ${item.label}`,
                });
              }}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const filteredItems = getFilteredItems();

  return (
    <View style={containerStyle}>
      {/* Select Button */}
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-lg border p-4"
        style={{
          backgroundColor: disabled ? colors.border : colors.card,
          borderColor: colors.border,
          opacity: disabled ? 0.6 : 1,
        }}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}>
        <View className="flex-1 flex-row items-center">
          {selectedItem ? (
            <>
              <View className="flex-1">
                <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                  {selectedItem.label}
                </Text>
                {selectedItem.secondaryLabel && (
                  <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                    {selectedItem.secondaryLabel}
                  </Text>
                )}
              </View>

              {/* Photo on the right */}
              {selectedItem.photoUrl && (
                <View className="ml-3">
                  <View className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      source={{ uri: buildMediaUrl(selectedItem.photoUrl) }}
                      className="h-full w-full"
                      resizeMode="cover"
                      onError={() => {
                        Toast.show({
                          type: 'error',
                          text1: 'Image Load Error',
                          text2: `Failed to load image for ${selectedItem.label}`,
                        });
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          ) : (
            <Text
              className="text-base"
              style={{
                color: disabled ? colors.textSecondary : colors.textSecondary,
              }}>
              {placeholder}
            </Text>
          )}
        </View>
        <Text className="ml-2 text-xl" style={{ color: colors.textSecondary }}>
          ▼
        </Text>
      </TouchableOpacity>

      {/* Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}>
        <View className="flex-1 justify-end">
          <View className="flex-1 bg-black/50" onTouchEnd={handleModalClose} />
          <View className="max-h-96 rounded-t-lg" style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View className="border-b p-4" style={{ borderBottomColor: colors.border }}>
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {title}
                </Text>
                <TouchableOpacity onPress={handleModalClose}>
                  <Text className="text-lg" style={{ color: colors.primary }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              {searchEnabled && (
                <TextInput
                  className="rounded-lg border p-3"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            </View>

            {/* Items List */}
            <FlatList
              data={filteredItems}
              keyExtractor={(item, index) => (item.value ? item.value.toString() : `item-${index}`)}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="items-center p-4">
                  <Text style={{ color: colors.textSecondary }}>
                    {searchEnabled && searchText.trim() ? 'No results found' : 'No items available'}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectModal;
