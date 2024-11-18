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

export default function EditPostScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();

  const postId = route.params?.postId || null;
  const initialTitle = route.params?.initialTitle || '';
  const initialDescription = route.params?.initialDescription || '';
  const initialImages = route.params?.images || [];
  const initialRating = route.params?.rating || 0;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [images, setImages] = useState(initialImages);
  const [rating, setRating] = useState(initialRating);
  const [searchQuery, setSearchQuery] = useState('');

  const pickImage = async () => {
    // Request permission to access the gallery
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryStatus !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access the gallery is required.');
      return;
    }
  
    // Launch image picker for gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImageUri = result.uri || (result.assets && result.assets[0].uri);
      if (selectedImageUri) {
        setImages([...images, selectedImageUri]);
      }
    }
  };
  
  const captureImage = async () => {
    // Request permission to access the camera
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access the camera is required.');
      return;
    }
  
    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImageUri = result.uri || (result.assets && result.assets[0].uri);
      if (selectedImageUri) {
        setImages([...images, selectedImageUri]);
      }
    }
  };
  

  const handleSave = async () => {
    
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and description are required.");
      return;
    }
    
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating.");
      return;
    }
  
    const userId = auth.currentUser?.uid; // Get the current user ID
    const newData = { title, description, images, rating, userId };
    
    try {
      if (postId) {
        await updateDB(postId, newData, 'posts');
      } else {
        await writeToDB(newData, 'posts');    
      }
      console.log("Save successful, navigating back to Home");
      navigation.goBack(); // Navigate back
    } catch (error) {
      console.error("Error saving post:", error);
      Alert.alert("Save Error", "There was a problem saving your post.");
    }
  };
  

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
  
      if (query === '') {
        setSelectedPlaceDetails(null);
        setSelectedMarker(null);
  
        if (initialRegion) {
          mapRef.current.animateToRegion(initialRegion, 1000); // Smooth animation to initial region
        }
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.imageContainer}>
        <Text style={[styles.label, { color: theme.textColor }]}>Images</Text>
        <ScrollView horizontal style={styles.imageScroll}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
          <Pressable onPress={() => {
            Alert.alert(
              "Add Image",
                "Choose an image source",
              [
              { text: "Camera", onPress: captureImage },
              { text: "Gallery", onPress: pickImage },
              { text: "Cancel", style: "cancel" }
            ]
            );
          }} style={styles.addImageContainer}>
            <Ionicons name="add" size={40} color="#aaa" />
            <Text style={styles.addImageText}>Add Image</Text>
          </Pressable>
        </ScrollView>
        </View>
      
      <View style={styles.restaurantContainer}>
        <Ionicons name="location-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search for restaurants..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      <View style={[styles.ratingContainer]}>
      <Text style={[styles.label, { color: theme.textColor }]}></Text>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={16}
              color={star <= rating ? theme.textColor : "#aaa"}
            />
          </Pressable>
        ))}
      </View>
      
      <Text style={[styles.label, { color: theme.textColor }]}>Review Details</Text>
      <TextInput
        style={[styles.descriptionInput, { borderColor: theme.textColor }]}
        placeholder="Enter a detailed review"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.buttonContainer}>
        <PressableButton
          title="Cancel"
          onPress={handleCancel}
          buttonStyle={styles.cancelButton}
        />
        <PressableButton
          title="Save"
          onPress={handleSave}
          buttonStyle={styles.saveButton}
        />
      </View>
    </View>
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
    height: 100, 
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    textAlignVertical: 'top', 
  },
  imageScroll: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  addImageContainer: {
    width: width - 40,
    height: 300,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: '#aaa',
    marginTop: 5,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  imageContainer: {
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 20,
  },
  searchBar: {
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginTop: -1,
    width: width - 70,
  },
  restaurantContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});
