import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Image, Button, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { updateDB } from '../Firebase/firestoreHelper';
import { ThemeContext } from '../Components/ThemeContext';

export default function EditPostScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { postId, initialTitle, initialDescription, initialImageUri } = route.params;
  
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [imageUri, setImageUri] = useState(initialImageUri);

  // Function to pick a new image from the library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  // Save changes to the database
  const handleSave = async () => {
    const updatedData = {
      title,
      description,
      imageUri,
    };
    await updateDB(postId, updatedData, 'posts');
    navigation.goBack(); // Navigate back to the previous screen after saving
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.label, { color: theme.textColor }]}>Edit Title</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.textColor }]}
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={[styles.label, { color: theme.textColor }]}>Edit Description</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.textColor }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      
      <Text style={[styles.label, { color: theme.textColor }]}>Change Image</Text>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
      <Button title="Pick an image from gallery" onPress={pickImage} />

      <Button title="Save Changes" onPress={handleSave} color={theme.buttonColor} />
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 15,
  },
});
