import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../../../contexts';
import { EnrolledClass } from '../../../../services';

interface ClassSelectorProps {
  classes: EnrolledClass[];
  selectedClass: EnrolledClass | null;
  onClassSelect: (classItem: EnrolledClass) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClass,
  onClassSelect,
}) => {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClassSelect = (classItem: EnrolledClass) => {
    onClassSelect(classItem);
    setIsModalVisible(false);
  };

  const renderClassItem = ({ item }: { item: EnrolledClass }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={() => handleClassSelect(item)}
    >
      <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
        {item.name}
      </Text>
      {item.description && (
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          {item.description}
        </Text>
      )}
      <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
        {item.students.length} student{item.students.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <Text className="text-lg font-medium mb-3" style={{ color: colors.textPrimary }}>
        Select Class
      </Text>
      
      {/* Class Selector Button */}
      <TouchableOpacity
        className="p-4 rounded-lg border flex-row justify-between items-center"
        style={{ 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }}
        onPress={() => setIsModalVisible(true)}
      >
        <View className="flex-1">
          {selectedClass ? (
            <>
              <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
                {selectedClass.name}
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                {selectedClass.students.length} student{selectedClass.students.length !== 1 ? 's' : ''}
              </Text>
            </>
          ) : (
            <Text className="text-lg" style={{ color: colors.textSecondary }}>
              Choose a class...
            </Text>
          )}
        </View>
        <Text className="text-xl" style={{ color: colors.textSecondary }}>
          ▼
        </Text>
      </TouchableOpacity>

      {/* Class Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View 
            className="bg-black/50 flex-1"
            onTouchEnd={() => setIsModalVisible(false)}
          />
          <View 
            className="rounded-t-lg max-h-96"
            style={{ backgroundColor: colors.background }}
          >
            {/* Modal Header */}
            <View className="p-4 border-b" style={{ borderBottomColor: colors.border }}>
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Select Class
                </Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Text className="text-lg" style={{ color: colors.primary }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Class List */}
            <FlatList
              data={classes}
              keyExtractor={(item) => item._id}
              renderItem={renderClassItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClassSelector;
