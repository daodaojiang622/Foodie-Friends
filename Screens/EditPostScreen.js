import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Image, Text, Pressable, ScrollView, StyleSheet, Alert, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../Firebase/firebaseSetup';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { storage } from '../Firebase/firebaseSetup'; 

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

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

  const requestPermissions = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission Denied', 'Please allow access to the gallery in your device settings.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    console.log('Opening gallery...');
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
      console.log('ImagePicker Result:', result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        console.log('Selected Image URI:', selectedImageUri);
        setImages([...images, selectedImageUri]);
      } else {
        console.log('No image selected or operation canceled.');
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
    }
  };
  
  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the camera is required.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const normalizedUri = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
      const selectedImageUri = normalizedUri || (result.assets && result.assets[0].uri);
      if (selectedImageUri) {
        try {
          const downloadURL = await uploadImageToFirebase(selectedImageUri);
          setImages([...images, downloadURL]); // Add the download URL to the images array
        } catch (error) {
          Alert.alert('Upload Error', 'There was an issue uploading the image.');
        }
      }
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
    <ScrollView>
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
        <ScrollView horizontal style={styles.imageScroll}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
              <Pressable
              style={styles.deleteButton}
              onPress={() => {
                // Remove the selected image from the images array
                const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
                setImages(updatedImages);
                }}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </Pressable>
            </View>
        ))}
          <Pressable
            onPress={() => {
              Alert.alert('Add Image', 'Choose an image source', [
                { text: 'Camera', onPress: captureImage },
                { text: 'Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
            style={styles.addImageContainer}
          >
            <Ionicons name="add" size={40} color="#aaa" />
            <Text style={styles.addImageText}>Add Image</Text>
          </Pressable>
        </ScrollView>
        </View>

        <Text style={[styles.label, { color: theme.textColor }]}>Rating</Text>
        <View style={[styles.ratingContainer, { marginTop: 20 }]}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={28}
                color={star <= rating ? '#FFD700' : '#aaa'}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <PressableButton title="Cancel" onPress={handleCancel} buttonStyle={styles.cancelButton} />
          <PressableButton title="Save" onPress={handleSave} buttonStyle={styles.saveButton} />
        </View>
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
  imageWrapper: {
    position: 'relative', // Allows the delete button to be positioned absolutely
    margin: 5,
  },
  imageScroll: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  image: {
    width: width / 3 - 20,
    height: 100,
    borderRadius: 8,
    margin: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 2,
    elevation: 3, // For Android shadow
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
 