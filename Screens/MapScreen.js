import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../Components/ThemeContext';

const { width } = Dimensions.get('window');

const localImages = [
  require('../SamplePhotos/TheLunchLady0.png'),
  require('../SamplePhotos/TheLunchLady1.png'),
  require('../SamplePhotos/TheLunchLady2.png'),
  require('../SamplePhotos/TheLunchLady3.png'),
];

const MapScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null); // State for initial region
  const mapRef = useRef(null); // Reference to the MapView
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to use this feature.');
        return;
      }

      // Fetch the user's current location
      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const fetchSuggestions = async (query) => {
    const apiKey = process.env.EXPO_PUBLIC_apiKey;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.predictions;

      const fetchedSuggestions = results.map((place) => ({
        id: place.place_id,
        description: place.description,
      }));

      setSuggestions(fetchedSuggestions);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions', error);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);

      // If search bar is cleared, reset the map to the initial region
      if (query === '' && initialRegion) {
        setSelectedMarker(null);
        mapRef.current.animateToRegion(initialRegion, 1000); // Smooth animation to initial region
      }
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    setSearchQuery(suggestion.description);
    setSuggestions([]);

    const apiKey = process.env.EXPO_PUBLIC_apiKey;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.id}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const place = response.data.result;

      const selectedLocation = {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        name: place.name,
      };

      setSelectedMarker(selectedLocation);

      // Animate the map to the selected marker's location
      mapRef.current.animateToRegion(
        {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    } catch (error) {
      console.error('Error fetching place details', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for restaurants..."
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          style={styles.suggestionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSuggestionSelect(item)}
              style={styles.suggestionItem}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {initialRegion && (
        <MapView
          ref={mapRef} // Attach the ref to the MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {selectedMarker && (
            <Marker
              coordinate={{
                latitude: selectedMarker.latitude,
                longitude: selectedMarker.longitude,
              }}
              title={selectedMarker.name}
            />
          )}
        </MapView>
      )}

      {selectedMarker && (
        <View style={styles.restaurantCompactContainer}>

          <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollView}
        >
          {/* {reviewData.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))} */}
          {localImages.map((image, index) => (
              <Image key={index} source={image} style={styles.image} />
            ))}
        </ScrollView>
        
        <View style={styles.restaurantInfoCompactContainer}>
          <Text style={[styles.title, { color: theme.textColor }]}>The Lunch Lady</Text>

          <View style={styles.infoContainer}>
            {/* {renderStars(reviewData.rating)} */}
            <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
            <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
            <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
            <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
            <Ionicons name="star-outline" style={[styles.locationIcon, { color: theme.textColor }]} />
          </View>

        </View>

      </View>
      )}
    </View>
  );
};

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
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: -20,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  map: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  restaurantCompactContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    maxHeight: 200,
  },
  image: {
    width: width,
    height: 150,
    resizeMode: 'cover',
  },
  imageScrollView: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  restaurantInfoCompactContainer: {
    flexDirection: 'row',
  },
  locationIcon: {
    fontSize: 20,
    marginBottom: -10,
    marginLeft: 10,
  },
});

export default MapScreen;
