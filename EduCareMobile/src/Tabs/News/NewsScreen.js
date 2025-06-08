import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewsScreen = () => {
  const navigation = useNavigation();

  // Sample data for notes (replace this with your API data if needed)
  const [notes, setNotes] = useState([
    { id: '1', date: '2024-11-01', title: 'Parent-Teacher Meeting', details: 'A meeting will be held on Nov 5.' },
    { id: '2', date: '2024-10-28', title: 'Math Quiz', details: 'Math quiz for Grade 5 on Nov 2.' },
    { id: '3', date: '2024-10-20', title: 'School Trip', details: 'School trip to the museum on Oct 25.' },
  ]);

  // Render each item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      // onPress={() => navigation.navigate('NoteDetailsScreen', { note: item })}
    >
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noteItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NewsScreen;
