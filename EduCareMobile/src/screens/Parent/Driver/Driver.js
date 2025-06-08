import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';

const Driver = () => {
  const [activeTab, setActiveTab] = useState('in'); // State to track active tab (In/Out)
  const [data, setData] = useState([
    { id: 1, name: 'Andy Murray', status: false },
    { id: 2, name: 'Elizabeth Taylor', status: false },
    { id: 3, name: 'Emily Brown', status: false },
    { id: 4, name: 'Grace Scott', status: false },
    { id: 5, name: 'Henry Clark', status: false },
    { id: 6, name: 'James Wilson', status: false },
    { id: 7, name: 'Jannik Salad', status: false },
    { id: 8, name: 'Kuiz Addams', status: false },
  ]);

  // Toggle switch handler
  const toggleSwitch = (id) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, status: !item.status } : item
    );
    setData(updatedData);
  };

  // Render item in list
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.name}>{item.name}</Text>
      <Switch
        value={item.status}
        onValueChange={() => toggleSwitch(item.id)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="DRIVER" />

      {/* Header with buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'in' && styles.activeTab]}
          onPress={() => setActiveTab('in')}
        >
          <Text style={activeTab === 'in' ? styles.activeText : styles.tabText}>
            In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'out' && styles.activeTab]}
          onPress={() => setActiveTab('out')}
        >
          <Text
            style={activeTab === 'out' ? styles.activeText : styles.tabText}
          >
            Out
          </Text>
        </TouchableOpacity>
      </View>
      {/* Content based on active tab */}
      {activeTab === 'in' ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.outContainer}>
          <Text style={styles.outText}>No data available for "Out".</Text>
        </View>
      )}
      {/* Footer Button */}
      <TouchableOpacity style={styles.notificationButton}>
        <Text style={styles.notificationText}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Driver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // 
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular', // Default font
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop:10
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#4169e1',
  },
  activeTab: {
    backgroundColor: '#4169e1',
  },
  tabText: {
    color: '#4169e1',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium', // Apply Medium weight for tab text
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold', // Apply Bold weight for active tab text
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#ffffff',
    // borderRadius: 5,
    // padding: 15,
    paddingVertical:9,
    // marginBottom: 10,
    marginHorizontal: 20,
    fontFamily: 'Poppins-Regular', 
    borderBottomWidth:1,
    borderBottomColor:"grey"
    // Apply Regular font weight for list items
  },
  name: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular', // Apply Regular font weight for name text
  },
  outContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  outText: {
    fontSize: 16,
    color: '#777',
    fontFamily: 'Poppins-Regular', // Apply Regular font weight for "out" text
  },
  notificationButton: {
    backgroundColor: '#4169e1',
    padding: 13,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal:16
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Bold', // Apply Bold weight for notification text
  },
});
