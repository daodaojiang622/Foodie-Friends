import React, { useContext } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { Colors, Padding, Font, BorderRadius, Opacity } from '../../Utils/Style';

const Button = ({ onPress, title, textStyle }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.buttonColor },
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: Padding.large,
    borderRadius: BorderRadius.small,
  },
  buttonPressed: {
    opacity: Opacity.partialOpaque,
  },
  buttonText: {
    color: Colors.tertiary,
    fontSize: Font.sizeMedium,
    fontWeight: Font.weight,
  },
});

export default Button;