import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB, deleteFromDB } from '../Firebase/firestoreHelper';

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;

  // State to hold review data
  const [reviewData, setReviewData] = useState({
    title: route.params?.title || '',
    description: route.params?.description || '',
    imageUri: route.params?.imageUri || '',
    rating: route.params?.rating || '',
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

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </Pressable>
        <Pressable onPress={handleDelete}>
          <Ionicons name="trash" size={24} color="red" />
        </Pressable>
      </View>
      
      {reviewData.imageUri ? (
        <Image source={{ uri: reviewData.imageUri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: theme.textColor }}>No Image Available</Text>
        </View>
      )}
      <Text style={[styles.title, { color: theme.textColor }]}>{reviewData.title}</Text>
      <Text style={[styles.description, { color: theme.textColor }]}>{reviewData.description}</Text>
      <Text style={[styles.rating, { color: theme.textColor }]}>Rating: {reviewData.rating} ⭐</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
