import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Text, Pressable, ScrollView, StyleSheet, Alert, FlatList, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { auth } from '../Firebase/firebaseSetup';
import Rating from '../Components/Rating';
import ScreenHeader from '../Components/ScreenHeader';
import { uploadImageToFirebase, fetchSuggestions, savePost, ImagePickerHandler } from '../Utils/HelperFunctions';
import { Ionicons } from '@expo/vector-icons';
import ImageItem from '../Components/ImageItem';
import { ContainerStyle, Padding, Font, Stylings, Position, Colors, BorderRadius, BorderWidth, Height } from '../Utils/Style';

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
  
  const handleSearchChange = async (query) => {
    setRestaurantQuery(query);
    if (query.length > 2) {
      const suggestions = await fetchSuggestions(query, process.env.EXPO_PUBLIC_apiKey);
      setRestaurantSuggestions(suggestions);
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
          <View style={[Stylings.suggestionsContainer, { marginHorizontal: Padding.zero, marginTop: Padding.negative}]}>
          <FlatList
            data={restaurantSuggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSuggestionSelect(item)}
                style={Stylings.suggestionItem}
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
            <ImageItem
            key={index}
            uri={uri}
            onDelete={() => setImages(images.filter((_, imgIndex) => imgIndex !== index))}
          />
        ))}
          <Pressable
            onPress={() => {
              Alert.alert('Add Image', 'Choose an image source', [
                { text: 'Camera', onPress: captureImageForPost },
                { text: 'Gallery', onPress: pickImageForPost },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
            style={[Stylings.image, { borderWidth: BorderWidth.thin, borderColor: Colors.gray, borderStyle: BorderWidth.dashed, }]}
          >
            <Ionicons name="add" size={40} color="#aaa" />
            <Text style={styles.addImageText}>Add Image</Text>
          </Pressable>
          {/* <ImagePicker onPickImage={pickImageForPost} onCaptureImage={captureImageForPost} /> */}
        </ScrollView>
        </View>

        <Rating rating={rating} onPress={setRating} style={styles.rating} starStyle={styles.ratingStar}/>

        <View style={styles.buttonContainer}>
          <PressableButton title="Cancel" onPress={handleCancel} buttonStyle={Stylings.button} />
          <PressableButton title="Save" onPress={handleSave} buttonStyle={Stylings.button} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: ContainerStyle.flex,
    padding: Padding.xlarge,
  },
  label: {
    fontSize: Font.sizeMedium,
    fontWeight: Font.weight,
    marginTop: Padding.large,
  },
  input: {
    height: Height.input,
    borderWidth: BorderWidth.thin,
    paddingHorizontal: Padding.large,
    marginVertical: Padding.large,
    fontSize: Font.sizeMedium,
    borderRadius: BorderRadius.medium,
  },
  descriptionInput: {
    height: Height.suggestionContainer,
    borderWidth: BorderWidth.thin,
    paddingHorizontal: Padding.large,
    marginVertical: Padding.large,
    textAlignVertical: ContainerStyle.top,
    fontSize: Font.sizeMedium,
  },
  addImageText: {
    color: Colors.gray,
    marginTop: Padding.small,
    fontSize: Font.sizeSmall,
  },
  buttonContainer: {
    flexDirection: ContainerStyle.flexDirection,
    justifyContent: ContainerStyle.justifyContent,
    marginVertical: Padding.xlarge,
    marginTop: Padding.zero,
  },
  ratingStar: {
    marginTop: Padding.large,
    fontSize: Font.sizeXXLarge,
  },
  rating: {
    marginLeft: Padding.zero,
  },
});
 