import React, { useState, useContext } from 'react';
import { View, TextInput, Image, Button, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditPostScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();

  const postId = route.params?.postId || null; // null for a new post
  const initialTitle = route.params?.initialTitle || '';
  const initialDescription = route.params?.initialDescription || '';
  const initialImageUri = route.params?.initialImageUri || '';

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [imageUri, setImageUri] = useState(initialImageUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      // Check for different structures of the response
      const selectedImageUri = result.uri || (result.assets && result.assets[0].uri);
      if (selectedImageUri) {
        setImageUri(selectedImageUri);
      }
    }
  };

  const handleSave = async () => {
    const newData = { title, description, imageUri };

    if (postId) {
      // Edit existing post
      await updateDB(postId, newData, 'posts');
    } else {
      // Create a new post
      await writeToDB(newData, 'posts');
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.label, { color: theme.textColor }]}>Title</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.textColor }]}
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={[styles.label, { color: theme.textColor }]}>Review Details</Text>
      <TextInput
        style={[styles.descriptionInput, { borderColor: theme.textColor }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      
      <Text style={[styles.label, { color: theme.textColor }]}>Image</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Pressable onPress={pickImage} style={styles.addImageContainer}>
          <Ionicons name="add" size={40} color="#aaa" />
          <Text style={styles.addImageText}>Add Image</Text>
        </Pressable>
      )}
       <View style={{ height: 60 }} />  
      <Button title="Save" onPress={handleSave} color={theme.buttonColor} />
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
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  descriptionInput: {
    height: 100, // Increased height for the Review Details input
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    textAlignVertical: 'top', // Keeps text at the top for multiline inputs
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 15,
  },
  addImageContainer: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  addImageText: {
    color: '#aaa',
    marginTop: 5,
    fontSize: 16,
  },
});
