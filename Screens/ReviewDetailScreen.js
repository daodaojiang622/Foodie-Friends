import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import Rating from '../Components/Rating';
import ImageHorizontalScrolling from '../Components/ImageHorizontalScrolling';
import { fetchReviewDetails } from '../Utils/HelperFunctions';
import UserInfo from '../Components/UserInfo';

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
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color={theme.textColor} />
          <Text style={[styles.title, { color: theme.textColor }]}>
              {reviewData.restaurant}
            </Text>
        </View>

        <Rating rating={reviewData.rating} onPress={() => {}}/>

        {/* <View style={styles.locationContainer}>
          <Image 
          source={{ uri: reviewData.profilePhotoUrl || 'https://www.fearfreehappyhomes.com/wp-content/uploads/2021/04/bigstock-Kitten-In-Pink-Blanket-Looking-415440131.jpg' }} style={styles.reviewImage} />
          <Text style={[styles.user, { color: theme.textColor }]}>{reviewData.username}</Text>
        </View> */}
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