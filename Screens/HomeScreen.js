import { StyleSheet, TextInput, View, Image, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

export default function HomeScreen() {
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
      <TextInput
        style={styles.searchBar}
        placeholder="Search for restaurants..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <View style={styles.imageContainer}>
        <View style={styles.imageRow}>
          <Pressable>
            <View style={styles.imageWrapper}>
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
          <Pressable>
            <View style={styles.imageWrapper}>
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
          <Pressable>
            <View style={styles.imageWrapper}>
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
          <Pressable>
            <View style={styles.imageWrapper}>
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
    marginTop: 80,
    margin: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageWrapper: {
    margin: 5,
    alignItems: 'center',
    width: 180,
  },
  image: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    width: 80,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  username: {
    fontSize: 14,
  },
  likes: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});