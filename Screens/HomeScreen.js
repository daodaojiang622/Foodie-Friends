import { StyleSheet, View, Image, Text, Pressable, FlatList, Alert } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../Components/ScreenWrapper';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';
import { ContainerStyle, Padding, Align, Font } from '../Utils/Style';

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageToken, setPageToken] = useState(null);
  const [noMorePosts, setNoMorePosts] = useState(false);

  // Function to load posts from Firebase
  const loadPosts = async () => {
    try {
      const data = await fetchDataFromDB('posts');
      // Shuffle posts to display them in a random order
      const shuffledPosts = data.sort(() => Math.random() - 0.5);
      setPosts(shuffledPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      Alert.alert('Error', 'Unable to load posts. Please try again.');
    }
  };

  // Load posts once on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  // Handle adding a new post
  const handleAddPost = () => {
    if (auth.currentUser) {
      navigation.navigate('EditPost');
    } else {
      Alert.alert('Authentication Required', 'Please log in to add a new post');
      navigation.navigate('SignUpScreen');
    }
  };

  // Fetch location and nearby reviews with pagination
  const fetchLocationAndReviews = async (nextPageToken = null) => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch nearby reviews.');
        setLoading(false);
        return;
      }
  
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
  
      // Fetch data with pagination support
      const data = await fetchDataFromDB('posts', nextPageToken); // Ensure this function accepts and processes pageToken
      const shuffledPosts = data.posts.sort(() => Math.random() - 0.5);
  
      setPosts((prevPosts) => [...prevPosts, ...shuffledPosts]);
      setPageToken(data.nextPageToken); // Update the page token
      if (!data.nextPageToken) {
        setNoMorePosts(true);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'Unable to load more posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      onPress={() => navigation.navigate('ReviewDetailScreen', { postId: item.id, images: item.images, user: item.userId })}
      style={styles.imageWrapper}
    >
      {item.images?.[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : ''}
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
      {item.description}
      </Text>
    </Pressable>
  );

  // Handle when user reaches the end of the list to load more reviews
  const handleLoadMore = async () => {
    if (!pageToken || loading) {
      // If no more posts or still loading
      if (!pageToken) {
        setNoMorePosts(true);
      }
      return;
    }
  
    await fetchLocationAndReviews(pageToken);
  };
  
  


  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.textColor }]}>Nearby Hot Spots</Text>
        <Pressable onPress={handleAddPost} style={styles.addPostButton}>
          <Ionicons name="create-sharp" style={[styles.addPostIcon, { color: theme.textColor }]} />
        </Pressable>
      </View>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.scrollContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh} // Pull-to-refresh function
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Trigger loading when 50% of the list is reached
        ListFooterComponent={
          loading ? (
            <Text style={styles.footerText}>Loading...</Text>
          ) : noMorePosts ? (
            <Text style={styles.footerText}>No more posts...</Text>
          ) : null
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: ContainerStyle.flex,
  },
  scrollContainer: {
    padding: Padding.large,
    alignItems: Align.center,
  },
  imageWrapper: {
    margin: Padding.small,
    alignItems: Align.center,
    width: 180,
    backgroundColor: '#c2d1c6',
  },
  image: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: Font.sizeSmall,
    margin: Padding.large,
    width: 180,
  },
  header: {
    flexDirection: ContainerStyle.flexDirection,
    justifyContent: ContainerStyle.spaceBetween,
    alignItems: Align.center,
    margin: Padding.large,
    marginTop: 80,
  },
  addPostIcon: {
    fontSize: Font.sizeXLarge,
  },
  headerText: {
    fontSize: Font.sizeLarge,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: Align.center,
    fontSize: Font.sizeMedium,
    color: '#666',
    marginVertical: Padding.large,
  },
});
