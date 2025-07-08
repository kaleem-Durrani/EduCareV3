import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { healthService, HealthMetric, HealthInfo } from '../../../services';

interface Props {
  navigation: any;
  route: {
    params: {
      studentId: string;
    };
  };
}

const HealthScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    fetchHealthData();
  }, [studentId]);

  const fetchHealthData = async () => {
    try {
      setLoading(true);

      // Fetch both health metrics and health info
      const [metricsResponse, infoResponse] = await Promise.all([
        healthService.getHealthMetrics(studentId, { limit: 20 }),
        healthService.getHealthInfo(studentId),
      ]);

      if (metricsResponse.success) {
        setHealthMetrics(metricsResponse.data.metrics || []);
        setStudentInfo(metricsResponse.data.student);
      }

      if (infoResponse.success) {
        setHealthInfo(infoResponse.data);
      }

      if (!metricsResponse.success && !infoResponse.success) {
        Alert.alert('Error', 'Failed to fetch health data');
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
      Alert.alert('Error', 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHealthData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLatestMetric = (type: string) => {
    return healthMetrics
      .filter((metric) => metric.type === type)
      .sort((a, b) => new Date(b.recordedDate).getTime() - new Date(a.recordedDate).getTime())[0];
  };

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mx-4 mb-4 rounded-lg bg-white p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold" style={{ color: colors.primary }}>
        {title}
      </Text>
      {children}
    </View>
  );

  const MetricRow = ({ label, metric }: { label: string; metric?: HealthMetric }) => (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
        {label}:
      </Text>
      <View className="items-end">
        {metric ? (
          <>
            <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
              {metric.value} {metric.unit}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {formatDate(metric.recordedDate)}
            </Text>
          </>
        ) : (
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            No data
          </Text>
        )}
      </View>
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | string[] }) => (
    <View className="mb-2">
      <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
        {label}:
      </Text>
      <Text className="text-base" style={{ color: colors.textPrimary }}>
        {Array.isArray(value) ? value.join(', ') || 'None' : value || 'Not specified'}
      </Text>
    </View>
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
            Health Information
          </Text>
        </TouchableOpacity>
      </View>

      {studentInfo && (
        <View className="px-4 py-2">
          <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
            {studentInfo.fullName} - Roll #{studentInfo.rollNum}
          </Text>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
            Loading health information...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }>
          {/* Latest Measurements */}
          <InfoCard title="Latest Measurements">
            <MetricRow label="Height" metric={getLatestMetric('height')} />
            <MetricRow label="Weight" metric={getLatestMetric('weight')} />
            <MetricRow label="BMI" metric={getLatestMetric('bmi')} />
          </InfoCard>

          {/* Health Information */}
          {healthInfo && (
            <>
              <InfoCard title="Medical Information">
                <InfoRow label="Blood Type" value={healthInfo.bloodType || 'Not specified'} />
                <InfoRow label="Allergies" value={healthInfo.allergies} />
                <InfoRow label="Medications" value={healthInfo.medications} />
                <InfoRow label="Medical Conditions" value={healthInfo.medicalConditions} />
                {healthInfo.notes && <InfoRow label="Notes" value={healthInfo.notes} />}
              </InfoCard>

              <InfoCard title="Emergency Contact">
                <InfoRow
                  label="Name"
                  value={healthInfo.emergencyContact?.name || 'Not specified'}
                />
                <InfoRow
                  label="Phone"
                  value={healthInfo.emergencyContact?.phone || 'Not specified'}
                />
                <InfoRow
                  label="Relationship"
                  value={healthInfo.emergencyContact?.relationship || 'Not specified'}
                />
              </InfoCard>

              {healthInfo.doctorInfo && (
                <InfoCard title="Doctor Information">
                  <InfoRow label="Doctor Name" value={healthInfo.doctorInfo.name} />
                  <InfoRow label="Phone" value={healthInfo.doctorInfo.phone} />
                  <InfoRow label="Clinic" value={healthInfo.doctorInfo.clinic} />
                </InfoCard>
              )}
            </>
          )}

          {/* Recent Measurements History */}
          {healthMetrics.length > 0 && (
            <InfoCard title="Recent Measurements">
              {healthMetrics.slice(0, 5).map((metric) => (
                <View key={metric._id} className="mb-3 border-b border-gray-200 pb-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                      {metric.type.charAt(0).toUpperCase() + metric.type.slice(1)}
                    </Text>
                    <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                      {metric.value} {metric.unit}
                    </Text>
                  </View>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    {formatDate(metric.recordedDate)} by {metric.recordedBy.name}
                  </Text>
                  {metric.notes && (
                    <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                      {metric.notes}
                    </Text>
                  )}
                </View>
              ))}
            </InfoCard>
          )}

          <View className="h-8" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HealthScreen;
