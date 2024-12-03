import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Text, Pressable, ScrollView, StyleSheet, Alert, FlatList, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { auth } from '../Firebase/firebaseSetup';
import ImagePickerHandler from '../Components/ImagePickerHandler';
import Rating from '../Components/Rating';
import ImageHorizontalScrolling from '../Components/ImageHorizontalScrolling';
import ScreenHeader from '../Components/ScreenHeader';
import { uploadImageToFirebase, fetchSuggestions, savePost, ImagePickerActions } from '../Utils/HelperFunctions';

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
  
    //   Alert.alert('Confirm Save', 'Are you sure you want to save this post?', [
    //     {
    //       text: 'Cancel',
    //       style: 'cancel',
    //     },
    //     {
    //       text: 'Save',
    //       onPress: async () => {
    //         try {
    //           if (postId) {
    //             await updateDB(postId, newData, 'posts');
    //           } else {
    //             await writeToDB(newData, 'posts');
    //           }
    //           navigation.goBack();
    //         } catch (error) {
    //           console.error('Error saving post:', error);
    //           Alert.alert('Save Error', 'There was a problem saving your post.');
    //         }
    //       },
    //     },
    //   ]);
    // } catch (error) {
    //   console.error('Error uploading images:', error);
    //   Alert.alert('Upload Error', 'Failed to upload images. Please try again.');
    // }
      savePost({
        postId,
        newData,
        onSuccess: () => navigation.goBack(),
        onError: (error) => Alert.alert('Save Error', 'There was a problem saving your post.'),
      });
      } catch (error) {
        console.error('Error preparing post save:', error);
      }
  };

  const handleCancel = () => {
    navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScreenHeader title={route.params?.postId ? 'Edit Post' : 'Add New Post'} />
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
          <ImageHorizontalScrolling images={images} setImages={images}/>
          {/* <Pressable
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
          </Pressable> */}
          <ImagePickerActions onPickImage={pickImageForPost} onCaptureImage={captureImageForPost} />
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
 