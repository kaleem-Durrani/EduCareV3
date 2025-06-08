import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';

const StudentProfile = () => {
  const [studentData, setStudentData] = useState({
    name: 'Saad Malik',
    age: 8,
    grade: '10',
    contact: '+923331237890',
    documents: { birthCertificate: 'Completed', medicalRecords: 'Pending' },
    myBoxStatus: { supplies: 'Not Provided', uniform: 'Not Provided' },
    weeklyReport: { participation: 4, behavior: 5, homeworkCompletion: 4, notes: 'Good' },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editableData, setEditableData] = useState(studentData);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const handleUpdateProfile = () => {
    setStudentData(editableData);
    toggleModal();
  };

  const handleInputChange = (field, value) => {
    setEditableData({
      ...editableData,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student Profile</Text>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <Text style={styles.infoText}>Name: {studentData.name}</Text>
        <Text style={styles.infoText}>Age: {studentData.age}</Text>
        <Text style={styles.infoText}>Grade: {studentData.grade}</Text>
        <Text style={styles.infoText}>Contact: {studentData.contact}</Text>
        <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
          <Text style={styles.editButtonText}>Edit Info</Text>
        </TouchableOpacity>
      </View>

      {/* Documents Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        <Text style={styles.infoText}>Birth Certificate: {studentData.documents.birthCertificate}</Text>
        <Text style={styles.infoText}>Medical Records: {studentData.documents.medicalRecords}</Text>
        <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
          <Text style={styles.editButtonText}>Edit Documents</Text>
        </TouchableOpacity>
      </View>

      {/* My Box Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Box</Text>
        <Text style={styles.infoText}>Supplies: {studentData.myBoxStatus.supplies}</Text>
        <Text style={styles.infoText}>Uniform: {studentData.myBoxStatus.uniform}</Text>
        <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
          <Text style={styles.editButtonText}>Edit My Box</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Report */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Report</Text>
        <Text style={styles.infoText}>Participation: {studentData.weeklyReport.participation}</Text>
        <Text style={styles.infoText}>Behavior: {studentData.weeklyReport.behavior}</Text>
        <Text style={styles.infoText}>Homework Completion: {studentData.weeklyReport.homeworkCompletion}</Text>
        <Text style={styles.infoText}>Notes: {studentData.weeklyReport.notes}</Text>
        <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
          <Text style={styles.editButtonText}>Edit Weekly Report</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for editing */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Information</Text>

            {/* Editable Fields */}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editableData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Grade"
              value={editableData.grade}
              onChangeText={(value) => handleInputChange('grade', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact"
              value={editableData.contact}
              onChangeText={(value) => handleInputChange('contact', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Notes"
              value={editableData.weeklyReport.notes}
              onChangeText={(value) => handleInputChange('weeklyReport.notes', value)}
            />

            {/* Update Button */}
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default StudentProfile;

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
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#55A7B5',
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: '#55A7B5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
  },
});

