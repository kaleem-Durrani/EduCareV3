import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing and retrieving JWT

const ClassList = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken'); // Retrieve JWT from storage

        if (!token) {
          throw new Error('No token found. Please login.');
        }

        const response = await fetch(
          `http://tallal.info:5500/api/students?page=${page}&per_page=${perPage}`, // Replace with your API base URL
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include JWT in the Authorization header
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Try to parse error response
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStudents(data.students);
        setTotalStudents(data.total_students);
        setTotalPages(data.total_pages);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching students:", err); // Log the error for debugging
        Alert.alert("Error", err.message); // Display error message to the user
      }
    };

    fetchStudents();
  }, [page, perPage]); // Fetch data when page or perPage changes

  const handleSelectStudent = (student) => {
    navigation.navigate('StudentProfile', { student });
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.studentItem}
      onPress={() => handleSelectStudent(item)}
    >
      <Text style={styles.studentName}>{item.fullName}</Text>
      {/* Assuming 'grade' is directly available after API integration */}
      <Text style={styles.studentGrade}>{item.class || "Grade Not Available"} {item.section}</Text> 
    </TouchableOpacity>
  );

  const loadMoreStudents = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Display loading indicator
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>; // Display error message
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class List</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item._id} // Use the _id from the API
        renderItem={renderStudentItem}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMoreStudents} // Load more when reaching the end
        onEndReachedThreshold={0.5} // Trigger load more when 50% of the list is visible
      />
       {/* Pagination Controls */}
       <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          <Text>Previous</Text>
        </TouchableOpacity>
        <Text>{page} / {totalPages}</Text>
        <TouchableOpacity onPress={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ClassList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  studentItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentGrade: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});
