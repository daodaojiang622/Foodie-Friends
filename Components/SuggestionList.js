import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { Stylings, Font, Padding, BorderRadius, BorderWidth, Height } from '../Utils/Style';

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
        <View style={[Stylings.suggestionsContainer, suggestionContainerStyle]}>
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
                <Text style={[Stylings.suggestionText, suggestionTextStyle]}>{item.description}</Text>
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
    height: Height.input,
    borderWidth: BorderWidth.thin,
    paddingHorizontal: Padding.large,
    marginVertical: Padding.large,
    borderRadius: BorderRadius.smallMedium,
    fontSize: Font.sizeMedium,
  },
  suggestionText: {
    fontSize: Font.sizeMedium,
  },
});

export default SuggestionList;
