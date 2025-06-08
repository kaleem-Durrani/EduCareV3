import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';


const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Back Button */}
        <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                   <AntDesign name="back" size={28} color="#000" />
                 </TouchableOpacity>
           <Image source={require('../../../assets/images/EducareLogo.png')} style={styles.logo} />
           <View style={styles.divider} />
           
         </View>



      {/* Heading */}
      <Text style={styles.heading}>Forgot Password</Text>

      {/* Input Field */}
       <View style={styles.inputRow}>
             <Icon name="lock" size={24} color="#4169e1" />
             <TextInput
               style={styles.input}
               placeholder="Password"
               placeholderTextColor="#888"
               secureTextEntry
             />
           </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 20,
    // justifyContent: 'center',
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

  heading: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
    marginTop:50
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginHorizontal:15
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
marginHorizontal:16

  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontFamily: 'Poppins-Regular',
  },
  submitButton: {
    backgroundColor:'#4169e1',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
