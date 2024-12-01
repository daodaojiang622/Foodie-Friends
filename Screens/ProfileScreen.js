import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../Components/ThemeContext';
import ScreenWrapper from '../Components/ScreenWrapper';
import ImagePickerHandler from '../Components/ImagePickerHandler';
import { fetchDataFromDB, deleteFromDB, writeToDB, updateDB } from '../Firebase/firestoreHelper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../Firebase/firebaseSetup';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/firebaseSetup";

export default function ProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null); // Set initial value to null
  const { pickImage, captureImage } = ImagePickerHandler();


  const uploadImageToStorage = async (uri, userId) => {
    try {
      // Fetch the file as a blob
      const response = await fetch(uri);
      const blob = await response.blob();
  
      // Create a storage reference with a unique path
      const storageRef = ref(storage, `profileImages/${userId}/${Date.now()}.jpg`);
  
      // Upload the file
      const snapshot = await uploadBytes(storageRef, blob);
  
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      console.log("Image uploaded successfully. URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
      throw error;
    }
  };

  useEffect(() => {
    const checkUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedProfileImage = await AsyncStorage.getItem('profileImage');
      if (storedUsername) {
        setUsername(storedUsername);
        loadUserPosts(storedUsername);
      } else {
        setUsernameModalVisible(true);
      }
      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      }
    };

    checkUsername();
  }, []);

  const loadUserPosts = async () => {
    try {
      const posts = await fetchDataFromDB('posts');
      console.log('Fetched Posts:', posts);
  
      const filteredPosts = posts.filter((post) => post.userId === auth.currentUser.uid);
  
      setUserPosts(filteredPosts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };
  
  const handleSaveUsername = async () => {
    if (username.trim().length === 0) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }
  
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User is not logged in.');
        return;
      }
  
      const userCollection = 'users';
  
      // Fetch existing user data
      const existingUsers = await fetchDataFromDB(userCollection, { userId });
      if (existingUsers.length > 0) {
        // Update if user already exists
        const existingUserDocId = existingUsers[0].id;
        await updateDB(existingUserDocId, { username }, userCollection);
        console.log("Username updated successfully.");
      } else {
        // Write a new user document if none exists
        await writeToDB({ userId, username }, userCollection);
        console.log("New user created successfully.");
      }
  
      await AsyncStorage.setItem('username', username); // Save locally for convenience
      setUsernameModalVisible(false);
      Alert.alert('Success', 'Username saved successfully.');
    } catch (error) {
      console.error('Error saving username:', error);
      Alert.alert('Error', 'Failed to save username. Please try again.');
    }
  };
  

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert("Permission Required", "Camera and media permissions are needed to upload profile pictures.");
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    const checkUsernameAndProfileImage = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('Error', 'User is not logged in.');
          return;
        }
  
        const userCollection = 'users';
  
        // Fetch user data from Firestore
        const existingUsers = await fetchDataFromDB(userCollection, { userId });
        if (existingUsers.length > 0) {
          const user = existingUsers[0];
          setUsername(user.username || '');
          setProfileImage(user.profileImage || ''); 
        } else {
          setUsernameModalVisible(true); 
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    checkUsernameAndProfileImage();
  }, []);
  
  const pickProfileImage = async () => {
    const selectedImageUri = await pickImage();
    if (selectedImageUri) {
      console.log('Selected Image:', selectedImageUri); // Debug log
      setProfileImage(selectedImageUri);
      await updateProfileImageInFirestore(selectedImageUri);
    }
  };
  
  const captureProfileImage = async () => {
    const capturedImageUri = await captureImage();
    if (capturedImageUri) {
      console.log('Captured Image:', capturedImageUri); // Debug log
      setProfileImage(capturedImageUri);
      await updateProfileImageInFirestore(capturedImageUri);
    }
  };
  

  const handleProfileImagePress = async () => {
    Alert.alert(
      "Set Profile Picture",
      "Choose an option:",
      [
        {
          text: "Take a Photo",
          onPress: captureProfileImage,
        },
        {
          text: "Choose from Gallery",
          onPress: pickProfileImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  
  
  const renderRow = (rowItems, rowIndex) => (
    <View
      style={{ flexDirection: 'row', justifyContent: rowItems.length === 1 ? 'flex-start' : 'space-between' }}
      key={`row-${rowIndex}`}
    >
      {rowItems.map((item) => (
        <View key={item.id} style={[styles.postItem, rowItems.length === 1 && { width: '48%' }]}>
          <Pressable
            onPress={() =>
              navigation.navigate('EditPost', {
                postId: item.id,
                initialDescription: item.description,
                initialImages: item.images,
                initialRating: item.rating,
                restaurantName: item.restaurantName || 'No restaurant specified',
                restaurantId: item.restaurantId || '',
              })
            }
          >
           {item.images?.[0] ? (
            <Image source={{ uri: item.images[0] }} style={styles.image} />
          ) : (
            <Text>No Image Available</Text>
          )}
            <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.name || item.description.split(' ').slice(0, 5).join(' ')}...
          </Text>
          </Pressable>
          {/* Delete Button */}
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDeletePost(item.id, item.userId)}
          >
            <Ionicons name="close" size={20} color="red" />
          </Pressable>
        </View>
      ))}
    </View>
  );
  
  const handleDeletePost = async (postId, userId) => {
    if (userId !== auth.currentUser?.uid) {
      Alert.alert('Permission Denied', 'You can only delete your own posts.');
      return;
    }
  
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteFromDB(postId, 'posts');
            setUserPosts(userPosts.filter((post) => post.id !== postId)); // Update UI
            Alert.alert('Post Deleted', 'Your post has been successfully deleted.');
          } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Delete Error', 'There was an issue deleting your post.');
          }
        },
      },
    ]);
  };
  
  
  return (
    <ScreenWrapper>
      {/* Username Modal */}
      <Modal visible={usernameModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Username</Text>
            <TextInput
              style={styles.usernameInput}
              placeholder="Enter a username"
              value={username}
              onChangeText={setUsername}
            />
            <Pressable style={styles.saveButton} onPress={handleSaveUsername}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.profileHeader}>
      <Pressable onPress={handleProfileImagePress}>
        <Image
         source={{ uri: profileImage || 'https://via.placeholder.com/100' }}
         style={styles.profileImage}
       />
      </Pressable>

        <View style={styles.usernameContainer}>
         <Text style={[styles.username, { color: theme.textColor }]}>
             {username || "User"}
         </Text>
         <Pressable onPress={() => setUsernameModalVisible(true)} style={styles.editIcon}>
           <Ionicons name="pencil" size={20} color={theme.textColor} />
         </Pressable>
        </View>
        {/* Action Button */}
        <Pressable onPress={() => navigation.navigate('FoodGallery')} style={styles.actionButton}>
          <Ionicons name="images-outline" size={24} color={theme.textColor} />
          <Text style={[styles.buttonText, { color: theme.textColor }]}>My Food Gallery</Text>
        </Pressable>
      </View>

      
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>My Posts</Text>
      <ScrollView contentContainerStyle={styles.postsList}>
        {Array.from({ length: Math.ceil(userPosts.length / 2) }, (_, rowIndex) =>
          renderRow(userPosts.slice(rowIndex * 2, rowIndex * 2 + 2), rowIndex)
        )}
      </ScrollView>
    
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#d1d1d1',
    marginBottom: 10,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  editIcon: {
    marginLeft: 8,
    padding: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1d1d1',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: '60%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  postItem: {
    flex: 0.48, // Adjusted for two posts in a row
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  postsList: {
    flexGrow: 1,
    padding: 10,
    alignItems: 'flex-start', // Align items to the left
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usernameInput: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    elevation: 3, // Android shadow
  },
});