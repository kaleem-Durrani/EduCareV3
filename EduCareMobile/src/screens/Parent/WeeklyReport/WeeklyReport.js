import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO, addDays } from 'date-fns';

const EditWeeklyReport = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { studentId } = route.params;

  const fetchWeeklyReport = async (startDate, endDate) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      setLoading(true);
      setError(null);

      // Validate studentId
      if (!studentId || typeof studentId !== 'string' || studentId.length !== 24) {
        throw new Error('Invalid student ID');
      }

      const baseUrl = 'http://tallal.info:5500';
      const response = await fetch(
        `${baseUrl}/api/reports/weekly/${studentId}?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reports');
      }

      // Process the reports data
      const processedReports = data.reports.map(report => ({
        ...report,
        weekStart: parseISO(report.weekStart),
        weekEnd: parseISO(report.weekEnd),
        dailyReports: report.dailyReports.map(daily => ({
          ...daily,
          date: daily.date ? parseISO(daily.date) : null
        }))
      }));

      setWeeklyReports(processedReports);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studentId) {
      setError('Student ID is required');
      return;
    }

    // Get the start of the week (Monday) for the current date
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    // Format dates for API request
    const formattedStart = format(weekStart, 'yyyy-MM-dd');
    const formattedEnd = format(weekEnd, 'yyyy-MM-dd');

    fetchWeeklyReport(formattedStart, formattedEnd);
  }, [currentDate, studentId]);

  const handlePreviousRange = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const handleNextRange = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  // Define background colors for each day
  const dayColors = {
    'Mon': '#38B6FF',
    'Tue': 'red',
    'Wed': '#FB8500',
    'Thu': '#6CB91E',
    'Fri': '#8C52FF',
  };

  const formatDailyReports = (reports = []) => {
    const defaultDays = [
      { day: 'Mon', pee: 'N/A', poop: 'N/A', food: '😐', mood: '😐' },
      { day: 'Tue', pee: 'N/A', poop: 'N/A', food: '😐', mood: '😐' },
      { day: 'Wed', pee: 'N/A', poop: 'N/A', food: '😐', mood: '😐' },
      { day: 'Thu', pee: 'N/A', poop: 'N/A', food: '😐', mood: '😐' },
      { day: 'Fri', pee: 'N/A', poop: 'N/A', food: '😐', mood: '😐' }
    ];

    if (!reports || reports.length === 0) return defaultDays;

    // Map API data to our display format
    const reportMap = reports.reduce((acc, report) => {
      acc[report.day] = report;
      return acc;
    }, {});

    // Merge with default days
    return defaultDays.map(defaultDay => ({
      ...defaultDay,
      ...reportMap[defaultDay.day]
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0288D1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const currentWeekReport = weeklyReports[0] || { dailyReports: [] };
  const formattedData = formatDailyReports(currentWeekReport.dailyReports);

  return (
    <View style={styles.container}>
      <CustomHeader title="WEEKLY REPORT" />

      {/* Icons Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerCell}>
          <Image
            source={require('../../../../assets/images/toiletIcpn.jpg')}
            style={styles.iconImage}
          />
        </View>
        <View style={styles.headerCell}>
          <Icon name="restaurant-outline" size={30} color="#000" />
        </View>
        <View style={styles.headerCell}>
          <Image
            source={require('../../../../assets/images/handIcon.jpg')}
            style={styles.iconImage}
          />
        </View>
        <View style={styles.headerCell}>
          <Icon name="book-outline" size={30} color="#000" />
        </View>
      </View>

      {/* Data Rows */}
      {formattedData.map((item, index) => (
        <View key={index} style={[styles.row, { borderColor: dayColors[item.day] || 'red' }]}>
          <View
            style={[
              styles.cell,
              styles.dayCell,
              {
                backgroundColor: dayColors[item.day],
                borderLeftWidth: 0,
              }
            ]}
          >
            <Text style={styles.dayText}>{item.day}</Text>
          </View>

          <View style={[styles.cell, { borderLeftWidth: 0 }]}>
            <Text style={styles.dataText}>{item.pee}</Text>
          </View>
          <View style={[styles.cell, { borderLeftColor: dayColors[item.day] || 'red' }]}>
            <Text style={styles.dataText}>{item.poop}</Text>
          </View>
          <View style={[styles.cell, { borderLeftColor: dayColors[item.day] || 'red' }]}>
            <Text style={styles.dataText}>{item.food}</Text>
          </View>
          <View style={[styles.cell, { borderLeftColor: dayColors[item.day] || 'red' }]}>
            <Text style={styles.dataText}>{item.mood}</Text>
          </View>
        </View>
      ))}

      {/* Navigation Row */}
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={handlePreviousRange} style={styles.iconButton}>
          <Icon name="chevron-back-outline" size={31} color="black" />
        </TouchableOpacity>
        <View style={styles.monthTextContainer}>
          <Text style={styles.monthText}>
            {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM')} - {
              format(
                addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 4), // Add 4 days to Monday to get to Friday
                'd MMM yyyy'
              )
            }
          </Text>
        </View>
        <TouchableOpacity onPress={handleNextRange} style={styles.iconButton}>
          <Icon name="chevron-forward-outline" size={31} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C6BC0',
    textAlign: 'center',
    marginBottom: 15,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10
  },
  monthText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: '#000',

  },
  iconButton: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 5,
    marginTop: 20,
    width: "100%",
    paddingLeft: "10%"
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
    fontFamily: "Poppins-Regular"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0288D1',
    marginBottom: 2,
    width: "100%",
    height: 65
  },
  cell: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 10,
    width: "22%",
    height: 52,
    borderLeftWidth: 1,
    borderLeftColor: '#0288D1',

  },
  dayCell: {
    backgroundColor: '#0288D1',
    width: "12%",
    height: 65,

  },
  iconImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

  dayText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: "Poppins-Medium"

  },
  dataText: {
    fontSize: 12,
    color: '#000',
    fontFamily: "Poppins-Regular"

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
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Poppins-Regular",
  },
  monthTextContainer: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 5,
    backgroundColor: 'lightgrey',
  },
});

export default EditWeeklyReport;
