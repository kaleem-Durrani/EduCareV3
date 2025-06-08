import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../../../components/CustomHeader';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
};

const HealthScreen = ({ route }) => {
  const [activeTab, setActiveTab] = useState('HeightWeight');
  const [healthInfo, setHealthInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month'); // week, month, year

  // Assuming student_id is passed through navigation or stored in context
  const {studentId} = route.params;

  const fetchHealthInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token management
      const baseUrl = 'http://tallal.info:5500'; // Replace with your API base URL
      
      const response = await axios.get(`${baseUrl}/api/health/info/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setHealthInfo(response.data.data);
      } else {
        setError('Failed to fetch health information');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch health information');
    }
  };

  const fetchMetrics = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const baseUrl = 'http://tallal.info:5500';
      
      const response = await axios.get(
        `${baseUrl}/api/health/metrics/${studentId}?period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setMetrics(response.data.data);
      } else {
        setError('Failed to fetch health metrics');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch health metrics');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchHealthInfo(), fetchMetrics()]);
      } catch (err) {
        setError('Failed to fetch health data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, period]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5AB3A9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => fetchData()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatChartData = (data, type) => {
    if (!data || !data[type] || !data[type].values || !data[type].labels) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }

    return {
      labels: data[type].labels,
      datasets: [{
        data: data[type].values,
        color: (opacity = 1) => type === 'height' 
          ? `rgba(0, 123, 255, ${opacity})`
          : `rgba(255, 99, 71, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="MY HEALTH" />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'HeightWeight' && styles.activeTab]}
          onPress={() => setActiveTab('HeightWeight')}
        >
          <Icon name="human-male-height" size={20} color={activeTab === 'HeightWeight' ? 'white' : '#555'} />
          <Text style={[styles.tabText, activeTab === 'HeightWeight' && { color: 'white' }]}>Height & Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Information' && styles.activeTab]}
          onPress={() => setActiveTab('Information')}
        >
          <Icon name="information" size={20} color={activeTab === 'Information' ? 'white' : '#555'} />
          <Text style={[styles.tabText, activeTab === 'Information' && { color: 'white' }]}>Information</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'HeightWeight' && (
          <ScrollView>
            {/* Period Selection */}
            <View style={styles.periodContainer}>
              {['week', 'month', 'year'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodButton, period === p && styles.activePeriod]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[styles.periodText, period === p && styles.activePeriodText]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Height Chart</Text>
            <LineChart
              data={formatChartData(metrics, 'height')}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
            <Text style={styles.sectionTitle}>Weight Chart</Text>
            <LineChart
              data={formatChartData(metrics, 'weight')}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </ScrollView>
        )}

        {activeTab === 'Information' && (
          <ScrollView>
            <Text style={styles.sectionTitle}>Health Information</Text>
            <View style={styles.card}>
              {healthInfo && Object.entries(healthInfo).map(([key, value], index) => (
                <View key={index} style={styles.row}>
                  <View style={styles.labelContainer}>
                    <Icon 
                      name={getIconForKey(key)} 
                      size={20} 
                      color="#5AB3A9" 
                      style={styles.icon} 
                    />
                    <Text style={styles.label}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                    </Text>
                  </View>
                  <Text style={styles.value}>{value || '-'}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default HealthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#D9E8E7',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 13,
    marginTop: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  activeTab: {
    backgroundColor: '#5AB3A9',
  },
  tabText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 10,
    color: '#4169e1',
    fontFamily: 'Poppins-SemiBold',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  card: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
});
