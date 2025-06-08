import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditMyBox = ({ route }) => {
  const { studentId } = route.params; // Get studentId from navigation params
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isReminderActive, setIsReminderActive] = useState(false);

  useEffect(() => {
    const fetchBoxItems = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found. Please login.');
        }

        const itemsResponse = await fetch(
          `http://tallal.info:5500/api/box/items`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!itemsResponse.ok) {
          const errorData = await itemsResponse.json();
          throw new Error(errorData.error || `HTTP error! status: ${itemsResponse.status}`);
        }

        const initialItems = await itemsResponse.json();


        const statusResponse = await fetch(
          `YOUR_API_BASE_URL/api/box/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!statusResponse.ok) {
           const errorData = await statusResponse.json();
          throw new Error(errorData.error || `HTTP error! status: ${statusResponse.status}`);
        }

        const studentStatus = await statusResponse.json();

        // Combine initial items with student-specific status
        const combinedItems = initialItems.map(item => {
          const matchingStatus = studentStatus.find(statusItem => statusItem.name === item.name);
          return {
            ...item,
            status: matchingStatus ? (matchingStatus.inStock ? 'YES' : 'NO') : (item.inStock ? 'YES' : 'NO'), // Default to inStock if no status
          };
        });

        setItems(combinedItems);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching box items:", err);
        Alert.alert("Error", err.message);
      }
    };

    fetchBoxItems();
  }, [studentId]); // Fetch when the component mounts or studentId changes

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
    setNewStatus(item.status);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
    setIsModalVisible(false);
    setNewStatus('');
  };

  const updateItemStatus = async (itemName) => { // Use itemName instead of itemId
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found. Please login.');
      }

      const response = await fetch(
        `YOUR_API_BASE_URL/api/box/student/${studentId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ [itemName]: newStatus === 'YES' }), // Send item name and boolean status
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Update the local state
      const updatedItems = items.map((item) =>
        item.name === itemName ? { ...item, status: newStatus } : item
      );
      setItems(updatedItems);

      closeItemDetails();

      if (newStatus === 'NO') {
        setIsReminderActive(true);
      } else {
        setIsReminderActive(false); // Deactivate reminder if status is YES
      }
    } catch (err) {
      console.error("Error updating box status:", err);
      Alert.alert("Error", err.message);
    }
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.status === 'NO' ? styles.noItem : styles.yesItem]}
      onPress={() => openItemDetails(item)}
    >
      <Text style={styles.itemTitle}>{item.name}</Text> {/* Display item.name */}
      <Text style={styles.itemStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit My Box</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()} // Use index as key if no unique ID
        renderItem={renderItem}
        contentContainerStyle={styles.itemList}
      />

      {/* Item Details Modal */}
      {selectedItem && (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text> {/* Display item.name */}
              {/* <Text style={styles.modalDetails}>{selectedItem.details}</Text>  */} {/* Remove details if not needed */}
              <TextInput
                style={styles.statusInput}
                value={newStatus}
                onChangeText={setNewStatus}
                placeholder="Enter status (YES/NO)"
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => updateItemStatus(selectedItem.name)} // Pass item.name
              >
                <Text style={styles.updateButtonText}>Update Status</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeItemDetails}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Reminder Notification */}
      {isReminderActive && (
        <View style={styles.reminderContainer}>
          <Icon name="bell-ring" size={24} color="#FF9800" />
          <Text style={styles.reminderText}>You have items marked "NO". Daily reminders will be sent to parents.</Text>
        </View>
      )}
    </View>
  );
};

export default EditMyBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemList: {
    paddingBottom: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  noItem: {
    backgroundColor: '#FFCDD2', // Red background for items marked "NO"
  },
  yesItem: {
    backgroundColor: '#C8E6C9', // Green background for items marked "YES"
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemStatus: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#55A7B5',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
  },
  reminderText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#FF9800',
  },
});
