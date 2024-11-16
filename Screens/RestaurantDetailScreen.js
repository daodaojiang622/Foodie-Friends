import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert, ScrollView, Dimensions, Button, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB, deleteFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup'; 
import PressableButton from '../Components/PressableButtons/PressableButton';
import axios from 'axios';

const { width } = Dimensions.get('window');

const localImages = [
  require('../SamplePhotos/TheLunchLady0.png'),
  require('../SamplePhotos/TheLunchLady1.png'),
  require('../SamplePhotos/TheLunchLady2.png'),
  require('../SamplePhotos/TheLunchLady3.png'),
];

const renderStars = (rating) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

  // Create an array of star components
  return (
    <>
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <Ionicons key={`full-${index}`} name="star" style={styles.starIcon} />
        ))}
      {hasHalfStar && <Ionicons name="star-half" style={styles.starIcon} />}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <Ionicons key={`empty-${index}`} name="star-outline" style={styles.starIcon} />
        ))}
    </>
  );
};

export default function RestaurantDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const route = useRoute(); // Get route to access passed parameters
  const navigation = useNavigation();
  const { placeId } = route.params;

  const [restaurant, setRestaurant] = useState(null); // Store fetched restaurant details
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      const apiKey = process.env.EXPO_PUBLIC_apiKey;
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        console.log(response.data); // Log the API response
        const place = response.data.result;
      
        if (!place) {
          throw new Error('No place details found in the API response.');
        }
      
        const restaurantDetails = {
          name: place.name,
          rating: place.rating || 'N/A',
          photos: place.photos
            ? place.photos.map((photo) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
              )
            : [], // Default to empty if no photos
          address: place.formatted_address || 'Address not available',
          phone: place.formatted_phone_number || 'Phone number not available',
        };
      
        setRestaurant(restaurantDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        Alert.alert('Error', 'Unable to fetch restaurant details.');
        setLoading(false);
      }
      
    };

    fetchRestaurantDetails();
  }, [placeId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: theme.textColor }]}>No restaurant details found.</Text>
      </View>
    );
  }

  const handleCreateReview = () => {
    navigation.navigate('EditReview');
  };

  const handleAddPost = () => {
    Alert.alert('Authentication Required', 'Please log in to add a new post');
    navigation.navigate('SignUpScreen'); // Redirect to the signup/login screen
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {/* Restaurant Photos */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollView}
        >
          {restaurant.photos.length > 0 ? (
            restaurant.photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.image} />
            ))
          ) : (
            <Text style={{ color: theme.textColor, padding: 10 }}>No images available</Text>
          )}
        </ScrollView>

        {/* Restaurant Name */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textColor }]}>{restaurant.name}</Text>
        </View>

        {/* Rating */}
        <View style={styles.infoContainer}>
          {renderStars(restaurant.rating)}
          <Text style={[styles.ratingText, { color: theme.textColor }]}>
            ({restaurant.rating})
          </Text>
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <Ionicons name="location-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
          <Text style={[styles.infoText, { color: theme.textColor }]}>
            {restaurant.address || 'Address not available'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="call-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
          <Text style={[styles.infoText, { color: theme.textColor }]}>
            {restaurant.phone || 'Phone number not available'}
          </Text>
        </View>

        {/* Reviews */}
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          <View style={styles.ratingContainer}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Reviews</Text>
            <Pressable onPress={handleAddPost} style={styles.addPostButton}>
              <Ionicons name="create-sharp" style={[styles.addPostIcon, { color: theme.textColor }]} />
            </Pressable>
          </View>

          <ScrollView style={styles.section}>
            <View style={styles.noReviewContainer}>
              <Text style={styles.noReviewText}>No review</Text>
              <PressableButton 
                title="Create a review" 
                onPress={handleCreateReview} 
                textStyle={{ color: theme.buttonColor, fontSize: 18 }}
              />
            </View>
          </ScrollView>
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
infoContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 20,
  paddingBottom: 10,
},
locationIcon: {
  fontSize: 24,
},
infoText: {
  fontSize: 14,
  marginLeft: 10,
},
cusineType: {
  fontSize: 14,
  marginLeft: 20,
  marginVertical: 10,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 20,
  marginBottom: 10,
},
section: {
  flex: 1,
  marginBottom: 10,
  borderColor: 'lightgray',
  borderWidth: 2,
  marginHorizontal: 20,
  marginBottom: 30,
  borderRadius: 10,
},
noReviewText: {
  fontSize: 18,
  marginTop: 30,
},
noReviewContainer: {
  alignItems: 'center',
},
addPostIcon: {
  fontSize: 24,
  marginLeft: 10,
  marginBottom: -10,
},
});