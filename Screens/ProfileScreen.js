import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../Components/ThemeContext';
import ScreenWrapper from '../Components/ScreenWrapper';
import { fetchDataFromDB, writeToDB } from '../Firebase/firestoreHelper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../Firebase/firebaseSetup';

export default function ProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(null); // Set initial value to null

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
      const filteredPosts = posts.filter((post) => post.userId === auth.currentUser.uid);
      setUserPosts(filteredPosts);
    } catch (error) {
      console.error("Error loading user posts:", error);
    }
  };
  

  const handleSaveUsername = async () => {
    if (username.trim().length === 0) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }
    await AsyncStorage.setItem('username', username);
    setUsernameModalVisible(false);
    loadUserPosts(username);
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

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log("Image Picker Result:", result); // Log the entire result to see the structure

      if (!result.canceled && result.uri) {
        setProfileImage(result.uri);
        await AsyncStorage.setItem('profileImage', result.uri);
      } else {
        console.log("No image selected or action was canceled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image.");
    }
  };

  const captureProfileImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log("Camera Result:", result); // Log the entire result to see the structure

      if (!result.canceled && result.uri) {
        setProfileImage(result.uri);
        await AsyncStorage.setItem('profileImage', result.uri);
      } else {
        console.log("No image captured or action was canceled.");
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image.");
    }
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
            <Image source={{ uri: item.images[0] }} style={styles.postImage} />
            <Text style={[styles.postTitle, { color: theme.textColor }]}>
              {item.description ? item.description.split(' ').slice(0, 5).join(' ') : 'No details'}...
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
        <Pressable onPress={pickProfileImage} onLongPress={captureProfileImage}>
          <Image 
            source={{ uri: profileImage || 'https://via.placeholder.com/100' }} 
            style={styles.profileImage} 
          />
        </Pressable>
        <Text style={[styles.username, { color: theme.textColor }]}>{username || "User"}</Text>
        
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
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
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
