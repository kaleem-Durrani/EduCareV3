import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoteDetailsScreen = ({ route }) => {
  const { note } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{note.date}</Text>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.details}>{note.details}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  details: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default NoteDetailsScreen;
