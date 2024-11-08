import React, { useContext } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { Colors, Padding, Font, BorderRadius, Opacity } from '../../Utils/Style';

const PressableButton = ({ onPress, title, buttonStyle }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button, 
        buttonStyle,
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, {color: theme.buttonColor}]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: Padding.large,
    borderRadius: BorderRadius.small,
    marginTop: 100,
  },
  buttonPressed: {
    opacity: Opacity.partialOpaque,
  },
  buttonText: {
    // color: Colors.toggleThemeHeader,
    fontSize: Font.SizeLarge,
    fontWeight: Font.weight,
  },
});

export default PressableButton;