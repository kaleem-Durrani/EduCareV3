import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator, Alert } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BasicInfoScreen = ({ route }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract studentId from navigation params
  const { studentId } = route.params;

  useEffect(() => {
    fetchStudentBasicInfo();
  }, [studentId]);

  const fetchStudentBasicInfo = async () => {
    try {
      // Retrieve the access token from AsyncStorage
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      console.log("Student_ID", studentId)

      // Make API call to fetch student basic info
      const response = await axios.get(`http://tallal.info:5500/api/student/${studentId}/basic-info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Set student information
      setStudentInfo(response.data.basicInfo);
      setLoading(false);
      console.log("Basic Info", response.data);
    } catch (error) {
      console.error('Error fetching student basic info:', error);
      Alert.alert('Error', 'Failed to fetch student information');
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }

  // No student info
  if (!studentInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No student information found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="BASIC INFORMATION" />

      <View style={styles.childInfoBox}>
        <Image 
          source={
            studentInfo.photoUrl 
              ? { uri: studentInfo.photoUrl } 
              : require('../../../../assets/images/Student.jpg')
          } 
          style={styles.childImage} 
        />
        <View style={styles.childDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Full Name: </Text>
            <Text style={styles.detailText1Upper}>{studentInfo.fullName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Class:</Text>
            <Text style={styles.detailText1Upper}>{studentInfo.class}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Schedule:</Text>
            <Text style={styles.detailText1Upper}>
              {studentInfo.schedule.time}, {studentInfo.schedule.days}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.additionalDetailsBox}>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Full Name: </Text>
          <Text style={styles.detailText1}>{studentInfo.fullName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Age: </Text>
          <Text style={styles.detailText1}>{studentInfo.age}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Allergies: </Text>
          <Text style={styles.detailText1}>{studentInfo.allergies || 'None'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Likes: </Text>
          <Text style={styles.detailText1}>{studentInfo.likes || 'Not specified'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Additional Info: </Text>
          <Text style={styles.detailText1}>{studentInfo.additionalInfo || 'No additional information'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Authorized Photos/Videos:</Text>
          <Text style={styles.detailText1}>{studentInfo.authorizedPhotos ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0,
    paddingHorizontal:0
  },
  childInfoBox: {
    flexDirection: 'row',
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    // backgroundColor: 'red',
    marginTop:15,
    paddingHorizontal:13
  },
  childImage: {
    width: 122,
    height: 122,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4169e1',
    marginRight: 10,
  },
  childDetails: {
    flex: 1,
    // paddingTop: 10,
  },
  detailRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#7b68ee',
    fontFamily: 'Poppins-Medium',
  },
  detailText1: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
  },
  detailTextUpper: {
    fontSize: 12,
    color: '#4169e1',
    fontFamily: 'Poppins-Medium',
  },
  detailText1Upper: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
  },
  additionalDetailsBox: {
    borderColor: 'white',
    borderRadius: 10,
    padding: 15,
    // backgroundColor: '#f9f9f9',
    marginLeft: '8%',
    width: '80%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

export default BasicInfoScreen;
