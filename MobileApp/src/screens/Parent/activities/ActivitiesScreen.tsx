import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { activityService, Activity } from '../../../services';

interface Props {
  navigation: any;
  route: {
    params: {
      studentId: string;
    };
  };
}

const ActivitiesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('upcoming');

  useEffect(() => {
    fetchActivities();
  }, [studentId, timeFilter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getActivitiesForParent(studentId, {
        timeFilter,
        limit: 50,
      });

      if (response.success) {
        setActivities(response.data.activities || []);
        setStudentInfo(response.data.student);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAudienceText = (activity: Activity) => {
    switch (activity.audience.type) {
      case 'all':
        return 'All Students';
      case 'class':
        return `Class: ${activity.audience.class_id?.name || 'Unknown'}`;
      case 'student':
        return `Individual: ${activity.audience.student_id?.fullName || 'Unknown'}`;
      default:
        return 'Unknown';
    }
  };

  const renderFilterButton = (filter: typeof timeFilter, label: string) => (
    <TouchableOpacity
      className={`mr-2 rounded-full px-4 py-2 ${timeFilter === filter ? 'bg-blue-500' : 'bg-gray-200'}`}
      onPress={() => setTimeFilter(filter)}>
      <Text
        className={`text-sm font-medium ${timeFilter === filter ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      className="mx-4 mb-3 rounded-lg bg-white p-4 shadow-sm"
      onPress={() => navigation.navigate('ActivityDetail', { activityId: item._id })}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
            {item.title}
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
            {item.description}
          </Text>
          <View className="mt-2 flex-row items-center">
            <Text className="text-xs font-medium" style={{ color: colors.primary }}>
              {formatDate(item.date)} at {formatTime(item.date)}
            </Text>
          </View>
          <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
            {getAudienceText(item)}
          </Text>
        </View>
        {item.color && (
          <View className="ml-2 h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="items-center pb-4 pt-4">
        <Text className="mb-2 text-xl font-bold" style={{ color: colors.primary }}>
          Centro Infantil EDUCARE
        </Text>
        <View className="h-px w-full" style={{ backgroundColor: '#000000' }} />
      </View>

      <View className="px-4 py-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.goBack()}>
          <Text className="mr-2 text-2xl">←</Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary }}>
            Activities
          </Text>
        </TouchableOpacity>
      </View>

      {studentInfo && (
        <View className="px-4 py-2">
          <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
            {studentInfo.fullName} - {studentInfo.class?.name || 'No Class'}
          </Text>
        </View>
      )}

      <View className="px-4 py-2">
        <FlatList
          horizontal
          data={[
            { filter: 'upcoming' as const, label: 'Upcoming' },
            { filter: 'today' as const, label: 'Today' },
            { filter: 'past' as const, label: 'Past' },
            { filter: 'all' as const, label: 'All' },
          ]}
          renderItem={({ item }) => renderFilterButton(item.filter, item.label)}
          keyExtractor={(item) => item.filter}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
            Loading activities...
          </Text>
        </View>
      ) : activities.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Activities Found
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            No {timeFilter === 'all' ? '' : timeFilter + ' '}activities found for this student.
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
