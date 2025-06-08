import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MonthlyPlan = ({ route }) => {
  const {classId} = route.params;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    fetchMonthlyPlan();
  }, []);

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  const formatDateRange = (startDay, endDay) => {
    return `${startDay}${getOrdinalSuffix(startDay)} - ${endDay}${getOrdinalSuffix(endDay)}`;
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const fetchMonthlyPlan = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      // const classId = await AsyncStorage.getItem('classId'); // Assuming you store classId
      
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-based
      const year = currentDate.getFullYear();

      console.log("Class ID", classId)

      const response = await axios.get(
        `http://tallal.info:5500/api/plans/monthly/${classId}?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCurrentMonth(`${getMonthName(response.data.month)} ${response.data.year}`);
      
      // Transform API data to match component structure
      const transformedActivities = response.data.activities.map(activity => ({
        date: formatDateRange(activity.startDay, activity.endDay),
        title: activity.title,
        description: activity.description,
        goals: activity.goals,
        id: activity._id // Keep the ID for potential future use
      }));

      setActivities(transformedActivities);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching monthly plan:', err);
      setError(err.response?.data?.error || 'Unable to load monthly plan');
      setLoading(false);
    }
  };

  const handleViewDetails = (activityId) => {
    // Navigate to details screen or show modal with activity details
    // navigation.navigate('ActivityDetails', { activityId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMonthlyPlan}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Monthly Plan for {currentMonth}</Text>
      
      <ScrollView style={styles.scrollContainer}>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDate}>Dates: {activity.date}</Text>
            <Text style={styles.activityDescription}>{activity.description}</Text>
            <Text style={styles.activityGoals}>Goals: {activity.goals}</Text>

            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => handleViewDetails(activity.id)}
            >
              <Text style={styles.viewMoreText}>View Details</Text>
              <Icon name="chevron-right" size={20} color="#1e88e5" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#1e88e5',
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  scrollContainer: {
    marginTop: 10,
  },
  activityCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    elevation: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  activityDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  activityGoals: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  viewMoreText: {
    color: '#1e88e5',
    fontSize: 14,
    marginRight: 8,
  },
});

export default MonthlyPlan;