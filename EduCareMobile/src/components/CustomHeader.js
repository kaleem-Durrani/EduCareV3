import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const CustomHeader = ({title}) => {
  const navigation = useNavigation(); // Hook for navigation

  return (
    <View style={styles.headerContainer}>
      {/* Back Icon */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="back" size={28} color="#000" />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require('../../assets/images/EducareLogo.png')}
        style={styles.logo}
      />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Screen Title */}
      <Text style={styles.screenName}>{title}</Text>

      {/* Vertical Line */}
      <View style={styles.verticalLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 15,
    zIndex: 10,
  },
  logo: {
    width: 170,
    height: 100,
    resizeMode: 'contain',
    marginTop: -10,
  },
  divider: {
    height: 1.3,
    backgroundColor: '#696969',
    alignSelf: 'stretch',
    marginTop: -15,
    marginHorizontal: -40,
  },
  screenName: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 15,
    color: '#4169e1',
    letterSpacing: 1,
    fontFamily: 'Poppins-Regular',
  },
  verticalLine: {
    height: 30,
    width: 1.5,
    backgroundColor: '#696969',
    marginTop: 5,
  },
});

export default CustomHeader;
