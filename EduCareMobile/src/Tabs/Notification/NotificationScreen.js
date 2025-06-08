import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample data for notifications
const notifications = [
  {
    id: 1,
    title: 'Missing Items Reminder',
    message: 'You have not submitted the required medical form for your child.',
    date: '2024-11-10',
    type: 'reminder',
  },
  {
    id: 2,
    title: 'New Post from Teacher',
    message: 'The class wall has been updated with a new photo of the field trip!',
    date: '2024-11-12',
    type: 'update',
  },
  {
    id: 3,
    title: 'Upcoming Event Reminder',
    message: "Don't forget to sign the permission slip for the upcoming field trip.",
    date: '2024-11-13',
    type: 'reminder',
  },
  {
    id: 4,
    title: 'Homework Due Tomorrow',
    message: 'Math assignment on fractions is due tomorrow. Submit it on time!',
    date: '2024-11-14',
    type: 'reminder',
  },
  {
    id: 5,
    title: 'New School Announcement',
    message: 'The school will be closed on November 15 due to maintenance work.',
    date: '2024-11-14',
    type: 'update',
  },
  {
    id: 6,
    title: 'Monthly Fee Reminder',
    message: 'Your child’s monthly fee payment is due by November 20.',
    date: '2024-11-15',
    type: 'reminder',
  },
];


const NotificationsScreen = () => {
  const [notificationList, setNotificationList] = useState(notifications);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.notificationCard} onPress={() => handleNotificationClick(item)}>
      <View style={styles.iconContainer}>
        <Icon
          name={item.type === 'reminder' ? 'bell-alert' : 'message-text'}
          size={25}
          color={item.type === 'reminder' ? '#e74c3c' : '#3498db'}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notificationList}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.notificationList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  notificationList: {
    marginTop: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    // padding: 16,
    paddingVertical:6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    height:87,
    paddingHorizontal:5
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:10
  },
  notificationContent: {
    flex: 1,
    // borderWidth:1
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#34495e',
    marginBottom:-5

  },
  notificationMessage: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7f8c8d',
    // marginVertical: 4,
  },
  notificationDate: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#95a5a6',
    marginTop:-3
  },
});

export default NotificationsScreen;
