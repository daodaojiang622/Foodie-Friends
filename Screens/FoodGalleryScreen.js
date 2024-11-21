import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';

export default function FoodGalleryScreen() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Load images for the current user's posts
    const loadGallery = async () => {
      const posts = await fetchDataFromDB('posts');
      const filteredPosts = posts.filter((post) => post.userId === auth.currentUser.uid);
      const photos = filteredPosts.flatMap((post) => post.images || []);
      setImages(photos);
    
    };
    loadGallery();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5, // Padding on both sides for even spacing
    paddingTop: 10,
  },
  image: {
    width: '30%', // Ensure consistent size for each image in 3-column layout
    aspectRatio: 1, // Maintain square shape
    margin: 5, // Uniform margin for spacing
    borderRadius: 8, // Optional for rounded corners
  },
});
