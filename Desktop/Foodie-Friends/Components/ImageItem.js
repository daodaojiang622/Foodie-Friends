import React from 'react';
import { View, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stylings } from '../Utils/Style';

const { width } = Dimensions.get('window');

const ImageItem = ({ uri, onDelete }) => {
  return (
    <View style={Stylings.imageWrapper}>
      <Image source={{ uri }} style={Stylings.image} />
      <Pressable style={Stylings.deleteButton} onPress={onDelete}>
        <Ionicons name="close-circle" size={24} color="red" />
      </Pressable>
    </View>
  );
};

export default ImageItem;
