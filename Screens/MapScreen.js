import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const MapScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null); // Reference to the MapView

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
          latitudeDelta: 0.01, // Smaller delta for zoomed-in view
          longitudeDelta: 0.01,
        },
        1000 // Animation duration in milliseconds
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
      <MapView
        ref={mapRef} // Attach the ref to the MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedMarker && (
          <Marker
            coordinate={{
              latitude: selectedMarker.latitude,
              longitude: selectedMarker.longitude,
            }}
            title={selectedMarker.name}
            style={{ width: 40, height: 40, borderColor: 'red' }}
          />
        )}
      </MapView>
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
});

export default MapScreen;
