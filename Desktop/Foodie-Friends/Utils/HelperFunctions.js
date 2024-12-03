import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup';
import axios from 'axios';
import { fetchDataFromDB, writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { Alert, Pressable, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const fetchReviewDetails = async (postId) => {
  try {
    const allPosts = await fetchDataFromDB('posts');
    const post = allPosts.find((p) => p.id === postId);

    if (!post) return null;

    const allUsers = await fetchDataFromDB('users');
    const user = allUsers.find((u) => u.userId === post.userId);

    return {
      description: post.description || '',
      images: post.images || [],
      rating: post.rating || 0,
      userId: post.userId || '',
      restaurant: post.restaurantName || '',
      profilePhotoUrl: user?.profileImage || '',
      username: user?.username || 'Anonymous',
    };
  } catch (error) {
    console.error('Error fetching review details:', error);
    throw error;
  }
};


export const uploadImageToFirebase = async (uri) => {
  try {
    if (!uri) throw new Error('Invalid URI');

    const response = await fetch(uri);
    if (!response.ok) throw new Error(`Failed to fetch image. Status: ${response.statusText}`);
    const blob = await response.blob();

    const fileName = `${Date.now()}.jpg`;
    const storageRef = ref(storage, `images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const fetchSuggestions = async (query, apiKey) => {
  if (query.length <= 2) return [];
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&keyword=restaurant|cafe|bar&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.predictions.map((place) => ({
      id: place.place_id,
      description: place.description,
    }));
  } catch (error) {
    console.error('Error fetching restaurant suggestions:', error);
    throw error;
  }
};

export const savePost = async ({ postId, newData, onSuccess, onError }) => {
  try {
    if (postId) {
      await updateDB(postId, newData, 'posts');
    } else {
      await writeToDB(newData, 'posts');
    }
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('Error saving post:', error);
    if (onError) onError(error);
  }
};

export const ImagePickerHandler = () => {
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert("Permission Required", "Camera and media permissions are needed.");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      return result.assets[0].uri;
    } else {
      console.log("No image selected.");
      return null;
    }
  };

  const captureImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      return result.assets[0].uri;
    } else {
      console.log("No image captured.");
      return null;
    }
  };

  return { pickImage, captureImage };
};



