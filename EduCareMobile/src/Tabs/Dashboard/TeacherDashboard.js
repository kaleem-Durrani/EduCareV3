import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for chevron icon

const TeacherDashboard = () => {
  const navigation = useNavigation();

  // Define button data for Teacher Dashboard
  const buttonData = [
    { name: 'ClassList', label: 'Class List', icon: 'format-list-bulleted', color: '#00796B' },
    { name: 'StudentProfile', label: 'Student Profile', icon: 'account', color: '#512DA8' },
    { name: 'EditWeeklyReport', label: 'Weekly Report', icon: 'calendar-edit', color: '#303F9F' },
    { name: 'EditMyBox', label: 'My Box', icon: 'cube', color: '#E64A19' },
    { name: 'EditMyDocuments', label: 'My Documents', icon: 'file-document-edit', color: '#C2185B' },
    { name: 'MonthlyPlanTeacher', label: 'Monthly Plan', icon: 'calendar-month', color: '#388E3C' },
    { name: 'ActivityManagement', label: 'Activity Management', icon: 'clipboard-list-outline', color: '#1976D2' },
    { name: 'WallPost', label: 'Wall Post', icon: 'wall', color: '#455A64' },
    { name: 'Notes', label: 'Notes', icon: 'note', color: '#f39c12' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
          {buttonData.map((button) => (
            <TouchableOpacity
              key={button.name}
              style={[styles.button, { backgroundColor: button.color }]}
              onPress={() => navigation.navigate(button.name)}
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
    paddingHorizontal: 15,
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
    paddingHorizontal: 20,
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
    backgroundColor: '#f9f9f9',
  },
  childImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#7b68ee',
    marginRight: 10,
  },
  childDetails: {
    flex: 1,
    paddingTop: 10,
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
    color: '#7b68ee',
    fontFamily: 'Poppins-Medium',
  },
  detailText1Upper: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
  },
});

export default TeacherDashboard;
