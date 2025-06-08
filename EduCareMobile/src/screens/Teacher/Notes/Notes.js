import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Notes = () => {
    const navigation = useNavigation(); // Hook for navigation
  
  const itemList = [
    { name: 'Counted to 6', date: '2024-11-28' },
    { name: 'Learned colors', date: '2024-11-27' },
    { name: 'Shared toys with friends', date: '2024-11-26' },
    { name: 'Finished lunch without help', date: '2024-11-25' },
    { name: 'Participated in group activities', date: '2024-11-24' },
    { name: 'Followed instructions well', date: '2024-11-23' },
  ];

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
           <TouchableOpacity style={{
              position: 'absolute',
              top: 25,
              left: 15,
              zIndex: 10,
           }} onPress={() => navigation.goBack()}>
                <AntDesign name="back" size={28} color="#000" />
              </TouchableOpacity>
           <Image source={require('../../../../assets/images/EducareLogo.png')} style={styles.logo} />
           <View style={styles.divider} />
           
         </View>


      <View style={styles.childInfoBox}>
        <Image source={require('../../../../assets/images/Student.jpg')} style={styles.childImage} />
        <View style={styles.childDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Full Name: </Text>
            <Text style={styles.detailText1Upper}>Alejandro Fernandez</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Class:</Text>
            <Text style={styles.detailText1Upper}>Red</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Schedule:</Text>
            <Text style={styles.detailText1Upper}>08:00 - 12:30, Monday to Friday</Text>
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.heading}>Notes:</Text>
        <Text style={styles.heading}>Date:</Text>
      </View>

      <View style={styles.rowsContainer}>
        {itemList.map((item) => (
          <View key={item.name} style={styles.row}>
           <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
            <TouchableOpacity style={styles.readButton}>
              <Text style={styles.readButtonText}>Read</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingBottom: 10,
  },
  logo: {
    width: 180,
    height: 110,
    resizeMode: 'contain',
    marginTop: -10,
  },
  divider: {
    height: 1.3,
    backgroundColor: '#696969',
    alignSelf: 'stretch',
    marginTop: -15,
  },

  childInfoBox: {
    flexDirection: 'row',
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    // backgroundColor: 'red',
    marginTop:15,
    paddingHorizontal:13
  },
  childImage: {
    width: 122,
    height: 122,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4169e1',
    marginRight: 10,
  },
  childDetails: {
    flex: 1,
    // paddingTop: 10,
  },
  detailRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#4169e1',
    fontFamily: 'Poppins-Medium',
  },
  detailText1: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
  },
  detailTextUpper: {
    fontSize: 12,
    color: '#4169e1',
    fontFamily: 'Poppins-Medium',
  },
  detailText1Upper: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
  },




  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: 'grey',
    marginHorizontal:14
  },
  heading: {
    fontSize: 15,
    color: '#4169e1',
    fontFamily: 'Poppins-SemiBold',
  },
  rowsContainer: {
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginHorizontal:14

  },
  itemText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  readButton: {
    backgroundColor: '#4169e1',
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  readButtonText: {
    color: 'white',
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
  },
  dateText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
});

export default Notes;
