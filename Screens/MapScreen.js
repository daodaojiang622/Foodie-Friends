import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Image, Dimensions, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../Components/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null); 
  const mapRef = useRef(null); 
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars
  
    // Create an array of star components
    return (
      <>
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <Ionicons key={`full-${index}`} name="star" style={styles.starIcon} />
          ))}
        {hasHalfStar && <Ionicons name="star-half" style={styles.starIcon} />}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <Ionicons key={`empty-${index}`} name="star-outline" style={styles.starIcon} />
          ))}
      </>
    );
  };

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
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&keyword=restaurant|cafe|bar&key=${apiKey}`;

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
  
      // Clear selected place details and reset map if search bar is cleared
      if (query === '') {
        setSelectedPlaceDetails(null);
        setSelectedMarker(null);
  
        if (initialRegion) {
          mapRef.current.animateToRegion(initialRegion, 1000); // Smooth animation to initial region
        }
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
        id: place.place_id,
      };
  
      setSelectedMarker(selectedLocation);
  
      // Construct place details with cuisine type
      const placeDetails = {
        name: place.name,
        type: place.types,
        rating: place.rating || 'N/A',
        photos: place.photos
          ? place.photos.slice(0, 10).map((photo) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
            )
          : [], // Default to empty if no photos
      };
  
      console.log('Selected place details:', placeDetails);
      setSelectedPlaceDetails(placeDetails);
  
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

      {selectedPlaceDetails && searchQuery !== '' && (

          <View style={[styles.restaurantCompactContainer, { borderColor: theme.textColor }]}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScrollView}
            >
              {selectedPlaceDetails.photos.length > 0 ? (
                selectedPlaceDetails.photos.map((photo, index) => (
                  <Image key={index} source={{ uri: photo }} style={styles.image} />
                ))
              ) : (
                <Text style={{ color: theme.textColor, padding: 10 }}>No images available</Text>
              )}
            </ScrollView>
            
            <Pressable onPress={() => navigation.navigate('RestaurantDetailScreen', { placeId: selectedMarker?.id})}>
            <View style={styles.restaurantInfoCompactContainer}>
              <Text style={[styles.title, { color: theme.textColor }]}>
                {selectedPlaceDetails.name}
              </Text>

              <View style={styles.infoContainer}>
                <Text style={[styles.rating, { color: theme.textColor }]}>
                  {renderStars(selectedPlaceDetails.rating)} 
                </Text>
              </View>
            </View>
            </Pressable>
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
    borderWidth: 2,
    maxHeight: 200,
    borderRadius: 5,
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
    fontSize: 16,
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
    fontSize: 16,
    marginBottom: -10,
    marginLeft: 10,
  },
  rating: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: -10,
  },
});

export default MapScreen;
