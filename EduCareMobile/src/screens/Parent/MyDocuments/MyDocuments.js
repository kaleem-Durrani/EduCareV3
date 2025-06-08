import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_BASE_URL } from '@env'; // Assuming you have environment variables set up

const MyDocuments = ({ route }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      setLoading(true);
      // Get the student_id from your auth context or route params
      const studentId = route.params?.studentId; // Adjust based on your navigation setup
      
      const response = await axios.get(
        `http://tallal.info:5500/api/documents/student/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      setDocuments(response.data.documents);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDocument = async (documentId, currentStatus) => {
    // In a real application, you would implement the API call to update the document status
    // For now, we'll just update the local state
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId 
          ? { ...doc, onFile: !currentStatus }
          : doc
      )
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="MY DOCUMENTS" />
      
      <View style={styles.header}>
        <Text style={styles.heading}>Document:</Text>
        <Text style={styles.heading}>on file:</Text>
      </View>

      <View style={styles.rowsContainer}>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.row}>
            <View style={styles.documentInfo}>
              <Text style={styles.itemText}>{doc.name}</Text>
              {doc.required && (
                <Text style={styles.requiredTag}>Required</Text>
              )}
            </View>
            <CustomToggle
              isActive={doc.onFile}
              onToggle={() => toggleDocument(doc.id, doc.onFile)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// CustomToggle component remains the same
const CustomToggle = ({ isActive, onToggle }) => {
  return (
    <View style={[styles.toggleWrapper, { borderColor: isActive ? 'green' : 'red' }]}>
      <TouchableOpacity
        style={[
          styles.toggleBox,
          !isActive && styles.activeNoBox,
        ]}
        onPress={onToggle}
      >
        <Text
          style={[
            styles.toggleText,
            !isActive && styles.activeText,
            { color: isActive ? 'green' : 'white' },
          ]}
        >
          No
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleBox,
          isActive && styles.activeYesBox,
        ]}
        onPress={onToggle}
      >
        <Text
          style={[
            styles.toggleText,
            isActive && styles.activeText,
            { color: isActive ? 'white' : 'red' },
          ]}
        >
          Yes
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  documentInfo: {
    flex: 1,
  },
  requiredTag: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  heading: {
    fontSize: 15,
    color: '#4169e1',
    fontFamily: 'Poppins-SemiBold',
  },
  rowsContainer: {
    marginTop: 5,
    justifyContent:"center"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    // borderWidth:1
  },
  itemText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  toggleWrapper: {
    flexDirection: 'row',
    width: '30%',
    height: 30,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom:10
  },
  toggleBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeYesBox: {
    backgroundColor: '#4CAF50', // Green for 'Yes'
  },
  activeNoBox: {
    backgroundColor: '#F44336', // Red for 'No'
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  activeText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});

export default MyDocuments;
