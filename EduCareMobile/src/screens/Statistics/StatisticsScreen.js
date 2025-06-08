import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatisticsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Today</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>In Class</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>40</Text>
            <Text style={styles.statLabel}>Out Class</Text>
          </View>
        </View>
      </View>

      {/* New History Section */}
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>History</Text>
        <View style={styles.historyContainer}>
          <View style={styles.historyColumn}>
            <Text style={styles.historyHeader}>Date</Text>
            <Text style={styles.historyValue}>2024-11-09</Text>
          </View>
          <View style={styles.historyColumn}>
            <Text style={styles.historyHeader}>In Class</Text>
            <Text style={styles.historyValue}>130</Text>
          </View>
          <View style={styles.historyColumn}>
            <Text style={styles.historyHeader}>Out Class</Text>
            <Text style={styles.historyValue}>30</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  topSection: {
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },

  // History Section Styles
  historySection: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 10,
  },
  historyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyColumn: {
    alignItems: 'center',
    width: '30%',
  },
  historyHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796B',
  },
  historyValue: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
});

export default StatisticsScreen;
