import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const MapScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [markers, setMarkers] = useState([]);

  const handleSearch = async () => {
    const apiKey = 'AIzaSyD1jrEUDZFEvyMzjUWvc-WKnFogdT6178M';
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    fontSize: 20,
    color: 'black',
  },
  searchBar: {
    marginTop: 80,
    margin: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  map: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default MapScreen;