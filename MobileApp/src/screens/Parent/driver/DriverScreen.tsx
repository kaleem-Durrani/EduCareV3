import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts';
import { driverService, ParentDriverInfo } from '../../../services';

interface Props {
  navigation: any;
  route: {
    params: {
      studentId: string;
    };
  };
}

const DriverScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { studentId } = route.params;

  const [driverInfo, setDriverInfo] = useState<ParentDriverInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverInfo();
  }, [studentId]);

  const fetchDriverInfo = async () => {
    try {
      setLoading(true);
      const response = await driverService.getDriverForParent(studentId);

      if (response.success) {
        setDriverInfo(response.data);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch driver information');
      }
    } catch (error) {
      console.error('Error fetching driver info:', error);
      Alert.alert('Error', 'Failed to fetch driver information');
    } finally {
      setLoading(false);
    }
  };

  const handleCallDriver = () => {
    if (driverInfo?.phone) {
      Linking.openURL(`tel:${driverInfo.phone}`);
    }
  };

  const handleCallEmergency = () => {
    if (driverInfo?.emergencyContact?.phone) {
      Linking.openURL(`tel:${driverInfo.emergencyContact.phone}`);
    }
  };

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mx-4 mb-4 rounded-lg bg-white p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold" style={{ color: colors.primary }}>
        {title}
      </Text>
      {children}
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="mb-2 flex-row justify-between">
      <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
        {label}:
      </Text>
      <Text className="text-sm" style={{ color: colors.textPrimary }}>
        {value}
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
            Driver & Transportation
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
            Loading driver information...
          </Text>
        </View>
      ) : !driverInfo ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: colors.textPrimary }}>
            No Driver Assigned
          </Text>
          <Text className="mt-2 text-center text-sm" style={{ color: colors.textSecondary }}>
            No driver has been assigned to this student yet.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Driver Information */}
          <InfoCard title="Driver Information">
            <View className="mb-3 flex-row items-center">
              {driverInfo.photoUrl ? (
                <Image source={{ uri: driverInfo.photoUrl }} className="h-16 w-16 rounded-full" />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-300">
                  <Text className="text-lg font-bold text-gray-600">
                    {driverInfo.name.charAt(0)}
                  </Text>
                </View>
              )}
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  {driverInfo.name}
                </Text>
                <TouchableOpacity onPress={handleCallDriver}>
                  <Text className="text-base font-medium" style={{ color: colors.primary }}>
                    📞 {driverInfo.phone}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </InfoCard>

          {/* Vehicle Information */}
          <InfoCard title="Vehicle Information">
            <View className="mb-3 flex-row items-center">
              {driverInfo.vehicle.photoUrl ? (
                <Image
                  source={{ uri: driverInfo.vehicle.photoUrl }}
                  className="h-16 w-20 rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-16 w-20 items-center justify-center rounded-lg bg-gray-300">
                  <Text className="text-xs text-gray-600">🚐</Text>
                </View>
              )}
              <View className="ml-4 flex-1">
                <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                  {driverInfo.vehicle.make} {driverInfo.vehicle.model}
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Plate: {driverInfo.vehicle.plateNumber}
                </Text>
                {driverInfo.vehicle.color && (
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Color: {driverInfo.vehicle.color}
                  </Text>
                )}
              </View>
            </View>
          </InfoCard>

          {/* Route Information */}
          <InfoCard title="Route Information">
            <InfoRow label="Route Name" value={driverInfo.route.name} />
            {driverInfo.route.description && (
              <InfoRow label="Description" value={driverInfo.route.description} />
            )}
          </InfoCard>

          {/* Schedule */}
          <InfoCard title="Schedule">
            <InfoRow label="Pickup Time" value={driverInfo.schedule.pickupTime} />
            <InfoRow label="Dropoff Time" value={driverInfo.schedule.dropoffTime} />
            <InfoRow label="Working Days" value={driverInfo.schedule.workingDays.join(', ')} />
          </InfoCard>

          {/* Student Assignment */}
          <InfoCard title="Your Child's Stops">
            <InfoRow label="Pickup Stop" value={driverInfo.studentAssignment.pickupStop} />
            <InfoRow label="Dropoff Stop" value={driverInfo.studentAssignment.dropoffStop} />
          </InfoCard>

          {/* Emergency Contact */}
          {driverInfo.emergencyContact && (
            <InfoCard title="Emergency Contact">
              <InfoRow label="Name" value={driverInfo.emergencyContact.name || 'Not specified'} />
              {driverInfo.emergencyContact.phone && (
                <View className="mb-2 flex-row justify-between">
                  <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Phone:
                  </Text>
                  <TouchableOpacity onPress={handleCallEmergency}>
                    <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                      📞 {driverInfo.emergencyContact.phone}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {driverInfo.emergencyContact.relationship && (
                <InfoRow label="Relationship" value={driverInfo.emergencyContact.relationship} />
              )}
            </InfoCard>
          )}

          <View className="h-8" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DriverScreen;
