import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert, ScrollView, Dimensions, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB, deleteFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup'; 

const { width } = Dimensions.get('window');

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;

  const [reviewData, setReviewData] = useState({
    title: route.params?.title || '',
    description: route.params?.description || '',
    images: route.params?.images || [],
    rating: route.params?.rating || 0,
    userId: '', // Add userId to store the post creator's ID
  });

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewData.title || !reviewData.description) {
        const allPosts = await fetchDataFromDB('posts');
        const post = allPosts.find((p) => p.id === postId);
        if (post) {
          setReviewData({
            title: post.title || '',
            description: post.description || '',
            images: post.images || [],
            rating: post.rating || 0,
            userId: post.userId || '', // Store the userId of the post creator
          });
        }
      }
    };
    fetchReview();
  }, [postId]);

  const handleDelete = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (reviewData.userId === currentUserId) {
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
    } else {
      Alert.alert("Permission Denied", "You can only delete your own posts.");
    }
  };


  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, index) => (
      <Ionicons key={index} name="star" size={20} color="gold" paddingBottom={20} />
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
      <View style={styles.textContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageScrollView}
      >
        {reviewData.images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.textColor }]}>{reviewData.title}</Text>
      </View>

      <View style={styles.ratingContainer}>
          {renderStars(reviewData.rating)}
      </View>

      <View style={styles.restaurantContainer}>
        <Ionicons name="location-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <Button 
          title='Restaurant'
          onPress={() => navigation.navigate('RestaurantDetailScreen')}
          color={theme.textColor}
        />
        </View>

        <Text style={[styles.description, { color: theme.textColor }]}>{reviewData.description}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageScrollView: {
    alignItems: 'center',
  },
  image: {
    width: width, // Full screen width
    height: 300,
    resizeMode: 'cover',
  },
  textContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingBottom: 10,
  },
  locationIcon: {
    fontSize: 24,
  },
});
