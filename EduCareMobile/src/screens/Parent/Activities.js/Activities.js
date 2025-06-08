import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActivitiesScreen = ({ route }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Assuming you have the class_id from navigation or context
  const classId = route.params; // Replace with actual class ID source
  
  const fetchActivities = async (month = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('accessToken') // Replace with your actual token management
      const baseUrl = 'http://tallal.info:5500'; // Replace with your API base URL
      
      let url = `${baseUrl}/api/activities/${classId}`;
      if (month) {
        url += `?month=${month}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Transform API data to match your component's format
        const formattedActivities = response.data.activities.map(activity => ({
          id: activity._id,
          month: activity.month,
          date: new Date(activity.date).getDate().toString(),
          day: new Date(activity.date).toLocaleString('en-US', { weekday: 'short' }),
          title: activity.title,
          description: activity.description,
          dayColor: getDayColor(new Date(activity.date).getDay()) // Helper function to get color
        }));
        
        setActivities(formattedActivities);
      } else {
        setError('Failed to fetch activities');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get day colors
  const getDayColor = (dayIndex) => {
    const colors = {
      0: '#e74c3c', // Sunday
      1: '#f39c12', // Monday
      2: '#2ecc71', // Tuesday
      3: '#3498db', // Wednesday
      4: '#ff6347', // Thursday
      5: '#3498db', // Friday
      6: '#9b59b6'  // Saturday
    };
    return colors[dayIndex];
  };

  useEffect(() => {
    fetchActivities();
  }, [classId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => fetchActivities()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomHeader title="ACTIVITIES" />
      <View style={{marginTop:20}}/>
      {activities.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          {/* Date Section */}
          <View style={styles.dateContainer}>
            <Text style={styles.monthText}>{activity.month}</Text>
            <Text style={styles.dateText}>{activity.date}</Text>
            <View style={[styles.dayContainer, { backgroundColor: activity.dayColor }]}>
              <Text style={styles.dayText}>{activity.day}</Text>
            </View>
          </View>

          {/* Activity Content */}
          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <View style={styles.dot} />
              <Text style={styles.activityTitle}>{activity.title}</Text>
            </View>
            <Text style={styles.activityDescription}>{activity.description}</Text>
          </View>

          {/* Read Button */}
          <TouchableOpacity 
            style={styles.readButton} 
            onPress={() => navigation.navigate('ActivitiesDetail', { activity })}
          >
            <Text style={styles.readButtonText}>Read →</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: 16,
    backgroundColor: 'white',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    position: 'relative',
 borderBottomWidth:0.5,
 borderBottomColor:"#333",
 paddingBottom:15,
 padding: 16,
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 12,
    borderWidth:0.5,
    borderColor:"grey",
    borderRadius:5,
    width:"18%",
    paddingTop:5
  },
  monthText: {
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    color: '#333',
    
  },
  dateText: {
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginVertical:-6
  },
  dayContainer: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 4,
    width:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#4169E1',
    borderRadius: 4,
    marginRight: 6,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4169E1',
  },
  activityDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  readButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4169E1',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  readButtonText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: '#ff0000',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 14,
  },
});

export default ActivitiesScreen;
