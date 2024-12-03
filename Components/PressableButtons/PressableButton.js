import React, { useContext } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { Colors, Padding, Font, BorderRadius, Opacity } from '../../Utils/Style';

const PressableButton = ({ onPress, title, buttonStyle, textStyle }) => {
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
      <Text style={[styles.buttonText, {color: theme.buttonColor}, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 100,
  },
  buttonPressed: {
    opacity: Opacity.partialOpaque,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: Font.weight,
  },
});

export default PressableButton;