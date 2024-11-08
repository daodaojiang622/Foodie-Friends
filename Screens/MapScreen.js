import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Restaurants Near-By
      </Text>
      <TextInput style={styles.searchBar} placeholder="Search for restaurants..." />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
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
    marginHorizontal: 20,
    marginBottom: 20,
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