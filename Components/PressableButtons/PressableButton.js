import React, { useContext } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { Margin, Padding, BorderRadius, Stylings } from '../../Utils/Style';

const PressableButton = ({ onPress, title, buttonStyle, textStyle }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button, 
        buttonStyle,
        pressed && Stylings.buttonPressed
      ]}
      onPress={onPress}
    >
      <Text style={[Stylings.buttonText, {color: theme.buttonColor}, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: Padding.large,
    borderRadius: BorderRadius.small,
    marginTop: Margin.xxxlarge,
  },
});

export default PressableButton;