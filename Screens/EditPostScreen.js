import React, { useState, useContext } from 'react';
import { View, TextInput, Image, Text, Pressable, ScrollView, StyleSheet, Alert, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../Firebase/firebaseSetup';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function EditPostScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();

  const postId = route.params?.postId || null;
  const initialDescription = route.params?.initialDescription || '';
  const initialImages = route.params?.images || [];
  const initialRating = route.params?.rating || 0;
  const initialRestaurantName = route.params?.restaurantName || '';

  const [description, setDescription] = useState(initialDescription);
  const [images, setImages] = useState(initialImages);
  const [rating, setRating] = useState(initialRating);
  const [restaurantQuery, setRestaurantQuery] = useState(initialRestaurantName);
  const [restaurantSuggestions, setRestaurantSuggestions] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState({
    name: initialRestaurantName,
    place_id: route.params?.restaurantId || '',
  });

  const fetchSuggestions = async (query) => {
    const apiKey = process.env.EXPO_PUBLIC_apiKey;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&keyword=restaurant|cafe|bar&key=${apiKey}`;
    try {
      const response = await axios.get(url);
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
    setRestaurantQuery(suggestion.description);
    setSelectedRestaurant({
      name: suggestion.description,
      place_id: suggestion.id,
    });
    setRestaurantSuggestions([]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the media library is required.');
      return;
    }

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
      const selectedImageUri = result.uri || (result.assets && result.assets[0].uri);
      if (selectedImageUri) {
        setImages([...images, selectedImageUri]);
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
    const newData = {
      description,
      images,
      rating,
      userId,
      restaurantName: selectedRestaurant.name,
      restaurantId: selectedRestaurant.place_id,
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
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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
              <TouchableOpacity onPress={() => handleSuggestionSelect(item)} style={styles.suggestionItem}>
                <Text style={[styles.suggestionText, { color: theme.textColor }]}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

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
    position: 'relative',
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
    elevation: 3,
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
