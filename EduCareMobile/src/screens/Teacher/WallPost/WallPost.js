import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';


const WallScreen = () => {
    const navigation = useNavigation(); // Hook for navigation
  


  const posts = [
    {
      id: 1,
      teacherName: 'John Doe',
      date: 'Dec 3, 2024',
      profileImage: 'https://as2.ftcdn.net/v2/jpg/01/99/36/81/1000_F_199368197_CXhzovd2cgXhK3SR4xjUKNhTer8j5I87.jpg',
      postImage: 'https://www.rockstaracademy.com/lib/images/news/prepare-school.jpeg',
      title: 'School Child: Maria\'s Excellent Art Work',
    },
    {
      id: 2,
      teacherName: 'Michael Brown',
      date: 'Nov 30, 2024',
      profileImage: 'https://www.shutterstock.com/image-photo/portrait-young-teacher-near-whiteboard-260nw-1656704701.jpg',
      postImage: 'https://i.ytimg.com/vi/SrXOwLiWWz0/maxresdefault.jpg',
      title: 'Outdoor Learning: Sarah\'s Nature Exploration',
    },
    {
      id: 3,
      teacherName: 'Jane Smith',
      date: 'Dec 1, 2024',
      profileImage: 'https://as2.ftcdn.net/v2/jpg/01/99/36/81/1000_F_199368197_CXhzovd2cgXhK3SR4xjUKNhTer8j5I87.jpg',
      postImage: 'https://cdn.cdnparenting.com/articles/2018/03/15184430/What-age-do-kids-start-preschool.webp',
      title: 'Student Spotlight: Liam Achieves Top Grade in Math',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
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


      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          {/* 1st View: Header with Profile, Name, Date, and Dots */}
          <View style={styles.headerRow}>
            <Image
              source={{ uri: post.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.teacherName}>{post.teacherName}</Text>
              <Text style={styles.date}>{post.date}</Text>
            </View>
            <Icon name="dots-vertical" size={28} color="black" />
          </View>

          {/* 2nd View: Post Image */}
          <Image
            source={{ uri: post.postImage }}
            style={styles.postImage}
            resizeMode="cover"
          />

          {/* 3rd View: Post Title */}
          <Text style={styles.postTitle}>{post.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  postCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,

  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f1f1f1',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#7b68ee',
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#7b68ee',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius:10
  },
  postTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    padding: 8,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
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
});

export default WallScreen;
