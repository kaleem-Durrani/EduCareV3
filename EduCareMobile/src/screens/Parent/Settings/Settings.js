import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const settingsOptions = [
    {id: '1', label: 'Profile Information', icon: 'account-circle-outline'},
    {id: '2', label: 'Change Password', icon: 'lock-outline'},
    {id: '3', label: 'Notifications', icon: 'bell-outline'},
    {id: '4', label: 'Privacy & Security', icon: 'shield-outline'},
    {id: '5', label: 'Help & Support', icon: 'help-circle-outline'},
    {id: '6', label: 'Logout', icon: 'exit-to-app', color: '#E64A19'},
  ];

  const handleOptionPress = label => {
    console.log(`${label} pressed`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../../../assets/images/EducareLogo.png')}
          style={styles.logo}
        />
        <View style={styles.divider} />
      </View>

      <View style={styles.childInfoBox}>
        <Image
          source={require('../../../../assets/images/Student.jpg')}
          style={styles.childImage}
        />
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
            <Text style={styles.detailText1Upper}>
              08:00 - 12:30, Monday to Friday
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              index === settingsOptions.length - 1 && {borderBottomWidth: 0},
            ]}
            onPress={() => handleOptionPress(option.label)}>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name={option.icon}
                size={24}
                color="#7b68ee"
              />
              <Text style={styles.optionText}>{option.label}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#696969"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#00796B',
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginLeft: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingBottom: 10,
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
    marginHorizontal: -40,
  },
  screenName: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 10,
    color: '#7b68ee',
    letterSpacing: 1,
    fontFamily: 'Poppins-Regular',
  },
  verticalLine: {
    height: 30,
    width: 1.5,
    backgroundColor: '#696969',
    marginTop: 5,
  },
  childInfoBox: {
    flexDirection: 'row',
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  childImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#7b68ee',
    marginRight: 10,
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
    fontSize: 13,
    color: '#7b68ee',
    fontFamily: 'Poppins-Medium',
  },
  detailText1: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: -5,
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
});
