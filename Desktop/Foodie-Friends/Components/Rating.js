import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Align, ContainerStyle, Font, Padding, Colors } from '../Utils/Style';

const Rating = ({ rating, style, starStyle }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={[styles.container, style]}>
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" style={[styles.star, starStyle]} />
        ))}
      {hasHalfStar && <Ionicons name="star-half" style={[styles.star, starStyle]} />}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" style={[styles.star, starStyle]} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: ContainerStyle.flexDirection,
    alignItems: Align.center,
    marginTop: Padding.negative,
    marginBottom: Padding.large,
    marginLeft: Padding.xlarge,
  },
  star: {
    size: Font.sizeMedium,
    color: Colors.gold,
  },
});

export default Rating;
