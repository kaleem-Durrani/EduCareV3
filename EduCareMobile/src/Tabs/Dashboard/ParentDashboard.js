import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ParentDashboard = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the button data in an array
  const buttonData = [
    { id: '2', label: 'Basic information', icon: 'information', screen: 'BasicInformation', color: '#38B6FF' },
    { id: '3', label: 'Contacts', icon: 'contacts', screen: 'Contacts', color: '#F74190' },
    { id: '4', label: 'Weekly Menu', icon: 'fruit-watermelon', screen: 'WeeklyMenu', color: '#FB8500' },
    { id: '5', label: 'Weekly Report', icon: 'file-document', screen: 'WeeklyReport', color: '#6CB91E' },
    { id: '6', label: 'Monthly Plan', icon: 'calendar-month', screen: 'MonthlyPlan', color: '#8C52FF' },
    { id: '7', label: 'My Box', icon: 'cube', screen: 'MyBox', color: '#38B6FF' },
    { id: '8', label: 'My Documents', icon: 'file-document-multiple', screen: 'MyDocuments', color: '#F74190' },
    { id: '10', label: 'Wall', icon: 'message', screen: 'WallScreen', color: '#FB8500' },
    { id: '11', label: 'Activities', icon: 'message', screen: 'Activities', color: '#6CB91E' },
    { id: '12', label: 'Notes', icon: 'note', screen: 'Notes', color: '#8C52FF' },
    { id: '13', label: 'Lost Items', icon: 'folder', screen: 'LostItems', color: '#38B6FF' },  // Changed icon
    { id: '14', label: 'Health', icon: 'heart', screen: 'HealthScreen', color: '#F74190' }, // Changed icon
    { id: '15', label: 'Payment', icon: 'credit-card', screen: 'Payment', color: '#FB8500' }, // Changed icon
    { id: '16', label: 'Driver', icon: 'car', screen: 'Driver', color: '#6CB91E' }, // Changed icon
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Retrieve the access token from AsyncStorage
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      // Make API call to fetch students
      const response = await axios.get('http://tallal.info:5500/api/parent/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Set students and default to first student
      const fetchedStudents = response.data.students;
      setStudents(fetchedStudents);
      
      if (fetchedStudents.length > 0) {
        setCurrentStudent(fetchedStudents[0]);
        console.log("Fetched Students", currentStudent.class_id);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to fetch student information');
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }

  // If no students found
  if (students.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No students found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.headerContainer}>
        <Image source={require('../../../assets/images/EducareLogo.png')} style={styles.logo} />
        <View style={styles.divider} />
      </View>

      <View style={styles.childInfoBox}>
        <Image 
          source={
            currentStudent.photoUrl 
              ? { uri: currentStudent.photoUrl } 
              : require('../../../assets/images/Student.jpg')
          } 
          style={styles.childImage} 
        />
        <View style={styles.childDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Full Name: </Text>
            <Text style={styles.detailText1Upper}>{currentStudent.fullName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Class:</Text>
            <Text style={styles.detailText1Upper}>{currentStudent.class}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Schedule:</Text>
            <Text style={styles.detailText1Upper}>{currentStudent.schedule.days}, {currentStudent.schedule.time}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ paddingHorizontal: 13, marginTop: 10 }}>
          {buttonData.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={[styles.button, { backgroundColor: button.color }]}
              onPress={() => navigation.navigate(button.screen, { studentId: currentStudent.id, classId: currentStudent.class_id })}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons name={button.icon} size={24} color="white" />
                <Text style={styles.buttonText}>{button.label}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    width: '100%',
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  fontFamily:"Poppins-Medium",
  marginTop:5
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    // paddingHorizontal: 20,
    // paddingBottom: 10,
  },
  logo: {
    width: 180,
    height: 110,
    resizeMode: 'contain',
    marginTop: -10,
  },
  divider: {
    height: 1.3,
    backgroundColor: '#696969',
    alignSelf: 'stretch',
    marginTop: -15,
  },
  screenName: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 10,
    color: '#7b68ee',
    letterSpacing: 1,
    fontFamily: 'Poppins-Regular',
  },
  verticalLine: {
    height: 30,
    width: 1.5,
    backgroundColor: '#696969',
    marginTop: 5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default ParentDashboard;
