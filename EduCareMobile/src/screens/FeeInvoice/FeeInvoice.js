import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using FontAwesome for icons

const FeeInvoice = () => {
    const data = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Tom Brown' },
        { id: '4', name: 'Emily White' },
        { id: '5', name: 'Michael Johnson' },
        { id: '6', name: 'Sarah Williams' },
        { id: '7', name: 'David Lee' },
        { id: '8', name: 'Anna Harris' },
        { id: '9', name: 'James Taylor' },
        { id: '10', name: 'Mary Wilson' },
        { id: '11', name: 'Robert Martinez' },
        { id: '12', name: 'Linda Anderson' },
        { id: '13', name: 'William Thomas' },
        { id: '14', name: 'Patricia Jackson' },
        { id: '15', name: 'Daniel White' },
        { id: '16', name: 'Jessica Moore' },
        { id: '17', name: 'Charles Clark' },
        { id: '18', name: 'Betty Lewis' },
        { id: '19', name: 'Christopher Walker' },
        { id: '20', name: 'Dorothy Hall' },
        { id: '21', name: 'Matthew Allen' },
        { id: '22', name: 'Rebecca Young' },
        { id: '23', name: 'Joshua King' },
        { id: '24', name: 'Nancy Scott' },
      ];
      

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Icon name="child" size={30} color="#00796B" />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <TouchableOpacity style={styles.openCardButton}>
        <Icon name="chevron-down" size={20} color="#00796B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796B',
    marginLeft: 10,
  },
  openCardButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});

export default FeeInvoice;
