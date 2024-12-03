import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';
import { BorderRadius, ContainerStyle, Padding, Width } from '../Utils/Style';

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
    flex: ContainerStyle.flex,
    paddingHorizontal: Padding.small, // Padding on both sides for even spacing
    paddingTop: Padding.large,
  },
  image: {
    width: Width.xsmall, // Ensure consistent size for each image in 3-column layout
    aspectRatio: ContainerStyle.flex, // Maintain square shape
    margin: Padding.small, // Uniform margin for spacing
    borderRadius: BorderRadius.smallMedium, // Optional for rounded corners
  },
});
