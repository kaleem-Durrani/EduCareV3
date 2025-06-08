import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../../libs/theme';

const ParentDashB = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setReports([
      { id: '1', title: 'Math Report', date: '2024-11-01' },
      { id: '2', title: 'Science Report', date: '2024-10-25' },
    ]);
    setEvents([
      { id: '1', title: 'Parent-Teacher Meeting', date: '2024-11-15' },
      { id: '2', title: 'School Sports Day', date: '2024-11-20' },
    ]);
    setNotifications([
      { id: '1', message: 'New report available for John' },
      { id: '2', message: 'Upcoming event reminder: Sports Day' },
    ]);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title || item.message}</Text>
      {item.date && <Text style={styles.itemDate}>{item.date}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      
      <Text style={styles.sectionTitle}>Recent Reports</Text>
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionTitle}>Unread Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 20,
  },
  itemContainer: {
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  itemDate: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
});

export default ParentDashB;
