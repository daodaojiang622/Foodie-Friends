import { StyleSheet, TextInput, View, Image, Text, Pressable, ScrollView, Alert } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../Components/ScreenWrapper';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [location, setLocation] = useState(null);

  const handleAddPost = () => {
    if (auth.currentUser) {
      navigation.navigate('EditPost');
    } else {
      Alert.alert('Authentication Required', 'Please log in to add a new post');
      navigation.navigate('SignUpScreen');
    }
  };

  // Function to load posts from Firebase
  const loadPosts = async () => {
    const data = await fetchDataFromDB('posts');
    setPosts(data);
  };

  // Load posts once on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Reload posts each time HomeScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [])
  );

  // Fetch location and nearby reviews
  const fetchLocationAndReviews = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch nearby reviews.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const { latitude, longitude } = loc.coords;
      const radius = 5000; // 5 km radius
      const minRating = 3.8;
      const apiKey = process.env.EXPO_PUBLIC_apiKey;

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${apiKey}`;
      const response = await axios.get(url);

      const nearbyReviews = response.data.results
        .filter((place) => place.rating >= minRating)
        .map((place) => ({
          id: place.place_id,
          name: place.name,
          rating: place.rating,
          images: place.photos
            ? [
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`,
              ]
            : [],
        }));

      setReviews(nearbyReviews.slice(0, 2)); // Limit to 1-2 reviews for display
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load posts and reviews on component mount
  useEffect(() => {
    loadPosts();
    fetchLocationAndReviews();
  }, []);

  // Unified render function for posts and reviews
  const renderRow = (rowItems, rowIndex) => (
    <View style={styles.row} key={`row-${rowIndex}`}>
      {rowItems.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => navigation.navigate('ReviewDetailScreen', { postId: item.id })}
          style={styles.imageWrapper}
        >
          {item.images?.[0] ? (
            <Image source={{ uri: item.images[0] }} style={styles.image} />
          ) : (
            <Text>No Image Available</Text>
          )}
          <Text style={styles.title}>
            {item.name || item.description.split(' ').slice(0, 5).join(' ')}...
          </Text>
          {item.rating && <Text style={styles.rating}>Rating: {item.rating.toFixed(1)}</Text>}
        </Pressable>
      ))}
    </View>
  );

  // Combine posts and reviews for rendering
  const combinedData = [...posts, ...reviews];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.textColor }]}>Nearby Hot Spots</Text>
        <Pressable onPress={handleAddPost} style={styles.addPostButton}>
          <Ionicons name="create-sharp" style={[styles.addPostIcon, { color: theme.textColor }]} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Array.from({ length: Math.ceil(combinedData.length / 2) }, (_, index) => 
         renderRow(combinedData.slice(index * 2, index * 2 + 2), index) // Pass rowIndex as the second argument
       )}
      </ScrollView>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageWrapper: {
    margin: 5,
    alignItems: 'center',
    width: 180,
    backgroundColor: "#c2d1c6",
  },
  image: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
    width: 180,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 5,
  },
  username: {
    fontSize: 12,
  },
  likes: {
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginTop: 80,
  },
  addPostIcon: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
