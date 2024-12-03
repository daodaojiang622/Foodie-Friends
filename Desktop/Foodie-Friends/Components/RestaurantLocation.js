import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RestaurantLocation = ({ restaurantName, textColor }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
    <Ionicons name="location-outline" size={20} color={textColor} />
    <Text style={{ fontSize: 16, color: textColor, marginLeft: 5 }}>
      {restaurantName}
    </Text>
  </View>
);

export default RestaurantLocation;
