import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Modal
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchLostItems = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('accessToken'); // Replace with your actual token management
      const baseUrl = 'http://tallal.info:5500'; // Replace with your API base URL

      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

      const url = `${baseUrl}/api/lost-items?${queryParams.toString()}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setLostItems(response.data.items);
      } else {
        setError('Failed to fetch lost items');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => fetchLostItems()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="LOST ITEMS" />
      <ScrollView contentContainerStyle={styles.container2}>
        {lostItems.map((item) => (
          <View key={item._id} style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: `http://tallal.info:5500${item.imageUrl}` }} 
                style={styles.image} 
              />
              <TouchableOpacity 
                onPress={() => handleImagePress(item.imageUrl)}
                style={styles.iconContainer}
              >
                <Feather
                  name="zoom-in"
                  size={18}
                  color="grey"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>Item:</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.dateTitle}>Date found:</Text>
              <Text style={styles.date}>
                {new Date(item.dateFound).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Image Zoom Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setShowImageModal(false)}
        >
          <Image 
            source={{ uri: `http://tallal.info:5500${selectedImage}` }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  container2: {
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    // marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ccc',
    // borderWidth: 1,
    borderBottomWidth:1,
    alignItems: 'center',
    width:"97%",
    alignSelf:"center"
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
    borderWidth:1,
    borderColor:"#4169e1",
    borderRadius: 10,

  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 8,
    resizeMode:"contain"
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 1,
    // backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  details: {
    flex: 1,
    marginLeft:2
  },
  title: {
    fontSize: 11,
    color: '#4169e1',
    fontFamily: 'Poppins-Bold',
    marginBottom:-4

  },
  description: {
    fontSize: 10.5,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  dateTitle: {
    fontSize: 11,
    color: '#4169e1',
    fontFamily: 'Poppins-Bold',
    marginBottom:-4
  },
  date: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: '#ff0000',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    right: 1,
    padding: 2,
    zIndex: 1,
  },
});

export default LostItems;
