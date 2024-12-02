import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Rating = ({ rating, style }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={[styles.container]}>
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" style={[styles.star, style]} />
        ))}
      {hasHalfStar && <Ionicons name="star-half" style={[styles.star, style]} />}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" style={[styles.star, style]} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 20,
  },
  star: {
    size: 16,
    color: 'gold',
  },
});

export default Rating;
