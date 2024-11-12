import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';

export default function FoodGalleryScreen() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadGallery = async () => {
      const reviews = await fetchDataFromDB('reviews');
      const photos = reviews.map((review) => review.imageUri).filter(Boolean);
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
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});
