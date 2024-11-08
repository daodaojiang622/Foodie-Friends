import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Padding, Font, BorderWidth, BorderRadius, Margin, Width } from '../../Utils/Style';
import { ThemeContext } from '../ThemeContext';

export default function FormInput({ label, value, onChangeText, keyboardType = 'default', inputStyle }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
      <View>
        <Text style={[styles.label, { color: theme.headerColor }]}>{label} *</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={`Enter ${label.toLowerCase()}`}
          multiline={true}
          textAlignVertical='top'
        />
      </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: Font.sizeMedium,
    marginBottom: Margin.small,
    color: Colors.primary,
  },
  input: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.inputBorder,
    padding: Padding.medium,
    borderRadius: BorderRadius.small,
    marginBottom: Margin.large,
    width: Width.large,
  },
});