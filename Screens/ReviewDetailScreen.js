import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB, deleteFromDB } from '../Firebase/firestoreHelper';

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { postId, images = [] } = route.params; // Default to an empty array if images is not provided

  // State to hold review data
  const [reviewData, setReviewData] = useState({
    title: route.params?.title || '',
    description: route.params?.description || '',
    imageUri: route.params?.imageUri || '',
    rating: route.params?.rating || 0,
  });

  // Fetch data from Firebase if data was not passed as navigation parameters
  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewData.title || !reviewData.description) {
        const allPosts = await fetchDataFromDB('posts');
        const post = allPosts.find((p) => p.id === postId);
        if (post) {
          setReviewData({
            title: post.title,
            description: post.description,
            imageUri: post.imageUri,
            rating: post.rating,
          });
        }
      }
    };
    fetchReview();
  }, [postId]);

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this review?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await deleteFromDB(postId, 'posts');
          navigation.goBack();
        },
        style: "destructive",
      },
    ]);
  };

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, index) => (
      <Ionicons key={index} name="star" size={40} color="gold" />
    ));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="trash"
          size={24}
          color="white"
          onPress={handleDelete}
          style={{ marginRight: 15 }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {reviewData.imageUri ? (
        <Image source={{ uri: reviewData.imageUri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: theme.textColor }}>No Image Available</Text>
        </View>
      )}
      <Text style={[styles.title, { color: theme.textColor }]}>{reviewData.title}</Text>
      <Text style={[styles.description, { color: theme.textColor }]}>{reviewData.description}</Text>
      <View style={styles.ratingContainer}>
        {renderStars(reviewData.rating)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    fontSize: 50,
  },
});
