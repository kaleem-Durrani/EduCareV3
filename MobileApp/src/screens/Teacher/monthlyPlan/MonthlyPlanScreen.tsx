import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageViewing from 'react-native-image-viewing';
import Toast from 'react-native-toast-message';
import { useTheme, useTeacherClasses } from '../../../contexts';
import { useApi } from '../../../hooks';
import { monthlyPlanService, EnrolledClass, MonthlyPlan } from '../../../services';
import { SelectModal, ScreenHeader } from '../../../components';
import { buildMediaUrl } from '../../../config';

const { width: screenWidth } = Dimensions.get('window');

const MonthlyPlanScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  // State management
  const [selectedClass, setSelectedClass] = useState<EnrolledClass | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hasSearched, setHasSearched] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Use teacher classes context
  const { classes, isLoading: isLoadingClasses, refreshClasses } = useTeacherClasses();

  // API hook for fetching monthly plan
  const {
    request: fetchPlan,
    isLoading: isLoadingPlan,
    error: planError,
    data: plan,
  } = useApi<MonthlyPlan>(monthlyPlanService.getMonthlyPlan);

  // Handle search for monthly plan
  const handleSearch = async () => {
    if (!selectedClass) {
      Toast.show({
        type: 'error',
        text1: 'Selection Required',
        text2: 'Please select a class first',
      });
      return;
    }

    setHasSearched(true);
    try {
      await fetchPlan(selectedClass._id, selectedMonth, selectedYear);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch monthly plan',
      });
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshClasses();
    if (selectedClass && hasSearched) {
      await handleSearch();
    }
    setRefreshing(false);
  };

  // Handle image press
  const handleImagePress = () => {
    if (plan?.imageUrl) {
      setIsImageViewVisible(true);
    }
  };

  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  };

  // Auto-search when class, month, or year changes
  useEffect(() => {
    if (selectedClass && hasSearched) {
      handleSearch();
    }
  }, [selectedClass, selectedMonth, selectedYear]);

  // Prepare class options for SelectModal
  const classOptions = classes.map((cls) => ({
    value: cls._id,
    label: cls.name,
    secondary: `${cls.students?.length || 0} students`,
  }));

  // Handle class selection
  const handleClassSelect = (item: { value: string; label: string; secondary?: string }) => {
    const selected = classes.find((cls) => cls._id === item.value);
    setSelectedClass(selected || null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Monthly Plan" navigation={navigation} />

      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Class Selector */}
        <View className="mb-4">
          <SelectModal
            items={classOptions}
            selectedValue={selectedClass?._id}
            placeholder="Choose a class..."
            title="Select Class"
            onSelect={handleClassSelect}
          />
        </View>

        {/* Compact Month and Year Picker */}
        <View className="mb-4 flex-row items-center space-x-3">
          <View className="flex-1">
            <Text className="mb-1 text-xs font-medium" style={{ color: colors.textSecondary }}>
              Month
            </Text>
            <TouchableOpacity
              className="rounded-lg border px-3 py-2"
              style={{ borderColor: colors.border, backgroundColor: colors.card }}
              onPress={() => {
                Alert.alert(
                  'Select Month',
                  '',
                  Array.from({ length: 12 }, (_, i) => ({
                    text: getMonthName(i + 1),
                    onPress: () => setSelectedMonth(i + 1),
                  })).concat([{ text: 'Cancel', onPress: () => {} }])
                );
              }}>
              <Text className="text-center text-sm" style={{ color: colors.textPrimary }}>
                {getMonthName(selectedMonth)}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-xs font-medium" style={{ color: colors.textSecondary }}>
              Year
            </Text>
            <TouchableOpacity
              className="rounded-lg border px-3 py-2"
              style={{ borderColor: colors.border, backgroundColor: colors.card }}
              onPress={() => {
                const currentYear = new Date().getFullYear();
                const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
                Alert.alert(
                  'Select Year',
                  '',
                  years
                    .map((year) => ({
                      text: year.toString(),
                      onPress: () => setSelectedYear(year),
                    }))
                    .concat([{ text: 'Cancel', onPress: () => {} }])
                );
              }}>
              <Text className="text-center text-sm" style={{ color: colors.textPrimary }}>
                {selectedYear}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          className="mb-6 rounded-lg py-3"
          style={{
            backgroundColor: selectedClass ? colors.primary : colors.border,
            opacity: selectedClass ? 1 : 0.6,
          }}
          onPress={handleSearch}
          disabled={!selectedClass || isLoadingPlan}>
          <Text className="text-center text-base font-semibold text-white">
            {isLoadingPlan ? 'Loading...' : 'Get Monthly Plan'}
          </Text>
        </TouchableOpacity>

        {/* Plan Content */}
        {hasSearched && (
          <View className="mb-6">
            {isLoadingPlan ? (
              <View className="items-center py-12">
                <Text className="text-base" style={{ color: colors.textSecondary }}>
                  Loading monthly plan...
                </Text>
              </View>
            ) : planError ? (
              <View
                className="items-center rounded-lg px-6 py-12"
                style={{ backgroundColor: colors.card }}>
                <Text className="mb-2 text-lg font-semibold" style={{ color: colors.error }}>
                  📋 No Plan Found
                </Text>
                <Text
                  className="text-center text-sm leading-5"
                  style={{ color: colors.textSecondary }}>
                  No monthly plan available for {getMonthName(selectedMonth)} {selectedYear}
                </Text>
              </View>
            ) : plan ? (
              <View className="rounded-lg p-4" style={{ backgroundColor: colors.card }}>
                {/* Header */}
                <View className="mb-4 items-center">
                  <Text className="text-xl font-bold" style={{ color: colors.primary }}>
                    📅 {getMonthName(selectedMonth)} {selectedYear}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    {plan.class_id.name}
                  </Text>
                </View>

                {/* Image */}
                {plan.imageUrl && (
                  <TouchableOpacity onPress={handleImagePress} className="mb-4">
                    <Image
                      source={{ uri: buildMediaUrl(plan.imageUrl) }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-2 right-2 rounded-full bg-black/50 p-2">
                      <Text className="text-xs text-white">🔍 Tap to view</Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Description */}
                <View className="mb-4">
                  <Text
                    className="mb-2 text-base font-semibold"
                    style={{ color: colors.textPrimary }}>
                    📝 Plan Details
                  </Text>
                  <Text className="text-sm leading-6" style={{ color: colors.textPrimary }}>
                    {plan.description}
                  </Text>
                </View>

                {/* Footer Info */}
                <View className="pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    👨‍🏫 Created by: {plan.createdBy.name}
                  </Text>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    📅 Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Image Viewer */}
      {plan?.imageUrl && (
        <ImageViewing
          images={[{ uri: buildMediaUrl(plan.imageUrl) }]}
          imageIndex={0}
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default MonthlyPlanScreen;
