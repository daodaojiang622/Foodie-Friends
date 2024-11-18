import React, { useState, useContext } from 'react';
import { View, TextInput, Image, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../Firebase/firebaseSetup';

export default function EditPostScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();

  const postId = route.params?.postId || null;
  const initialDescription = route.params?.initialDescription || '';
  const initialImages = route.params?.images || [];
  const initialRating = route.params?.rating || 0;

  const [description, setDescription] = useState(initialDescription);
  const [images, setImages] = useState(initialImages);
  const [rating, setRating] = useState(initialRating);

  const pickImage = async () => {
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryStatus !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access the gallery is required.');
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
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access the camera is required.');
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

    const userId = auth.currentUser?.uid;
    const newData = { description, images, rating, userId };

    try {
      if (postId) {
        await updateDB(postId, newData, 'posts');
      } else {
        await writeToDB(newData, 'posts');
      }
      console.log('Save successful, navigating back to Home');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Save Error', 'There was a problem saving your post.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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
      <ScrollView horizontal style={styles.imageScroll}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
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
    marginTop: 15,
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  addImageContainer: {
    width: 100,
    height: 100,
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
});
