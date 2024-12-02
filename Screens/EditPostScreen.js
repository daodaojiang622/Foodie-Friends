import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Image, Text, Pressable, ScrollView, StyleSheet, Alert, FlatList, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../Firebase/firebaseSetup';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup'; 
import ImageItem from '../Components/ImageItem';
import ImagePickerHandler from '../Components/ImagePickerHandler';
import Rating from '../Components/Rating';
import ImageHorizontalScrolling from '../Components/ImageHorizontalScrolling';

const { width } = Dimensions.get('window');
const { pickImage, captureImage } = ImagePickerHandler();

export default function EditPostScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();

  const postId = route.params?.postId || null;
  const initialDescription = route.params?.initialDescription || '';
  const initialImages = route.params?.initialImages || [];
  const initialRating = route.params?.initialRating || 0;
  const initialRestaurantName = route.params?.restaurantName || '';
  const [description, setDescription] = useState(initialDescription);
  const [images, setImages] = useState(initialImages);
  const [rating, setRating] = useState(initialRating);
  const [restaurantQuery, setRestaurantQuery] = useState(initialRestaurantName || '');
  const [restaurantSuggestions, setRestaurantSuggestions] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  useEffect(() => {
    if (initialRestaurantName) {
      setRestaurantQuery(initialRestaurantName);
      setSelectedRestaurant({ name: initialRestaurantName, place_id: route.params?.restaurantId || '' });
    }
  }, [initialRestaurantName, route.params?.restaurantId]);

  // Set header text
  useEffect(() => {
    if (postId) {
      navigation.setOptions({ title: 'Edit Post' }); // Editing an existing post
    } else {
      navigation.setOptions({ title: 'Add New Post' }); // Creating a new post
    }
  }, [postId, navigation]);
  
  const fetchSuggestions = async (query) => {
    const apiKey = process.env.EXPO_PUBLIC_apiKey;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&keyword=restaurant|cafe|bar&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      console.log('Restaurant Suggestions:', response.data.predictions);
      const results = response.data.predictions.map((place) => ({
        id: place.place_id,
        description: place.description,
      }));
      setRestaurantSuggestions(results);
    } catch (error) {
      console.error('Error fetching restaurant suggestions:', error);
    }
  };
  
  const handleSearchChange = (query) => {
    setRestaurantQuery(query);
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setRestaurantSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    console.log("Selected suggestion:", suggestion); // Debug
  
    // Extract the name (part before the first punctuation mark)
    const name = suggestion.description.split(/[,]/)[0].trim();
  
    // Update the search bar to show the full description
    setRestaurantQuery(suggestion.description);
  
    // Update the selected restaurant with extracted name and place_id
    setSelectedRestaurant({
      name: name, // Extracted name
      place_id: suggestion.id, // Assign the id to place_id
    });
  
    // Clear suggestions after selecting
    setRestaurantSuggestions([]);
  };  

  const pickImageForPost = async () => {
    const selectedImageUri = await pickImage();
    if (selectedImageUri) {
      setImages([...images, selectedImageUri]); // Add the image to the list
    }
  };
  
  const captureImageForPost = async () => {
    const capturedImageUri = await captureImage();
    if (capturedImageUri) {
      setImages([...images, capturedImageUri]); // Add the image to the list
    }
  };
  
  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Review details are required.');
      return;
    }
  
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating.');
      return;
    }
  
    if (!selectedRestaurant || !selectedRestaurant.name) {
      Alert.alert('Error', 'Please select a restaurant.');
      return;
    }
  
    const userId = auth.currentUser?.uid;
  
    try {
      const uploadedImageURLs = await Promise.all(
        images.map(async (uri) => {
          if (uri.startsWith('http')) {
            return uri;
          } else {
            return await uploadImageToFirebase(uri);
          }
        })
      );
  
      const newData = {
        description,
        images: uploadedImageURLs,
        rating,
        userId,
        restaurantName: selectedRestaurant.name,
        restaurantId: selectedRestaurant.place_id,
        time: Date.now(),
      };
  
      Alert.alert('Confirm Save', 'Are you sure you want to save this post?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async () => {
            try {
              if (postId) {
                await updateDB(postId, newData, 'posts');
              } else {
                await writeToDB(newData, 'posts');
              }
              navigation.goBack();
            } catch (error) {
              console.error('Error saving post:', error);
              Alert.alert('Save Error', 'There was a problem saving your post.');
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Upload Error', 'Failed to upload images. Please try again.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };
  
  const uploadImageToFirebase = async (uri) => {
    try {
      if (!uri) {
        throw new Error('Invalid URI');
      }
  
      console.log('Uploading Image URI:', uri);
  
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.statusText}`);
      }
      const blob = await response.blob();
  
      const fileName = `${Date.now()}.jpg`;
  
      const storageRef = ref(storage, `images/${fileName}`);
  
      const snapshot = await uploadBytes(storageRef, blob);
  
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Image uploaded successfully. URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {/* Restaurant Search */}
        <Text style={[styles.label, { color: theme.textColor }]}>Search for Restaurant</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.textColor }]}
          placeholder="Enter restaurant name"
          value={restaurantQuery}
          onChangeText={handleSearchChange}
          clearButtonMode="while-editing"
        />
        {restaurantSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
          <FlatList
            data={restaurantSuggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSuggestionSelect(item)}
                style={styles.suggestionItem}
              >
                <Text style={[styles.suggestionText, { color: theme.textColor }]}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        )}
        {/* Review Details */}
        <Text style={[styles.label, { color: theme.textColor }]}>Review Details</Text>
        <TextInput
          style={[styles.descriptionInput, { borderColor: theme.textColor }]}
          placeholder="Enter a detailed review"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={[styles.label, { color: theme.textColor }]}>Images</Text>
        <View>
        {/* <ScrollView horizontal style={styles.imageScroll}>
          {images.map((uri, index) => (
            <ImageItem
            key={index}
            uri={uri}
            onDelete={() => setImages(images.filter((_, imgIndex) => imgIndex !== index))}
          />
        ))} */}
          <ImageHorizontalScrolling images={images} setImages={images}/>
          <Pressable
            onPress={() => {
              Alert.alert('Add Image', 'Choose an image source', [
                { text: 'Camera', onPress: captureImageForPost },
                { text: 'Gallery', onPress: pickImageForPost },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
            style={styles.addImageContainer}
          >
            <Ionicons name="add" size={40} color="#aaa" />
            <Text style={styles.addImageText}>Add Image</Text>
          </Pressable>
        {/* </ScrollView> */}
        </View>

        <Rating rating={rating} onPress={setRating} />

        <View style={styles.buttonContainer}>
          <PressableButton title="Cancel" onPress={handleCancel} buttonStyle={styles.cancelButton} />
          <PressableButton title="Save" onPress={handleSave} buttonStyle={styles.saveButton} />
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginTop: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    borderRadius: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 95,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  descriptionInput: {
    height: 150,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    textAlignVertical: 'top',
    fontSize: 18,
  },
  imageScroll: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  addImageContainer: {
    width: width / 3 - 20,
    height: 100,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  addImageText: {
    color: '#aaa',
    marginTop: 5,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginTop: 0,
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
});
 