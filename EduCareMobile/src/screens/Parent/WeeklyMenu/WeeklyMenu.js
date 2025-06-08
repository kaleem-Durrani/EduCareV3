import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format } from 'date-fns';

const WeeklyMenuScreen = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    fetchWeeklyMenu();
  }, []);

  const fetchWeeklyMenu = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      console.log("token", token)
      
      const response = await axios.get('http://tallal.info:5500/api/menu/weekly', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Format the date range
      const startDate = new Date(response.data.startDate);
      const endDate = new Date(response.data.endDate);
      const formattedDateRange = `${format(startDate, 'd')} to ${format(endDate, 'd MMMM')}`;
      setDateRange(formattedDateRange);

      // Transform the API data to match our component structure
      const transformedData = response.data.menuData.map(day => ({
        day: day.day,
        items: day.items
      }));

      setMenuData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Unable to load menu data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7b68ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomHeader title="WEEKLY MENU" />
      
      <Text style={styles.dateText}>{dateRange}</Text>

      <View style={styles.iconContainer}>
        <Image
          source={require('../../../../assets/images/foodIcon.jpg')}
          style={styles.iconImage}
        />
      </View>

      <View style={styles.menuContainer}>
        {menuData.map((menu, index) => (
          <View
            key={index}
            style={[
              styles.menuCard,
              index !== menuData.length - 1 && styles.menuCardWithBorder,
              index !== menuData.length - 1 && { paddingVertical: 5 },
            ]}
          >
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>{menu.day[0]}</Text>
            </View>
            <View style={styles.itemsContainer}>
              {menu.items.map((item, idx) => (
                <Text key={idx} style={styles.itemText}>
                  {item}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 10,
    color: '#333',
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 105,
    borderWidth: 2,
    borderColor: '#7b68ee',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  menuContainer: {
    backgroundColor: '#FFDE59',
    padding: 8,
    paddingBottom: 3,
    borderRadius: 14,
    width: '72%',
    alignSelf: 'center',
  },
  menuCard: {
    flexDirection: 'row',
    paddingHorizontal: 13,
    marginBottom: 12,
    alignItems: 'center',
  },
  menuCardWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  dayContainer: {
    width: 37,
    height: 37,
    borderRadius: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dayText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
  },
  itemsContainer: {},
  itemText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    marginBottom: -3,
  },
  iconImage: {
    width: 105,
    height: 105,
    resizeMode: 'contain',
    borderRadius: 100,
  },
});

export default WeeklyMenuScreen;