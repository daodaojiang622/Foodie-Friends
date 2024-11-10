import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const route = useRoute();
  const { reviewId } = route.params;
  const [review, setReview] = useState(null);

  useEffect(() => {
    const loadReview = async () => {
      const data = await fetchDataFromDB('reviews');
      const selectedReview = data.find((r) => r.id === reviewId);
      setReview(selectedReview);
    };
    loadReview();
  }, [reviewId]);

  if (!review) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: review.imageUri }} style={styles.image} />
      <Text style={[styles.title, { color: theme.textColor }]}>{review.title}</Text>
      <Text style={styles.details}>{review.details}</Text>
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
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
  },
});
