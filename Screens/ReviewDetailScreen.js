import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import Rating from '../Components/Rating';
import ImageHorizontalScrolling from '../Components/ImageHorizontalScrolling';
import { fetchReviewDetails } from '../Utils/HelperFunctions';
import UserInfo from '../Components/UserInfo';
import RestaurantLocation from '../Components/RestaurantLocation';

const { width } = Dimensions.get('window');

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
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
        try {
          const fetchedData = await fetchReviewDetails(postId);
          if (fetchedData) {
            setReviewData(fetchedData);
          }
        } catch (error) {
          console.error('Error fetching review data:', error);
        }
      }
    };
    fetchReview();
  }, [postId]);

  return (
    <ScrollView style={[styles.scrollView, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.textContainer}>
        <ImageHorizontalScrolling images={reviewData.images} imageStyle={styles.image}/>
        </View>
        <View style={styles.textContainer}>
        
        <RestaurantLocation restaurantName={reviewData.restaurant} textColor={theme.textColor} />

        <Rating rating={reviewData.rating} onPress={() => {}}/>

        <UserInfo profilePhotoUrl={reviewData.profilePhotoUrl} username={reviewData.username} textColor={theme.textColor} />

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
  image: {
    width: width, 
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