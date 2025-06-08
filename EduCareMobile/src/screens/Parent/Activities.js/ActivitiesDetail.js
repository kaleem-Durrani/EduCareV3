import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ScrollView, Image ,Text,TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';


const ActivitiesDetail = () => {
    const navigation = useNavigation(); // Hook for navigation
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="back" size={28} color="#000" />
              </TouchableOpacity>
        <Image source={require('../../../../assets/images/EducareLogo.png')} style={styles.logo} />
        <View style={styles.divider} />
        
      </View>

      <Image source={require('../../../../assets/images/mario.jpg')} style={styles.childImage} />


      <View style={styles.additionalDetailsBox}>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Activity: </Text>
          <Text style={styles.detailText1}>Going to a Park</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Where: </Text>
          <Text style={styles.detailText1}>Adeleine Park</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Date: </Text>
          <Text style={styles.detailText1}>10/10/24</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Hour: </Text>
          <Text style={styles.detailText1}>05</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Participants: </Text>
          <Text style={styles.detailText1}>Red calss , green class , blue class</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>Additional information:</Text>
          <Text style={styles.detailText1}>We are going for enjoy and many more etc </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 15,
    zIndex: 10,
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
    // backgroundColor: '#f9f9f9',
  },
  childImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 2.2,
    borderColor: '#4169e1',
    marginRight: 10,
    alignSelf:"center",
    marginTop:15
  },
  childDetails: {
    flex: 1,
    paddingTop: 10,
  },
  detailRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#4169e1',
    fontFamily: 'Poppins-SemiBold',
  },
  detailText1: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
    color:"black"

  },
  detailTextUpper: {
    fontSize: 12,
    color: '#7b68ee',
    fontFamily: 'Poppins-Medium',
  },
  detailText1Upper: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
  },
  additionalDetailsBox: {
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    // backgroundColor: '#f9f9f9',
    marginLeft: '8%',
    width: '80%',
  },
});

export default ActivitiesDetail;
