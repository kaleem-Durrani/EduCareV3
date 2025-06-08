import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

const ActivitiesScreen = () => {
  const navigation = useNavigation()
  const activities = [
    {
      id: 1,
      month: 'Aug',
      date: '15',
      day: 'Thu',
      title: 'Going to the movies',
      description: 'Lorem ipsum dolor sit amet. Non esse eius At omnis ratione sit ...',
      dayColor: '#ff6347', // Color for Thursday
    },
    {
      id: 2,
      month: 'Aug',
      date: '19',
      day: 'Mon',
      title: 'Activity 2',
      description: 'Lorem ipsum dolor sit amet. Non esse eius At omnis ratione sit ...',
      dayColor: '#f39c12', // Color for Monday
    },
    {
      id: 3,
      month: 'Sep',
      date: '05',
      day: 'Fri',
      title: 'Visit the Science Fair',
      description: 'Lorem ipsum dolor sit amet. Non esse eius At omnis ratione sit ...',
      dayColor: '#3498db', // Color for Friday
    },
    {
      id: 4,
      month: 'Sep',
      date: '10',
      day: 'Tue',
      title: 'Art and Craft Workshop',
      description: 'Lorem ipsum dolor sit amet. Non esse eius At omnis ratione sit ...',
      dayColor: '#2ecc71', // Color for Tuesday
    },
  ];

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
          <TouchableOpacity style={styles.readButton} 
      onPress={() => navigation.navigate('ActivitiesDetail')}
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
    padding: 16,
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
    backgroundColor: '#4169e1',
    borderRadius: 4,
    marginRight: 6,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4169e1',
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
    backgroundColor: '#4169e1',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  readButtonText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
});

export default ActivitiesScreen;
