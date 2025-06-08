import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TeacherDashB = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>

      {/* Shortcuts/Action Cards */}
      <View style={styles.shortcutsContainer}>
        {/* Class List Shortcut */}
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('ClassList')}>
          <Icon name="account-group" size={30} color="#fff" />
          <Text style={styles.cardText}>Class List</Text>
        </TouchableOpacity>

        {/* Attendance Shortcut */}
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('Attendance')}>
          <Icon name="clipboard-list" size={30} color="#fff" />
          <Text style={styles.cardText}>Attendance</Text>
        </TouchableOpacity>

        {/* Recent Posts Shortcut */}
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('RecentPosts')}>
          <Icon name="post" size={30} color="#fff" />
          <Text style={styles.cardText}>Recent Posts</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Today's Overview</Text>
        
        {/* Attendance Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Today's Attendance: 25/30</Text>
        </View>

        {/* Recent Activities Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Recent Posts: 3 New</Text>
        </View>
      </View>
    </View>
  );
};

export default TeacherDashB;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#55A7B5',
    padding: 20,
    borderRadius: 10,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  cardText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  summaryContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
  },
});
