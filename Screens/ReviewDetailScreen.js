import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert, ScrollView, Dimensions, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB, deleteFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup'; // Import auth

const { width } = Dimensions.get('window');

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;

  const [reviewData, setReviewData] = useState({
    description: route.params?.description || '',
    images: route.params?.images || [],
    rating: route.params?.rating || 0,
    restaurant: route.params?.restaurantName || '', 
    profilePhotoUrl: route.params?.profile_photo_url,
    username: route.params?.user || 'Anonymous',  
  });  

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewData.title || !reviewData.description) {
        const allPosts = await fetchDataFromDB('posts');
        const post = allPosts.find((p) => p.id === postId);
        if (post) {
          // Fetch the user data from the users collection
          const allUsers = await fetchDataFromDB('users');
          const user = allUsers.find((u) => u.userId === post.userId);
          setReviewData({
            description: post.description || '',
            images: post.images || [],
            rating: post.rating || 0,
            userId: post.userId || '', // Store the userId of the post creator
            restaurant: post.restaurantName ||'',
            profilePhotoUrl: user?.profileImage,
            username: user?.username || 'Anonymous',
          });
        }
      }
    };
    fetchReview();
  }, [postId]);


  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, index) => (
      <Ionicons key={index} name="star" size={16} color="gold" />
    ));
  };

  return (
    <ScrollView style={[styles.scrollView, {backgroundColor: theme.backgroundColor}]}>
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
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color={theme.textColor} />
          <Text style={[styles.title, { color: theme.textColor }]}>
              {reviewData.restaurant}
            </Text>
        </View>

        <View style={styles.ratingContainer}>
          {renderStars(reviewData.rating)}
          <Text style={[styles.rating, {color: theme.textColor}]}>({reviewData.rating})</Text>
        </View>

        <View style={styles.locationContainer}>
          <Image 
          source={{ uri: reviewData.profilePhotoUrl || 'https://www.fearfreehappyhomes.com/wp-content/uploads/2021/04/bigstock-Kitten-In-Pink-Blanket-Looking-415440131.jpg' }} style={styles.reviewImage} />
          <Text style={[styles.user, { color: theme.textColor }]}>{reviewData.username}</Text>
        </View>

        <Text style={[styles.description, { color: theme.textColor }]}>{reviewData.description}</Text>
        </View>
      </View>
    </ScrollView>
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
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: -10,
  },
  user: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
  },
});