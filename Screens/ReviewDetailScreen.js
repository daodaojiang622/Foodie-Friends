import React, { useState, useContext } from 'react';
import { View, TextInput, Image, Text, Pressable, ScrollView, Dimensions, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../Firebase/firebaseSetup';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const route = useRoute();

  const postId = route.params?.postId || null;

  const [description, setDescription] = useState(route.params?.initialDescription || '');
  const [images, setImages] = useState(route.params?.images || []);
  const [rating, setRating] = useState(route.params?.rating || 0);
  const [restaurant, setRestaurant] = useState(route.params?.initialRestaurant || ''); 
  const [profilePhoto, setProfilePhoto] = useState(route.params?.profile_photo_url || null);
  const [user, setUser] = useState(route.params?.user || '');

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.imageContainer}>
            { images.length == 0 ? (
              <Text style={styles.noImageText}>No Image</Text>
              ) : (
              <ScrollView horizontal style={styles.imageScroll}>
              {images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.image} />
              ))}
            </ScrollView>
            )}
        </View>
        
        <View style={styles.restaurantContainer}>
          <Ionicons name="location-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
          <TextInput
            style={[styles.restaurantText, { color: theme.textColor }]}
            value={restaurant}
          />
        </View>

        <View style={[styles.ratingContainer]}>
        <Text style={[styles.label, { color: theme.textColor }]}></Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <View key={star}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={16}
                color={star <= rating ? theme.textColor : "#aaa"}
              />
            </View>
          ))}
        </View>
        
        <View style={styles.userContainer}>
          <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
          <Text style={[styles.userText, { color: theme.textColor }]}>
            {user}
          </Text>
        </View>

        <Text style={[styles.label, { color: theme.textColor }]}>Review Details</Text>
        <TextInput
          style={[styles.descriptionInput, { borderColor: theme.textColor }]}
          value={description}
          multiline
          editable={false}
        />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  descriptionInput: {
    marginVertical: 10,
    textAlignVertical: 'top', 
    marginBottom: 200,
  },
  imageScroll: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  image: {
    width: width - 40,
    height: 300,
  },
  imageContainer: {
    width: width - 40,
    height: 300,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#aaa',
    marginTop: 5,
    fontSize: 80,
    padding: 30,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -90,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
  },
  imageContainer: {
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 20,
  },
  restaurantText: {
    marginLeft: 10,
    width: width - 70,
    fontWeight: 'bold',
    fontSize: 16,
  },
  restaurantContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
