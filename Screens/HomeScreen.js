import { StyleSheet, TextInput, View, Image, Text, Pressable } from 'react-native';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    const apiKey = 'YOUR_GOOGLE_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&type=restaurant&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;

      const fetchedMarkers = results.map((place) => ({
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        name: place.name,
      }));

      setMarkers(fetchedMarkers);
    } catch (error) {
      console.error('Error fetching data from Google Places API', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, {color: theme.textColor}]}>Checkout the lastest hotspots</Text>
        <Pressable 
          style={styles.addPostButton}
          onPress={() => navigation.navigate('EditPost')}
        >
          <Ionicons name="create-sharp" style={[styles.addPostIcon, {color: theme.textColor}]}/>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search for restaurants..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.imageContainer}>
        <View style={styles.imageRow}>
          <Pressable onPress={() => navigation.navigate('EditPost')}>
            <View style={[styles.imageWrapper, { backgroundColor: theme.postColor}]}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.image} />
              <Text style={styles.title}>Title</Text>
              <View style={styles.infoContainer}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
                  <Text style={styles.username}>Username</Text>
                </View>
                <Text style={styles.likes}>100 Likes</Text>
              </View>
            </View>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('EditPost')}>
          <View style={[styles.imageWrapper, { backgroundColor: theme.postColor}]}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.image} />
              <Text style={styles.title}>Title</Text>
              <View style={styles.infoContainer}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
                  <Text style={styles.username}>Username</Text>
                </View>
                <Text style={styles.likes}>100 Likes</Text>
              </View>
            </View>
          </Pressable>

        </View>
        <View style={styles.imageRow}>
          <Pressable onPress={() => navigation.navigate('EditPost')}>
            <View style={[styles.imageWrapper, { backgroundColor: theme.postColor}]}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.image} />
              <Text style={styles.title}>Title</Text>
              <View style={styles.infoContainer}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
                  <Text style={styles.username}>Username</Text>
                </View>
                <Text style={styles.likes}>100 Likes</Text>
              </View>
            </View>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('EditPost')}>
            <View style={[styles.imageWrapper, { backgroundColor: theme.postColor}]}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.image} />
              <Text style={styles.title}>Title</Text>
              <View style={styles.infoContainer}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
                  <Text style={styles.username}>Username</Text>
                </View>
                <Text style={styles.likes}>100 Likes</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  imageContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  imageRow: {
    flexDirection: 'row',
  },
  imageWrapper: {
    margin: 5,
    alignItems: 'center',
    width: 180,
    backgroundColor: "#c2d1c6",
  },
  image: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
    width: 180,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 5,
  },
  username: {
    fontSize: 12,
  },
  likes: {
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginTop: 80,
  },
  addPostButton: {
    padding: 10,
  },
  addPostIcon: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});