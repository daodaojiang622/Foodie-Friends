import { StyleSheet, View, Image, Text, Pressable, FlatList, Alert } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../Components/ScreenWrapper';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

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

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      onPress={() => navigation.navigate('ReviewDetailScreen', { postId: item.id, images: item.images })}
      style={styles.imageWrapper}
    >
      {item.images?.[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : ''}
      <Text style={styles.title}>
      {item.description?.trim().split(/\s+/).slice(0, 5).join(' ')}...
      </Text>
    </Pressable>
  );

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
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
    alignItems: 'center',
  },
  imageWrapper: {
    margin: 5,
    alignItems: 'center',
    width: 180,
    backgroundColor: '#c2d1c6',
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
