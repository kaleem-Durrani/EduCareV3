import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useParentChildren } from '../../../contexts';
import { useApi } from '../../../hooks';
import { parentService, ParentStudent, StudentBoxStatus } from '../../../services';
import { LoadingScreen, ScreenHeader } from '../../../components';
import { ChildSelector, ParentBoxStatusContent } from './components';

const MyBoxScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedChild, setSelectedChild] = useState<ParentStudent | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use parent children context
  const {
    children,
    isLoading: isLoadingChildren,
    error: childrenError,
    refreshChildren,
  } = useParentChildren();

  // API hook for fetching child's box status
  const {
    request: fetchChildBoxStatus,
    isLoading: isLoadingBox,
    error: boxError,
    data: boxStatus,
  } = useApi<StudentBoxStatus>(parentService.getChildBoxStatus);

  const handleChildSelect = async (child: ParentStudent) => {
    setSelectedChild(child);
    setHasSearched(true);
    await fetchChildBoxStatus(child._id);
  };

  const handleResetSelection = () => {
    setSelectedChild(null);
    setHasSearched(false);
  };

  if (isLoadingChildren) {
    return <LoadingScreen message="Loading your children..." />;
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="My Box" navigation={navigation} showBackButton={true} />

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {childrenError ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="mb-2 text-center text-lg" style={{ color: colors.textPrimary }}>
              Failed to load children
            </Text>
            <Text className="mb-4 text-center text-sm" style={{ color: colors.textSecondary }}>
              {childrenError}
            </Text>
            <TouchableOpacity
              className="rounded-lg bg-blue-500 px-6 py-3"
              onPress={refreshChildren}>
              <Text className="font-medium text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Child Selector */}
            <ChildSelector
              children={children}
              selectedChild={selectedChild}
              onChildSelect={handleChildSelect}
              onResetSelection={handleResetSelection}
              isLoading={isLoadingBox}
            />

            {/* Box Status Content */}
            {hasSearched && (
              <ParentBoxStatusContent
                selectedChild={selectedChild}
                boxStatus={boxStatus}
                isLoading={isLoadingBox}
                error={boxError}
                onRetry={() => selectedChild && fetchChildBoxStatus(selectedChild._id)}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBoxScreen;
