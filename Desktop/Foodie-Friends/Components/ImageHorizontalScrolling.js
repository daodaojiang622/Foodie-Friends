import React from 'react';
import { ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { Width, Resize } from '../Utils/Style';

const { width } = Dimensions.get('window');

export default function ImageHorizontalScrolling({ images, imageStyle }) {
  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={[styles.image, imageStyle]} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: Width.image,
    height: Width.image,
    resizeMode: Resize.cover,
  },
});
