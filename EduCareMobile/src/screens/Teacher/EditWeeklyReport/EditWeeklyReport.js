import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    TextInput,
    Modal,
    StyleSheet,
    SafeAreaView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';
import DatePicker from 'react-native-date-picker';
import { Plus, Pencil, X } from 'lucide-react-native';

const EditWeeklyReport = ({ route }) => {
    const [startDate, setStartDate] = useState(getMonday(new Date()));
    const [endDate, setEndDate] = useState(getFriday(new Date()));
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        student_id: '',
        weekStart: new Date(startDate),
        weekEnd: new Date(endDate),
        dailyReports: [
            { day: 'Monday', pee: '', poop: '', food: '', mood: '' },
            { day: 'Tuesday', pee: '', poop: '', food: '', mood: '' },
            { day: 'Wednesday', pee: '', poop: '', food: '', mood: '' },
            { day: 'Thursday', pee: '', poop: '', food: '', mood: '' },
            { day: 'Friday', pee: '', poop: '', food: '', mood: '' },
            { day: 'Saturday', pee: '', poop: '', food: '', mood: '' },
            { day: 'Sunday', pee: '', poop: '', food: '', mood: '' },
        ],
    });
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const fetchStudents = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch('http://tallal.info:5500/api/students', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data.students);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchReports = async (studentId, startDate, endDate) => {
        setLoading(true);
        try {
            if (!studentId) return;
            const token = await AsyncStorage.getItem('accessToken');
            let url = `http://tallal.info:5500/api/reports/weekly/${studentId}`;
            // if (startDate && endDate) {
            //     const formattedStartDate = startDate.toISOString().split('T')[0];
            //     const formattedEndDate = endDate.toISOString().split('T')[0];
            //     url += `?start_date=<span class="math-inline">\{formattedStartDate\}&end\_date\=</span>{formattedEndDate}`;
            // }
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("You are not authorized to view this student's reports.");
                }
                throw new Error('Failed to fetch reports');
            }

            const data = await response.json();
            setReports(data.reports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent?._id) {
            fetchReports(selectedStudent._id, startDate, endDate);
        }
    }, [selectedStudent, startDate, endDate]);

    const handleCreateReport = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch('http://tallal.info:5500/api/reports/weekly', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create report');
            setIsCreateModalOpen(false);
            fetchReports(formData.student_id, startDate, endDate);
            setFormData({
                student_id: '',
                weekStart: startDate,
                weekEnd: endDate,
                dailyReports: [
                    { day: 'Monday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Tuesday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Wednesday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Thursday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Friday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Saturday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Sunday', pee: '', poop: '', food: '', mood: '' },
                ],
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateReport = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`http://tallal.info:5500/api/reports/weekly/${formData.reportId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update report');
            setIsEditModalOpen(false);
            fetchReports(formData.student_id, startDate, endDate);
            setFormData({
                student_id: '',
                weekStart: startDate,
                weekEnd: endDate,
                dailyReports: [
                    { day: 'Monday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Tuesday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Wednesday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Thursday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Friday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Saturday', pee: '', poop: '', food: '', mood: '' },
                    { day: 'Sunday', pee: '', poop: '', food: '', mood: '' },
                ],
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (day, field, value) => {
        setFormData((prevFormData) => {
            const updatedDailyReports = prevFormData.dailyReports.map((report) => {
                if (report.day === day) {
                    return {
                        ...report,
                        [field]: value,
                    };
                }
                return report;
            });
            return { ...prevFormData, dailyReports: updatedDailyReports };
        });
    };

    const handleEditReport = (report) => {
        setFormData({
            reportId: report.reportId,
            student_id: report.student_id,
            weekStart: new Date(report.weekStart),
            weekEnd: new Date(report.weekEnd),
            dailyReports: report.dailyReports,
        });
        setIsEditModalOpen(true);
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setReports([]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity onPress={() => { setError(null); fetchStudents(); }} style={styles.tryAgainButton}>
                    <Text style={styles.tryAgainText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    function getFriday(d) {
        const monday = getMonday(d);
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);
        return friday;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <CustomHeader title="Weekly Reports" />
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => setIsCreateModalOpen(true)} style={styles.createButton}>
                        <Plus size={20} color="white" />
                        <Text style={styles.createButtonText}>Create Report</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.studentSelectContainer}>
                    <Text style={styles.label}>Select Student</Text>
                    <View style={styles.select}>
                        <TouchableOpacity style={styles.selectButton} onPress={() => { }}>
                            <Text style={styles.selectButtonText}>
                                {selectedStudent ? selectedStudent.fullName : 'Select a student'}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.selectDropdown}>
                            {students.map((student) => (
                                <TouchableOpacity key={student._id} style={styles.selectOption} onPress={() => handleStudentSelect(student)}>
                                    <Text style={styles.selectOptionText}>{student.fullName}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {selectedStudent && (
                    <View style={styles.selectedStudentContainer}>
                        <Text style={styles.label}>Student: {selectedStudent.fullName}</Text>
                    </View>
                )}

                <View style={styles.dateFilterContainer}>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>Start Date:</Text>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
                            <Text style={styles.datePickerText}>{startDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showStartDatePicker && (
                            <DatePicker
                                modal
                                open={showStartDatePicker}
                                date={startDate}
                                onConfirm={(date) => {
                                    setShowStartDatePicker(false);
                                    setStartDate(date);
                                }}
                                onCancel={() => {
                                    setShowStartDatePicker(false);
                                }}
                            />
                        )}
                    </View>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>End Date:</Text>
                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowEndDatePicker(true)}>
                            <Text style={styles.datePickerText}>{endDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showEndDatePicker && (
                            <DatePicker
                                modal
                                open={showEndDatePicker}
                                date={endDate}
                                onConfirm={(date) => {
                                    setShowEndDatePicker(false);
                                    setEndDate(date);
                                }}
                                onCancel={() => {
                                    setShowEndDatePicker(false);
                                }}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Week Start</Text>
                        <Text style={styles.tableHeaderText}>Week End</Text>
                        <Text style={styles.tableHeaderText}>Actions</Text>
                    </View>
                    {reports.map((report) => (
                        <View key={report.reportId} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{new Date(report.weekStart).toLocaleDateString()}</Text>
                            <Text style={styles.tableCell}>{new Date(report.weekEnd).toLocaleDateString()}</Text>
                            <View style={styles.actionContainer}>
                                <TouchableOpacity onPress={() => handleEditReport(report)} style={styles.actionButton}>
                                    <Pencil size={20} color="#6B46C1" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <Modal visible={isCreateModalOpen} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Create Weekly Report</Text>
                                <TouchableOpacity onPress={() => setIsCreateModalOpen(false)} style={styles.modalClose}>
                                    <X size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                <View style={styles.modalForm}>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Student</Text>
                                        <View style={styles.select}>
                                            <TouchableOpacity style={styles.selectButton} onPress={() => { }}>
                                                <Text style={styles.selectButtonText}>
                                                    {students.find(s => s._id === formData.student_id)?.fullName || 'Select a student'}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={styles.selectDropdown}>
                                                {students.map((student) => (
                                                    <TouchableOpacity key={student._id} style={styles.selectOption} onPress={() => setFormData({ ...formData, student_id: student._id })}>
                                                        <Text style={styles.selectOptionText}>{student.fullName}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Week Start</Text>
                                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setFormData({ ...formData, weekStart: new Date() })}>
                                            <Text style={styles.datePickerText}>{formData.weekStart.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Week End</Text>
                                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setFormData({ ...formData, weekEnd: new Date() })}>
                                            <Text style={styles.datePickerText}>{formData.weekEnd.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {formData.dailyReports.map((report) => (
                                        <View key={report.day} style={styles.dailyReportContainer}>
                                            <Text style={styles.dailyReportTitle}>{report.day}</Text>
                                            <View style={styles.dailyReportFields}>
                                                {['pee', 'poop', 'food', 'mood'].map((field) => (
                                                    <View key={field} style={styles.fieldContainer}>
                                                        <Text style={styles.fieldLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={report[field]}
                                                            onChangeText={(text) => handleInputChange(report.day, field, text)}
                                                        />
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    ))}
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity onPress={() => setIsCreateModalOpen(false)} style={styles.cancelButton}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleCreateReport} style={styles.submitButton}>
                                            <Text style={styles.submitButtonText}>Create</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Modal visible={isEditModalOpen} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Weekly Report</Text>
                                <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.modalClose}>
                                    <X size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                <View style={styles.modalForm}>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Student</Text>
                                        <View style={styles.select}>
                                            <TouchableOpacity style={styles.selectButton} onPress={() => { }}>
                                                <Text style={styles.selectButtonText}>
                                                    {students.find(s => s._id === formData.student_id)?.fullName || 'Select a student'}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={styles.selectDropdown}>
                                                {students.map((student) => (
                                                    <TouchableOpacity key={student._id} style={styles.selectOption} onPress={() => setFormData({ ...formData, student_id: student._id })}>
                                                        <Text style={styles.selectOptionText}>{student.fullName}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Week Start</Text>
                                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setFormData({ ...formData, weekStart: new Date() })}>
                                            <Text style={styles.datePickerText}>{formData.weekStart.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Week End</Text>
                                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setFormData({ ...formData, weekEnd: new Date() })}>
                                            <Text style={styles.datePickerText}>{formData.weekEnd.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {formData.dailyReports.map((report) => (
                                        <View key={report.day} style={styles.dailyReportContainer}>
                                            <Text style={styles.dailyReportTitle}>{report.day}</Text>
                                            <View style={styles.dailyReportFields}>
                                                {['pee', 'poop', 'food', 'mood'].map((field) => (
                                                    <View key={field} style={styles.fieldContainer}>
                                                        <Text style={styles.fieldLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={report[field]}
                                                            onChangeText={(text) => handleInputChange(report.day, field, text)}
                                                        />
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    ))}
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.cancelButton}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleUpdateReport} style={styles.submitButton}>
                                            <Text style={styles.submitButtonText}>Update</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6B46C1',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    createButtonText: {
        color: 'white',
        marginLeft: 5,
    },
    studentSelectContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    select: {
        position: 'relative',
    },
    selectButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    selectButtonText: {
        fontSize: 16,
    },
    selectDropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        zIndex: 1,
    },
    selectOption: {
        padding: 10,
    },
    selectOptionText: {
        fontSize: 16,
    },
    selectedStudentContainer: {
        marginBottom: 20,
    },
    dateFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    datePickerContainer: {
        flex: 1,
        marginRight: 10,
    },
    datePickerButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    datePickerText: {
        fontSize: 16,
    },
    tableContainer: {
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tableHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tableCell: {
        fontSize: 16,
    },
    actionContainer: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalClose: {
        padding: 5,
    },
    modalForm: {
        flex: 1,
    },
    formGroup: {
        marginBottom: 15,
    },
    dailyReportContainer: {
        marginBottom: 15,
    },
    dailyReportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dailyReportFields: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    fieldContainer: {
        width: '48%',
        marginBottom: 10,
    },
    fieldLabel: {
        fontSize: 14,
        marginBottom: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10,
    },
    cancelButtonText: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#6B46C1',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 16,
    },
});

export default EditWeeklyReport;