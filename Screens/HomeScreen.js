import { StyleSheet, TextInput, View, Image, Text, Pressable, Alert, FlatList } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../Components/ScreenWrapper';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageToken, setPageToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // New state for pull-to-refresh

  const handleAddPost = () => {
    if (auth.currentUser) {
      navigation.navigate('EditPost');
    } else {
      Alert.alert('Authentication Required', 'Please log in to add a new post');
      navigation.navigate('SignUpScreen');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true); // Start refresh spinner
    setPageToken(null); // Reset pagination
    await fetchLocationAndReviews(); // Reload reviews
    setRefreshing(false); // Stop refresh spinner
  };

  // Fetch posts from the database
  const loadPosts = async () => {
    const data = await fetchDataFromDB('posts');
    setPosts(data);
  };

  // // Fetch location and nearby reviews with pagination
  // const fetchLocationAndReviews = async (nextPageToken = null) => {
  //   setLoading(true);

  //   try {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission Denied', 'Location permission is required to fetch nearby reviews.');
  //       setLoading(false);
  //       return;
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location:', error);
  //     setLoading(false);
  //     return;
  //   }
  // };

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

      // API URL for fetching reviews with pagination support
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}`;

      if (nextPageToken) {
        url += `&pagetoken=${nextPageToken}`;
      }

      const response = await axios.get(url);

      const allowedKeywords = ["restaurant", "bar", "food", "delicious"];
      const disallowedKeywords = ["hotel", "inn", "hostel", "motel", "resort", "lodge", "apartment", "sheraton", "rosewood", "hilton", "marriott", "hyatt", "pan pacific"];
    
      // Function to filter reviews based on keywords
      const filterReview = (reviewText) => {
        return allowedKeywords.some((keyword) => reviewText.toLowerCase().includes(keyword)) &&
          !disallowedKeywords.some((keyword) => reviewText.toLowerCase().includes(keyword));
      };
  
      // Fetch detailed reviews for each place and filter based on keywords
      const nearbyReviews = [];
      for (const place of response.data.results) {
        const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=${apiKey}`;
        const placeDetailsResponse = await axios.get(placeDetailsUrl);
  
          // Extract reviews from place details and filter them
          const filteredReviews = placeDetailsResponse.data.result.reviews
          ?.filter((review) => filterReview(review.text))
          .map((review) => ({
            authorName: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.relative_time_description,
          }));

          nearbyReviews.push({
            id: place.place_id,
            name: place.name,
            rating: place.rating,
            images: place.photos
              ? [
                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`,
                ]
              : [],
            reviews: filteredReviews || [], // Include reviews if available
          });
        }
  
      setReviews((prevReviews) => [...prevReviews, ...nearbyReviews]); // Append new reviews
      setPageToken(response.data.next_page_token); // Update the page token for next batch of reviews
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

  // Render item for FlatList
  const renderRow = ({ item }) => (
    <Pressable
      key={item.id}
      onPress={() => navigation.navigate('ReviewDetailScreen', { postId: item.id })}
      style={styles.imageWrapper}
    >
      {item.images?.[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : (
        <MaterialCommunityIcons name="image-off-outline" size={180} color="black" />
      )}
      <Text style={styles.title}>
        {item.description ? item.description.split(' ').slice(0, 5).join(' ') + '...' : ''}
      </Text>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {item.name ? item.name.split(' ').slice(0, 2).join(' ') + '...' : ''}
        </Text>
        {item.rating && <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>}
      </View>
    </Pressable>

//   // Unified render function for posts and reviews
//   const renderRow = (rowItems, rowIndex) => (
//     <View style={styles.row} key={`row-${rowIndex}`}>
//       {rowItems.map((item) => (
//         <Pressable
//           key={item.id}
//           onPress={() => navigation.navigate('ReviewDetailScreen', { postId: item.id })}
//           style={styles.imageWrapper}
//         >
//           {item.images?.[0] ? (
//             <Image source={{ uri: item.images[0] }} style={styles.image} />
//           ) : (
//             <Text>No Image Available</Text>
//           )}

//           <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">

//             {item.name || item.description.split(' ').slice(0, 5).join(' ')}...
//           </Text>
//           {item.rating && <Text style={styles.rating}>Rating: {item.rating.toFixed(1)}</Text>}
//         </Pressable>
//       ))}
//     </View>

  );

  // Combine posts and reviews for rendering
  const combinedData = [...posts, ...reviews];

  // Handle when user reaches the end of the list to load more reviews
  const handleLoadMore = () => {
    if (pageToken && !loading) {
      fetchLocationAndReviews(pageToken);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.textColor }]}>Explore Nearby</Text>
        <Pressable onPress={handleAddPost} style={styles.addPostButton}>
          <Ionicons name="create-sharp" style={[styles.addPostIcon, { color: theme.textColor }]} />
        </Pressable>
      </View>

      <FlatList
        data={combinedData}
        renderItem={renderRow}
        keyExtractor={(item, index) => `item-${item.id}-${index}`}
        numColumns={2} // Display 2 items per row
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Trigger loading when 50% of the list is reached
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
        contentContainerStyle={styles.scrollContainer}
        refreshing={refreshing} // Pull-to-refresh spinner
        onRefresh={onRefresh} // Trigger refresh function
      />
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
  rating: {
    fontSize: 15,
    fontWeight: 'bold',
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    textAlign: 'left',
  },
  rating: {
    fontSize: 12,
    textAlign: 'right',
  },
});