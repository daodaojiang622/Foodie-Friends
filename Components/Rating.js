import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Rating({ rating, onPress }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onPress(star)}>
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={28}
            color={star <= rating ? '#FFD700' : '#aaa'}
          />
        </Pressable>
      ))}
    </View>
  );
}
