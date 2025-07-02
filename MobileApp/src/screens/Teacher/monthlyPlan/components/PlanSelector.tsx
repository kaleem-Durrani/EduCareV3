import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../../../../contexts';
import { EnrolledClass } from '../../../../services';

interface PlanSelectorProps {
  classes: EnrolledClass[];
  selectedClass: EnrolledClass | null;
  selectedMonth: number;
  selectedYear: number;
  onClassSelect: (classItem: EnrolledClass) => void;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  onLoadPlan: () => void;
  isLoading: boolean;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  classes,
  selectedClass,
  selectedMonth,
  selectedYear,
  onClassSelect,
  onMonthSelect,
  onYearSelect,
  onLoadPlan,
  isLoading,
}) => {
  const { colors } = useTheme();
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);
  const [isYearModalVisible, setIsYearModalVisible] = useState(false);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const getMonthName = (month: number) => {
    return months.find(m => m.value === month)?.label || 'Unknown';
  };

  const canLoadPlan = selectedClass && selectedMonth && selectedYear;

  const renderClassItem = ({ item }: { item: EnrolledClass }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={() => {
        onClassSelect(item);
        setIsClassModalVisible(false);
      }}
    >
      <Text className="text-lg font-medium" style={{ color: colors.textPrimary }}>
        {item.name}
      </Text>
      {item.description && (
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderMonthItem = ({ item }: { item: { value: number; label: string } }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={() => {
        onMonthSelect(item.value);
        setIsMonthModalVisible(false);
      }}
    >
      <Text className="text-lg" style={{ color: colors.textPrimary }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderYearItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{ borderBottomColor: colors.border }}
      onPress={() => {
        onYearSelect(item);
        setIsYearModalVisible(false);
      }}
    >
      <Text className="text-lg" style={{ color: colors.textPrimary }}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    data: any[],
    renderItem: any
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View 
          className="bg-black/50 flex-1"
          onTouchEnd={onClose}
        />
        <View 
          className="rounded-t-lg max-h-96"
          style={{ backgroundColor: colors.background }}
        >
          <View className="p-4 border-b" style={{ borderBottomColor: colors.border }}>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg" style={{ color: colors.primary }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => 
              typeof item === 'object' ? item.value?.toString() || index.toString() : item.toString()
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="mb-6">
      <Text className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
        📋 Select Plan Details
      </Text>

      {/* Class Selector */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
          Class
        </Text>
        <TouchableOpacity
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border 
          }}
          onPress={() => setIsClassModalVisible(true)}
        >
          <Text className="text-base" style={{ 
            color: selectedClass ? colors.textPrimary : colors.textSecondary 
          }}>
            {selectedClass ? selectedClass.name : 'Select a class...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Month and Year Row */}
      <View className="flex-row mb-4 space-x-3">
        {/* Month Selector */}
        <View className="flex-1">
          <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
            Month
          </Text>
          <TouchableOpacity
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }}
            onPress={() => setIsMonthModalVisible(true)}
          >
            <Text className="text-base" style={{ color: colors.textPrimary }}>
              {getMonthName(selectedMonth)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Year Selector */}
        <View className="flex-1">
          <Text className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
            Year
          </Text>
          <TouchableOpacity
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }}
            onPress={() => setIsYearModalVisible(true)}
          >
            <Text className="text-base" style={{ color: colors.textPrimary }}>
              {selectedYear}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Load Button */}
      <TouchableOpacity
        className="p-4 rounded-lg"
        style={{ 
          backgroundColor: canLoadPlan && !isLoading ? colors.primary : colors.border,
          opacity: canLoadPlan && !isLoading ? 1 : 0.6
        }}
        onPress={onLoadPlan}
        disabled={!canLoadPlan || isLoading}
      >
        <Text className="text-center text-white font-medium text-base">
          {isLoading ? 'Loading...' : 'Load Plan'}
        </Text>
      </TouchableOpacity>

      {/* Modals */}
      {renderModal(
        isClassModalVisible,
        () => setIsClassModalVisible(false),
        'Select Class',
        classes,
        renderClassItem
      )}

      {renderModal(
        isMonthModalVisible,
        () => setIsMonthModalVisible(false),
        'Select Month',
        months,
        renderMonthItem
      )}

      {renderModal(
        isYearModalVisible,
        () => setIsYearModalVisible(false),
        'Select Year',
        years,
        renderYearItem
      )}
    </View>
  );
};

export default PlanSelector;
