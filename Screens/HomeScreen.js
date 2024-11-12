import { StyleSheet, TextInput, View, Image, Text, Pressable, FlatList, Alert } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../Components/ScreenWrapper';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup'; // Import auth instance

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);

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

  const handleSearch = async () => {
    const apiKey = 'YOUR_GOOGLE_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&type=restaurant&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;

      const fetchedMarkers = results.map((place) => ({
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        name: place.name,
      }));

      console.log(fetchedMarkers);
    } catch (error) {
      console.error('Error fetching data from Google Places API', error);
    }
  };

  const handleEditPost = (post) => {
    navigation.navigate('EditPost', {
      postId: post.id,
      initialTitle: post.title,
      initialDescription: post.description,
      initialImages: post.images,
    });
  };

  const handleAddPost = () => {
    if (auth.currentUser) {
      navigation.navigate('EditPost');
    } else {
      Alert.alert('Authentication Required', 'Please log in to add a new post');
      navigation.navigate('SignUpScreen'); // Redirect to the signup/login screen if not logged in
    }
  };

  const renderPost = ({ item }) => (
    <Pressable onPress={() => navigation.navigate('ReviewDetailScreen', { postId: item.id, images: item.images })} style={styles.imageWrapper}>
      <Image source={{ uri: item.images[0] }} style={styles.image} /> 
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.userProfileImage }} style={styles.profileImage} />
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <Text style={styles.likes}>{item.likes} Likes</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.textColor }]}>Checkout the latest hotspots</Text>
        <Pressable onPress={handleAddPost} style={styles.addPostButton}>
          <Ionicons name="create-sharp" style={[styles.addPostIcon, { color: theme.textColor }]} />
        </Pressable>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search for restaurants..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.imageContainer}
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
  imageContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
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
