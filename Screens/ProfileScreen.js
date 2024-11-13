import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

  useEffect(() => {
    const checkUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        loadUserPosts(storedUsername);
      } else {
        setUsernameModalVisible(true);
      }
    };

    checkUsername();
  }, []);

  const loadUserPosts = async (user) => {
    const posts = await fetchDataFromDB('posts', { userId: auth.currentUser.uid }); 
    setUserPosts(posts);
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

  const renderPostItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate('ReviewDetail', { postId: item.id })} style={styles.postItem}>
      <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      <Text style={[styles.postTitle, { color: theme.textColor }]}>{item.title}</Text>
      <Text style={[styles.postDescription, { color: theme.textColor }]} numberOfLines={2}>{item.description}</Text>
    </Pressable>
  );

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
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
        <Text style={[styles.username, { color: theme.textColor }]}>{username || "User"}</Text>
        
        {/* Action Button */}
        <Pressable onPress={() => navigation.navigate('FoodGallery')} style={styles.actionButton}>
          <Ionicons name="images-outline" size={24} color={theme.textColor} />
          <Text style={[styles.buttonText, { color: theme.textColor }]}>My Food Gallery</Text>
        </Pressable>
      </View>

      <View style={styles.postsSection}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>My Posts</Text>
        <FlatList
          data={userPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.postsList}
          numColumns={2}
        />
      </View>
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
  postsSection: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postsList: {
    paddingBottom: 20,
  },
  postItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
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
});
