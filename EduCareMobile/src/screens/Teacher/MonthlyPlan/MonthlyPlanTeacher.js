import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import CustomHeader from '../../../components/CustomHeader';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MonthlySlider = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    class_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    activities: [],
  });
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token retrieval logic
      const response = await fetch('http://tallal.info:5500/api/classes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data.classes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async (classId, month, year) => {
    if (!classId) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token retrieval logic
      const url = `http://tallal.info:5500/api/plans/monthly/${classId}?month=${month}&year=${year}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setPlans([]);
          return;
        }
        throw new Error('Failed to fetch plans');
      }

      const data = await response.json();
      setPlans([data]);
    } catch (err) {
      setError(err.message);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchPlans(selectedClass.id, formData.month, formData.year);
    }
  }, [selectedClass, formData.month, formData.year]);

  const handleCreatePlan = async (e) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token retrieval logic
      const response = await fetch('http://tallal.info:5500/api/plans/monthly', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          class_id: selectedClass.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create plan');
      setIsCreateModalOpen(false);
      await fetchPlans(selectedClass.id, formData.month, formData.year);
      setFormData({
        class_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        activities: [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token retrieval logic
      const response = await fetch(`http://tallal.info:5500/api/plans/monthly/${formData.planId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update plan');
      setIsEditModalOpen(false);
      fetchPlans(formData.class_id, formData.month, formData.year);
      setFormData({
        class_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        activities: [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedActivities = [...prevFormData.activities];
      updatedActivities[index][field] = value;
      return { ...prevFormData, activities: updatedActivities };
    });
  };

  const handleAddActivity = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      activities: [...prevFormData.activities, { date: '', title: '', description: '', goals: '' }],
    }));
  };

  const handleDeleteActivity = (index) => {
    setFormData((prevFormData) => {
      const updatedActivities = prevFormData.activities.filter((_, i) => i !== index);
      return { ...prevFormData, activities: updatedActivities };
    });
  };

  const handleDeletePlan = async (planId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token retrieval logic
      const response = await fetch(`http://tallal.info:5500/api/plans/monthly/${planId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
  });

  if (!response.ok) throw new Error('Failed to delete plan');
  fetchPlans(selectedClass.id, formData.month, formData.year);
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
    };

const handleEditPlan = (plan) => {
  setFormData({
    planId: plan.planId,
    class_id: plan.class_id,
    month: plan.month,
    year: plan.year,
    activities: plan.activities,
  });
  setIsEditModalOpen(true);
};

const handleClassSelect = (cls) => {
  setSelectedClass(cls);
  setPlans([]);
};

if (loading && !classes.length) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6B46C1" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <TouchableOpacity onPress={() => { setError(null); fetchClasses(); }} style={styles.tryAgainButton}>
        <Text style={styles.tryAgainText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

return (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.container}>
      <CustomHeader title="Monthly Plans" />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Monthly Plans</Text>
        <TouchableOpacity
          onPress={() => setIsCreateModalOpen(true)}
          style={[styles.createButton, !selectedClass && styles.disabledButton]}
          disabled={!selectedClass}
        >
          <Feather name="plus" size={20} color="white" style={styles.createButtonIcon} />
          <Text style={styles.createButtonText}>Create Plan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectContainer}>
        <Text style={styles.label}>Select Class</Text>
        <Picker
          selectedValue={selectedClass ? selectedClass.id : ''}
          style={styles.select}
          onValueChange={(itemValue) => {
            const selected = classes.find(c => c.id === itemValue);
            setSelectedClass(selected || null);
          }}
        >
          <Picker.Item label="Select a class" value="" />
          {classes.map((cls) => (
            <Picker.Item key={cls.id} label={`${cls.name} - ${cls.grade} ${cls.section}`} value={cls.id} />
          ))}
        </Picker>
      </View>

      {loading && selectedClass && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B46C1" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      )}

      {!loading && selectedClass && plans.length === 0 && (
        <Text style={styles.noPlansText}>No plans found for this class.</Text>
      )}

      {selectedClass && (
        <Modal visible={isCreateModalOpen} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Monthly Plan</Text>
                <TouchableOpacity onPress={() => setIsCreateModalOpen(false)} style={styles.modalClose}>
                  <Icon name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View style={styles.modalForm}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Month</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.month.toString()}
                      onChangeText={(text) => setFormData({ ...formData, month: parseInt(text) || 1 })}
                      keyboardType="numeric"
                      min="1"
                      max="12"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Year</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.year.toString()}
                      onChangeText={(text) => setFormData({ ...formData, year: parseInt(text) || new Date().getFullYear() })}
                      keyboardType="numeric"
                      min="2000"
                      max="2100"
                    />
                  </View>
                  {formData.activities.map((activity, index) => (
                    <View key={index} style={styles.activityContainer}>
                      <Text style={styles.activityTitle}>Activity {index + 1}</Text>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => { setDate(activity.date ? new Date(activity.date) : new Date()); setOpen(true); }}>
                          <Text style={styles.datePickerText}>{activity.date || 'Select Date'}</Text>
                        </TouchableOpacity>
                        <DatePicker
                          modal
                          open={open}
                          date={date}
                          mode="date"
                          onConfirm={(date) => {
                            setOpen(false)
                            setDate(date);
                            handleActivityChange(index, 'date', date.toISOString().split('T')[0]);
                          }}
                          onCancel={() => {
                            setOpen(false)
                          }}
                        />
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                          style={styles.input}
                          value={activity.title}
                          onChangeText={(text) => handleActivityChange(index, 'title', text)}
                        />
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                          style={styles.input}
                          value={activity.description}
                          onChangeText={(text) => handleActivityChange(index, 'description', text)}
                          multiline
                        />
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Goals</Text>
                        <TextInput
                          style={styles.input}
                          value={activity.goals}
                          onChangeText={(text) => handleActivityChange(index, 'goals', text)}
                          multiline
                        />
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteActivity(index)} style={styles.deleteActivityButton}>
                        <Icon name="close-circle" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity onPress={handleAddActivity} style={styles.addActivityButton}>
                    <Feather name="plus-circle" size={24} color="#6B46C1" />
                    <Text style={styles.addActivityText}>Add Activity</Text>
                  </TouchableOpacity>
                  <View style={styles.modalActions}>
                    <TouchableOpacity onPress={() => setIsCreateModalOpen(false)} style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCreatePlan} style={styles.submitButton}>
                      <Text style={styles.submitButtonText}>Create</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <Modal visible={isEditModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Monthly Plan</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.modalClose}>
                <Icon name="close" size={24}
                  color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.modalForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Class</Text>
                  <Picker
                    selectedValue={formData.class_id}
                    style={styles.select}
                    onValueChange={(itemValue) => setFormData({ ...formData, class_id: itemValue })}
                  >
                    <Picker.Item label="Select a class" value="" />
                    {classes.map((cls) => (
                      <Picker.Item key={cls.id} label={`${cls.name} - ${cls.grade} ${cls.section}`} value={cls.id} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Month</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.month.toString()}
                    onChangeText={(text) => setFormData({ ...formData, month: parseInt(text) || 1 })}
                    keyboardType="numeric"
                    min="1"
                    max="12"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Year</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.year.toString()}
                    onChangeText={(text) => setFormData({ ...formData, year: parseInt(text) || new Date().getFullYear() })}
                    keyboardType="numeric"
                    min="2000"
                    max="2100"
                  />
                </View>
                {formData.activities.map((activity, index) => (
                  <View key={index} style={styles.activityContainer}>
                    <Text style={styles.activityTitle}>Activity {index + 1}</Text>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Date</Text>
                      <TouchableOpacity style={styles.datePickerButton} onPress={() => { setDate(activity.date ? new Date(activity.date) : new Date()); setOpen(true); }}>
                        <Text style={styles.datePickerText}>{activity.date || 'Select Date'}</Text>
                      </TouchableOpacity>
                      <DatePicker
                        modal
                        open={open}
                        date={date}
                        mode="date"
                        onConfirm={(date) => {
                          setOpen(false)
                          setDate(date);
                          handleActivityChange(index, 'date', date.toISOString().split('T')[0]);
                        }}
                        onCancel={() => {
                          setOpen(false)
                        }}
                      />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Title</Text>
                      <TextInput
                        style={styles.input}
                        value={activity.title}
                        onChangeText={(text) => handleActivityChange(index, 'title', text)}
                      />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Description</Text>
                      <TextInput
                        style={styles.input}
                        value={activity.description}
                        onChangeText={(text) => handleActivityChange(index, 'description', text)}
                        multiline
                      />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Goals</Text>
                      <TextInput
                        style={styles.input}
                        value={activity.goals}
                        onChangeText={(text) => handleActivityChange(index, 'goals', text)}
                        multiline
                      />
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteActivity(index)} style={styles.deleteActivityButton}>
                      <Icon name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity onPress={handleAddActivity} style={styles.addActivityButton}>
                  <Feather name="plus-circle" size={24} color="#6B46C1" />
                  <Text style={styles.addActivityText}>Add Activity</Text>
                </TouchableOpacity>
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleUpdatePlan} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {selectedClass && plans.length > 0 && (
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <View key={index} style={styles.planItem}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>Plan for {plan.month}/{plan.year}</Text>
                <View style={styles.planActions}>
                  <TouchableOpacity onPress={() => handleEditPlan(plan)} style={styles.planActionButton}>
                    <Feather name="edit" size={20} color="#6B46C1" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeletePlan(plan.planId)} style={styles.planActionButton}>
                    <Feather name="trash-2" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.activitiesContainer}>
                {plan.activities.map((activity, actIndex) => (
                  <View key={actIndex} style={styles.activityItem}>
                    <Text style={styles.activityItemTitle}>{activity.title}</Text>
                    <Text style={styles.activityItemDescription}>{activity.description}</Text>
                    <Text style={styles.activityItemDate}>Date: {activity.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  </SafeAreaView>
);
    };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B46C1',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  selectContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B46C1',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  tryAgainButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  tryAgainText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noPlansText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    padding: 5,
  },
  modalForm: {
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  activityContainer: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  deleteActivityButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  addActivityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addActivityText: {
    marginLeft: 8,
    color: '#6B46C1',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  plansContainer: {
    marginTop: 20,
  },
  planItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planActions: {
    flexDirection: 'row',
  },
  planActionButton: {
    marginLeft: 10,
  },
  activitiesContainer: {
    marginTop: 10,
  },
  activityItem: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  activityItemTitle: {
    fontWeight: 'bold',
    color: '#444',
  },
  activityItemDescription: {
    color: '#666',
  },
  activityItemDate: {
    color: '#888',
    fontSize: 12,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  datePickerText: {
    color: '#333',
  }
});

export default MonthlySlider;