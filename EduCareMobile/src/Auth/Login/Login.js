import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../../contexts";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const roles = [
    { id: "parent", label: "Parent", icon: "account-group" },
    { id: "teacher", label: "Teacher", icon: "school" },
  ];

  const [selectedRole, setSelectedRole] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const animations = roles.map(
    (_, index) => useRef(new Animated.Value(index === 0 ? 1.4 : 1)).current
  );

  const handleRolePress = (index) => {
    setSelectedRole(index);
    animations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 1.4 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const validateInputs = () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return false;
    }
    if (!isChecked) {
      setErrorMessage("Please agree to Terms and Conditions");
      return false;
    }
    return true;
  };

  const handleLoginPress = async () => {
    if (!validateInputs()) return;

    setErrorMessage("");

    try {
      const result = await login(email, password, roles[selectedRole].id);

      if (result.success) {
        // Navigate to Dashboard
        navigation.navigate("Dashboard", { role: roles[selectedRole].id });
      } else {
        setErrorMessage(result.message || "Login failed");
        Alert.alert("Login Failed", result.message || "Login failed");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Login failed";
      setErrorMessage(errorMsg);
      Alert.alert("Login Failed", errorMsg);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../../assets/images/EducareLogo.png")}
          style={styles.logo}
        />
        <View style={styles.divider} />
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role, index) => (
          <TouchableOpacity
            key={role.id}
            onPress={() => handleRolePress(index)}
            disabled={authLoading}
          >
            <Animated.View
              style={[
                styles.roleBox,
                {
                  backgroundColor:
                    selectedRole === index ? "#4169e1" : "#D0E8EC",
                  transform: [{ scale: animations[index] }],
                },
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  { color: selectedRole === index ? "#4169e1" : "#333" },
                ]}
              >
                {role.label}
              </Text>
              <Icon
                name={role.icon}
                size={40}
                color={selectedRole === index ? "#fff" : "#333"}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        {errorMessage || authError ? (
          <Text style={styles.errorText}>{errorMessage || authError}</Text>
        ) : null}

        <View style={styles.inputRow}>
          <Icon name="email" size={24} color="#4169e1" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!authLoading}
          />
        </View>

        <View style={styles.inputRow}>
          <Icon name="lock" size={24} color="#4169e1" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!authLoading}
          />
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setIsChecked(!isChecked)}
          disabled={authLoading}
        >
          <Icon
            name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
            size={24}
            color={isChecked ? "#4CAF50" : "#888"}
          />
        </TouchableOpacity>
        <Text style={styles.checkboxText}>I agree to Terms and Conditions</Text>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, authLoading && styles.loginButtonDisabled]}
        onPress={handleLoginPress}
        disabled={authLoading}
      >
        {authLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>LOGIN</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        disabled={authLoading}
      >
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <Text style={styles.hotline}>Hotline: (+84) 28 2217 8804</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 5,
    // paddingTop:120
    // justifyContent: 'center',
  },
  rolesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
    marginTop: 60,
  },
  roleBox: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    padding: 10,
    position: "relative",
  },
  roleText: {
    position: "absolute",
    top: -20,
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontFamily: "Poppins-Regular",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 8,
    color: "#555",
    fontFamily: "Poppins-Regular",
  },
  loginButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 20,
    width: "78%",
    alignSelf: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    paddingTop: 2,
  },
  forgotPassword: {
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  hotline: {
    color: "black",
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Poppins-Medium",
  },

  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    // paddingBottom: 10,
  },
  logo: {
    width: 180,
    height: 110,
    resizeMode: "contain",
    marginTop: -10,
  },
  divider: {
    height: 1.3,
    backgroundColor: "#696969",
    alignSelf: "stretch",
    marginTop: -15,
    marginHorizontal: -40,
  },
  screenName: {
    fontSize: 17,
    textAlign: "center",
    marginTop: 10,
    color: "#4169e1",
    letterSpacing: 1,
    fontFamily: "Poppins-Regular",
  },
  verticalLine: {
    height: 30,
    width: 1.5,
    backgroundColor: "#696969",
    marginTop: 5,
  },
  childInfoBox: {
    flexDirection: "row",
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  childImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#4169e1",
    marginRight: 10,
  },
  childDetails: {
    flex: 1,
    paddingTop: 10,
  },
  detailRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: "#4169e1",
    fontFamily: "Poppins-Medium",
  },
  detailText1: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: -5,
  },
  detailTextUpper: {
    fontSize: 12,
    color: "#4169e1",
    fontFamily: "Poppins-Medium",
  },
  detailText1Upper: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: -5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  loginButtonDisabled: {
    backgroundColor: "#a0a0a0",
  },
});

export default LoginScreen;
