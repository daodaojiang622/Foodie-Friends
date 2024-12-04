import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import Rating from '../Components/Rating';
import ImageHorizontalScrolling from '../Components/ImageHorizontalScrolling';
import { fetchReviewDetails } from '../Utils/HelperFunctions';
import UserInfo from '../Components/UserInfo';
import RestaurantLocation from '../Components/RestaurantLocation';
import { Align, BorderWidth, Colors, ContainerStyle, Padding, Width, BorderRadius, Font, Margin, Resize, Height } from '../Utils/Style';

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

        <Rating rating={reviewData.rating} style={styles.rating} onPress={() => {}}/>

        <UserInfo profilePhotoUrl={reviewData.profilePhotoUrl} username={reviewData.username} textColor={theme.textColor} />

        <Text style={[styles.description, { color: theme.textColor }]}>{reviewData.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: ContainerStyle.flex,
  },
  image: {
    width: width, 
    height: Height.postImageLarge,
    resizeMode: Resize.cover,
  },
  textContainer: {
    paddingHorizontal: Padding.xlarge,
    marginTop: Margin.small,
  },
  title: {
    fontSize: Font.sizeMedium,
    marginBottom: Margin.small,
    marginTop: Margin.small,
  },
  description: {
    fontSize: Font.sizeLarge,
    marginTop: Margin.large,
    marginBottom: Margin.large,
    fontStyle: 'italic',
  },
  locationContainer: {
    flexDirection: ContainerStyle.flexDirection,
    alignItems: Align.center,
  },
  reviewImage: {
    width: Width.image,
    height: Width.image,
    borderRadius: BorderRadius.xxxlarge,
    marginRight: Margin.small,
    marginBottom: Padding.negative,
  },
  user: {
    fontSize: Font.sizeMedium,
    marginTop: Margin.large,
    marginBottom: Padding.zero,
  },
  rating: {
    marginTop: Margin.small,
  },
});