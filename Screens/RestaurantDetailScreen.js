import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert, ScrollView, Dimensions, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB, deleteFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup'; 

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const [reviewData, setReviewData] = useState(null)

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
    <View style={styles.textContainer}>
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.imageScrollView}
    >
      {/* {reviewData.images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.image} />
      ))} */}
    </ScrollView>
    </View>

    <View style={styles.textContainer}>
      <Text style={[styles.title, { color: theme.textColor }]}>The Lunch Lady</Text>
    </View>
    
    <Text style={[styles.cusineType, { color: theme.textColor }]}>Vietnamese restaurant</Text>

    <View style={styles.infoContainer}>
        {/* {renderStars(reviewData.rating)} */}
        <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />

    </View>

    <View style={styles.infoContainer}>
      <Ionicons name="location-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
      <Text style={[styles.infoText, { color: theme.textColor }]}>
      Restaurant address
      </Text>
    </View>

    <View style={styles.infoContainer}>
      <Ionicons name="call-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
      <Text style={[styles.infoText, { color: theme.textColor }]}>
        (123) 456-7890
      </Text>
    </View>

    <View style={styles.infoContainer}>
      <Ionicons name="time-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
      <Text style={[styles.infoText, { color: theme.textColor }]}>
          11 AM - 1 PM; 5PM - 9PM; Closed on Mondays and Tuesdays
      </Text>
    </View>


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
});