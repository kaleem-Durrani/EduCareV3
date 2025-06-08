import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NoteDetails = ({ route, navigation }) => {
  const { note } = route.params; // Retrieve the note passed from the Notes screen

  return (
    <View style={styles.container}>
      <View style={styles.noteContainer}>
        <Text style={styles.noteDate}>{note.date}</Text>
        <Text style={styles.noteStudent}>{note.student}</Text>
        <Text style={styles.noteContent}>{note.content}</Text>
      </View>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Notes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoteDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  noteContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  noteDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  noteStudent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noteContent: {
    fontSize: 16,
    color: '#555',
  },
  backButton: {
    backgroundColor: '#55A7B5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
