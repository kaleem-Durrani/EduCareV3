import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../../contexts";

const SettingsScreen = () => {
  const { logout, user } = useAuth();

  const settingsOptions = [
    { id: "1", label: "Profile Information", icon: "account-circle-outline" },
    { id: "2", label: "Change Password", icon: "lock-outline" },
    { id: "3", label: "Notifications", icon: "bell-outline" },
    { id: "4", label: "Privacy & Security", icon: "shield-outline" },
    { id: "5", label: "Help & Support", icon: "help-circle-outline" },
    { id: "6", label: "Logout", icon: "exit-to-app", color: "#E64A19" },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleOptionPress = (label) => {
    if (label === "Logout") {
      handleLogout();
    } else {
      console.log(`${label} pressed`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../../../assets/images/EducareLogo.png")}
          style={styles.logo}
        />
        <View style={styles.divider} />
      </View>

      <View style={styles.userInfoBox}>
        <Image
          source={require("../../../../assets/images/Student.jpg")}
          style={styles.userImage}
        />
        <View style={styles.userDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Full Name: </Text>
            <Text style={styles.detailText1Upper}>
              {user?.name || "User Name"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Email:</Text>
            <Text style={styles.detailText1Upper}>
              {user?.email || "user@example.com"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTextUpper}>Role:</Text>
            <Text style={styles.detailText1Upper}>
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"}
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
              index === settingsOptions.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={() => handleOptionPress(option.label)}
          >
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
    backgroundColor: "#fff",
    // padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#00796B",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#333",
    marginLeft: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#7b68ee",
    letterSpacing: 1,
    fontFamily: "Poppins-Regular",
  },
  verticalLine: {
    height: 30,
    width: 1.5,
    backgroundColor: "#696969",
    marginTop: 5,
  },
  userInfoBox: {
    flexDirection: "row",
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#7b68ee",
    marginRight: 10,
  },
  userDetails: {
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
    color: "#7b68ee",
    fontFamily: "Poppins-Medium",
  },
  detailText1: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: -5,
  },
  detailTextUpper: {
    fontSize: 12,
    color: "#7b68ee",
    fontFamily: "Poppins-Medium",
  },
  detailText1Upper: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: -5,
  },
});
