import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditMyDocuments = () => {
  const [documents, setDocuments] = useState([
    { id: '1', title: 'Birth Certificate', status: 'Incomplete', details: 'Missing signed birth certificate.' },
    { id: '2', title: 'Immunization Record', status: 'Complete', details: 'Full vaccination record submitted.' },
    { id: '3', title: 'Health Screening Report', status: 'Incomplete', details: 'Awaiting report from doctor.' },
  ]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isReminderActive, setIsReminderActive] = useState(false);

  const openDocumentDetails = (document) => {
    setSelectedDocument(document);
    setIsModalVisible(true);
    setNewStatus(document.status);
  };

  const closeDocumentDetails = () => {
    setSelectedDocument(null);
    setIsModalVisible(false);
    setNewStatus('');
  };

  const updateDocumentStatus = (documentId) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === documentId ? { ...doc, status: newStatus } : doc
    );
    setDocuments(updatedDocuments);
    closeDocumentDetails();

    // If a document is marked as "Incomplete," enable reminders.
    if (newStatus === 'Incomplete') {
      setIsReminderActive(true);
    }
  };

  const renderDocumentItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.documentItem, item.status === 'Incomplete' ? styles.incompleteItem : styles.completeItem]}
      onPress={() => openDocumentDetails(item)}
    >
      <Text style={styles.documentTitle}>{item.title}</Text>
      <Text style={styles.documentStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit My Documents</Text>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={renderDocumentItem}
        contentContainerStyle={styles.documentList}
      />

      {/* Document Details Modal */}
      {selectedDocument && (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedDocument.title}</Text>
              <Text style={styles.modalDetails}>{selectedDocument.details}</Text>
              <TextInput
                style={styles.statusInput}
                value={newStatus}
                onChangeText={setNewStatus}
                placeholder="Enter status (Complete/Incomplete)"
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => updateDocumentStatus(selectedDocument.id)}
              >
                <Text style={styles.updateButtonText}>Update Status</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeDocumentDetails}>
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
          <Text style={styles.reminderText}>You have missing documents. Daily reminders will be sent to parents.</Text>
        </View>
      )}
    </View>
  );
};

export default EditMyDocuments;

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
  documentList: {
    paddingBottom: 10,
  },
  documentItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  incompleteItem: {
    backgroundColor: '#FFCDD2', // Red background for incomplete items
  },
  completeItem: {
    backgroundColor: '#C8E6C9', // Green background for complete items
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  documentStatus: {
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
