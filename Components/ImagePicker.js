import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const ImagePicker = ({ onPickImage, onCaptureImage }) => (
  <Pressable
    onPress={() => {
      Alert.alert('Add Image', 'Choose an image source', [
        { text: 'Camera', onPress: onCaptureImage },
        { text: 'Gallery', onPress: onPickImage },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }}
    style={styles.addImageContainer}
  >
    <Ionicons name="add" size={40} color="#aaa" />
    <Text style={styles.addImageText}>Add Image</Text>
  </Pressable>
);

const styles = StyleSheet.create({
addImageContainer: {
  width: width / 3 - 20,
  height: 100,
  borderWidth: 1,
  borderColor: '#aaa',
  borderRadius: 8,
  borderStyle: 'dashed',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 5,
},
addImageText: {
  color: '#aaa',
  fontSize: 16,
  fontWeight: 'bold',
},
});