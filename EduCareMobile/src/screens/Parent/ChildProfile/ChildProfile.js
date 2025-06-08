import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../libs/theme';

const ChildProfileScreen = ({ navigation }) => {
  const childInfo = {
    name: 'John Doe',
    age: 8,
    grade: '3rd Grade',
    school: 'Greenwood Elementary School',
    profilePhoto: 'https://example.com/photo.jpg', // Placeholder photo URL
  };

  const navigateToSection = (section) => {
    // Placeholder function for navigation
    navigation.navigate(section);
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: childInfo.profilePhoto }} style={styles.profilePhoto} />
        <Text style={styles.childName}>{childInfo.name}</Text>
        <Text style={styles.childDetails}>Age: {childInfo.age} | {childInfo.grade}</Text>
        <Text style={styles.childDetails}>School: {childInfo.school}</Text>
      </View>

      {/* Links to other sections */}
      <View style={styles.sectionLinks}>
        <TouchableOpacity style={styles.sectionButton} onPress={() => navigateToSection('Reports')}>
          <Text style={styles.sectionButtonText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionButton} onPress={() => navigateToSection('Activities')}>
          <Text style={styles.sectionButtonText}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionButton} onPress={() => navigateToSection('Attendance')}>
          <Text style={styles.sectionButtonText}>Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  childName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  childDetails: {
    fontSize: 16,
    color: COLORS.primary,
  },
  sectionLinks: {
    marginTop: 24,
  },
  sectionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  sectionButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChildProfileScreen;
