import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { useTheme } from '../contexts';

// Generic interface for selectable items
export interface SelectableItem {
  value: string;
  label: string;
  secondaryLabel?: string;
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
  const selectedItem = items.find(item => item.value === selectedValue);

  // Filter items based on search text
  const getFilteredItems = (): SelectableItem[] => {
    if (!searchEnabled || !searchText.trim()) return items;
    
    return items.filter(item =>
      item.label.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.secondaryLabel && item.secondaryLabel.toLowerCase().includes(searchText.toLowerCase()))
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
      className="p-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={() => handleItemSelect(item)}
    >
      <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
        {item.label}
      </Text>
      {item.secondaryLabel && (
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          {item.secondaryLabel}
        </Text>
      )}
    </TouchableOpacity>
  );

  const filteredItems = getFilteredItems();

  return (
    <View style={containerStyle}>
      {/* Select Button */}
      <TouchableOpacity
        className="p-4 rounded-lg border flex-row justify-between items-center"
        style={{ 
          backgroundColor: disabled ? colors.border : colors.card,
          borderColor: colors.border,
          opacity: disabled ? 0.6 : 1
        }}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
      >
        <View className="flex-1">
          {selectedItem ? (
            <>
              <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                {selectedItem.label}
              </Text>
              {selectedItem.secondaryLabel && (
                <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  {selectedItem.secondaryLabel}
                </Text>
              )}
            </>
          ) : (
            <Text className="text-base" style={{ 
              color: disabled ? colors.textSecondary : colors.textSecondary 
            }}>
              {placeholder}
            </Text>
          )}
        </View>
        <Text className="text-xl" style={{ color: colors.textSecondary }}>
          ▼
        </Text>
      </TouchableOpacity>

      {/* Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-end">
          <View 
            className="bg-black/50 flex-1"
            onTouchEnd={handleModalClose}
          />
          <View 
            className="rounded-t-lg max-h-96"
            style={{ backgroundColor: colors.background }}
          >
            {/* Header */}
            <View className="p-4 border-b" style={{ borderBottomColor: colors.border }}>
              <View className="flex-row justify-between items-center mb-3">
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
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.textPrimary
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
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="p-4 items-center">
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
