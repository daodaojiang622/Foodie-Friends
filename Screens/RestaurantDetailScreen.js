import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Alert, ScrollView, Dimensions, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchDataFromDB, deleteFromDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup'; 
import PressableButton from '../Components/PressableButtons/PressableButton';

const { width } = Dimensions.get('window');

const localImages = [
  require('../SamplePhotos/TheLunchLady0.png'),
  require('../SamplePhotos/TheLunchLady1.png'),
  require('../SamplePhotos/TheLunchLady2.png'),
  require('../SamplePhotos/TheLunchLady3.png'),
];

export default function RestaurantDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const [reviewData, setReviewData] = useState(null)
  const navigation = useNavigation();

  const handleCreateReview = () => {
    navigation.navigate('EditReview');
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      
      {/* <Ionicons name="images" size={350} style={{marginLeft: 20}}/> */}

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
        {localImages.map((image, index) => (
            <Image key={index} source={image} style={styles.image} />
          ))}
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
        1046 Commercial Dr, Vancouver, BC V5L 3W9
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="call-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <Text style={[styles.infoText, { color: theme.textColor }]}>
        +16045595938
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="time-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <Text style={[styles.infoText, { color: theme.textColor }]}>
            11 AM - 1 PM; 5PM - 9PM; Closed on Mondays and Tuesdays
        </Text>
      </View>

      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Reviews</Text>
        <ScrollView style={styles.section}>
          <View style={styles.noReviewContainer}>
            <Text style={styles.noReviewText}>No review</Text>
            <PressableButton 
              title="Create a review" 
              onPress={handleCreateReview} 
              textStyle={{ color: theme.buttonColor, fontSize: 18 }}
            />
          </View>
          {/* {reviewData.length === 0 ? (
            <View style={styles.noMeetUpsContainer}>
              <Text style={styles.noMeetUpText}>No review</Text>
              <PressableButton 
                title="Create a review" 
                onPress={handleCreateMeetUp} 
                textStyle={{ color: theme.buttonColor, fontSize: 18 }}
              />
            </View>
          ) : (
            reviewData.map((meetUp, index) => (
              <Pressable key={index} onPress={() => handleEditMeetUp(meetUp, false)}>
                <View key={index} style={styles.meetUpItem}>

                  <View style={styles.meetUpContainer}>
                    <Ionicons name="images" size={40} style={{marginRight: 10}}/>

                    <View style={styles.meetUpInfoContainer}>
                      <Text style={styles.meetUpTitle}>{meetUp.restaurant}</Text>
                      <View style={styles.meetUpDateTimeContainer}>
                        <Ionicons name="time-outline" style={styles.meetUpDateTimeIcon} />
                        <Text style={styles.meetUpText}>{meetUp.time}, {meetUp.date}</Text>
                      </View>
                    </View>

                    <View style={styles.deleteButtonContainer}>
                      <Ionicons 
                        name="trash" 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMeetUp(meetUp.id)}
                      />
                    </View>

                  </View>
                </View>
              </Pressable>
            ))
          )} */}
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
  marginLeft: 20,
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
});