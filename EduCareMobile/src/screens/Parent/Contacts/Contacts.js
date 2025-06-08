import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Contacts = ({ route }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract studentId from navigation params
  const { studentId } = route.params;

  const dummyImage = require('../../../../assets/images/dummy.png');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // const studentId = await AsyncStorage.getItem('currentStudentId');
        const token = await AsyncStorage.getItem('accessToken');

        if (!studentId || !token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`http://tallal.info:5500/api/student/${studentId}/basic-info`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch student data');
        }

        const data = await response.json();
        setStudentData(data.basicInfo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handlePhonePress = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsAppPress = (phone) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `whatsapp://send?phone=${cleanedPhone}`;
    Linking.openURL(whatsappUrl);
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image 
        source={item.photoUrl ? { uri: item.photoUrl } : dummyImage} 
        style={styles.contactImage} 
      />
      <View style={styles.contactInfoContainer}>
        <View style={styles.contactDetail}>
          <Text style={styles.detailText}>{item.relatioin}</Text>
        </View>
        <View style={styles.contactDetail}>
          <Text style={styles.detailText1}>{item.name}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handlePhonePress(item.phone)}>
            <Icon name="phone" size={20} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleWhatsAppPress(item.phone)} style={{marginLeft:12}}>
            <Icon name="whatsapp" size={20} color="#25D366" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainContainer}>
        <CustomHeader title="CONTACTS" />
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!studentData) {
    return (
      <View style={styles.mainContainer}>
        <CustomHeader title="CONTACTS" />
        <Text style={styles.noDataText}>No student data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title="CONTACTS" />

      <View style={styles.childInfoBox}>
        <Image 
          source={studentData.photoUrl ? { uri: studentData.photoUrl } : require('../../../../assets/images/Student.jpg')} 
          style={styles.childImage} 
        />
        <View style={styles.childDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Full Name: </Text>
            <Text style={styles.detailText1Upper}>{studentData.fullName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Class:</Text>
            <Text style={styles.detailText1Upper}>{studentData.class}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Schedule:</Text>
            <Text style={styles.detailText1Upper}>
              {studentData.schedule.time}, {studentData.schedule.days}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={studentData.contacts}
        keyExtractor={(item) => item.phone}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListEmptyComponent={<Text style={styles.noDataText}>No contacts available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0,
    paddingHorizontal:0
  },
  container: {
    // paddingVertical: 16,
    paddingHorizontal:14
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // marginBottom: 10,
    // borderWidth:1
  },
  contactImage: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#4169e1',
  },
  contactInfoContainer: {
    flexDirection: 'column',
    flex: 1,
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
    color: '#4169e1',
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



  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    // marginLeft: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Poppins-Medium'
  },
});

export default Contacts;
