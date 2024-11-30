import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImageItem = ({ uri, onDelete }) => {
  return (
    <View style={styles.imageWrapper}>
      <Image source={{ uri }} style={styles.image} />
      <Pressable style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="close-circle" size={24} color="red" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 2,
    elevation: 3,
  },
});

export default ImageItem;
