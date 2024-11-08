import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, Font, Margin } from '../Utils/Style';

const SpecialIndicator = () => {
  return <Text style={styles.special}>{'!'}</Text>;
};

const styles = StyleSheet.create({
  special: {
    color: Colors.secondary,
    fontWeight: Font.weight,
    fontSize: Font.SizeLarge,
    marginRight: Margin.xsmall,
  },
});

export default SpecialIndicator;