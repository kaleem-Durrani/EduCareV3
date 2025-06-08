import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyBoxScreen = ({route}) => {
  const {studentId} = route.params;
  // List of items and their default stock values
  const itemList = [
    { name: 'Shirt', inStock: true },
    { name: 'Pants', inStock: false },
    { name: 'Socks', inStock: true },
    { name: 'Tooth brush', inStock: false },
    { name: 'Tooth paste', inStock: false },
    { name: 'Towel', inStock: true },
    { name: 'Sandal', inStock: false },
  ];

  // Initialize state based on itemList
  const [stocks, setStocks] = useState(
    itemList.reduce((acc, item) => ({ ...acc, [item.name.toLowerCase()]: item.inStock }), {})
  );

  const toggleStock = (item) => {
    setStocks((prevStocks) => ({
      ...prevStocks,
      [item.toLowerCase()]: !prevStocks[item.toLowerCase()], // Toggle the value
    }));
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="MY BOX" />
      {/* Heading Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>Item:</Text>
        <Text style={styles.heading}>In Stock:</Text>
      </View>

      {/* Item and In Stock Rows */}
      <View style={styles.rowsContainer}>
        {itemList.map((item) => (
          <View key={item.name} style={styles.row}>
            <Text style={styles.itemText}>{item.name}</Text>
            <CustomToggle
              isActive={stocks[item.name.toLowerCase()]}
              onToggle={() => toggleStock(item.name)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// Custom Toggle Button
const CustomToggle = ({ isActive, onToggle }) => {
  return (
    <View
      style={[
        styles.toggleWrapper,
        { borderColor: isActive ? 'green' : 'red' },
      ]}
    >
      {/* No Button */}
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

      {/* Yes Button */}
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

export default MyBoxScreen;
