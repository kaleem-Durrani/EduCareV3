import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_BASE_URL } from '@env';

const WallScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const token = await AsyncStorage.getItem('accessToken');

      const response = await axios.get(`http://tallal.info:5500/api/posts`, {
        params: {
          page: pageNum,
          per_page: 10
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const newPosts = response.data.posts;
      
      if (refresh || pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }

      setHasMore(newPosts.length === response.data.per_page);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setPage(1);
    fetchPosts(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= 
      contentSize.height - paddingToBottom;
  };

  if (loading && page === 1) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          loadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="back" size={28} color="#000" />
        </TouchableOpacity>

        <Image 
          source={require('../../../../assets/images/EducareLogo.png')} 
          style={styles.logo} 
        />
        <View style={styles.divider} />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
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

          <Image
            source={{ uri: post.postImage }}
            style={styles.postImage}
            resizeMode="cover"
          />

          <Text style={styles.postTitle}>{post.title}</Text>
        </View>
      ))}

      {loading && page > 1 && (
        <ActivityIndicator style={styles.loadingMore} size="small" color="#4169e1" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 15,
    zIndex: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
    fontFamily: 'Poppins-Regular',
  },
  loadingMore: {
    padding: 16,
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
    borderColor: '#4169e1',
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4169e1',
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
});

export default WallScreen;
