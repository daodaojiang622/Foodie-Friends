import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const SuggestionList = ({
  query,
  onQueryChange,
  onSuggestionSelect,
  placeholder = "Search...",
  inputStyle = {},
  suggestionContainerStyle = {},
  suggestionTextStyle = {},
}) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (query) => {
    const apiKey = process.env.EXPO_PUBLIC_apiKey;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&keyword=restaurant|cafe|bar&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const results = response.data.predictions.map((place) => ({
        id: place.place_id,
        description: place.description,
      }));
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  return (
    <View>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        value={query}
        onChangeText={onQueryChange}
        clearButtonMode="while-editing"
      />
      {suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, suggestionContainerStyle]}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSuggestionSelect(item);
                  setSuggestions([]); // Clear suggestions after selection
                }}
                style={styles.suggestionItem}
              >
                <Text style={[styles.suggestionText, suggestionTextStyle]}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default SuggestionList;
