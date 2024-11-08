import React, {useContext} from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Colors, Padding, Margin, ContainerStyle, Font, Align, BorderRadius, Opacity } from '../Utils/Style';
import { ThemeContext } from '../Components/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Pressable
        style={({ pressed }) => [
          styles.themeButton,
          { 
            backgroundColor: theme.buttonColor,
            opacity: pressed ? Opacity.partialOpaque : Opacity.opaque, 
          }
        ]}
        onPress={toggleTheme}
        android_ripple={{radius: BorderRadius.medium }}
      >
      <Text style={styles.themeButtonText}>
        Toggle Theme
      </Text>
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: ContainerStyle.flex,
    padding: Padding.xlarge,
  },
  themeButtonText: {
    color: Colors.tertiary,
    fontSize: Font.sizeMedium,
    textAlign: Align.center,
    padding: Padding.medium,
  },
  themeButton: {
    marginTop: Margin.xxxxlarge,
    borderRadius: BorderRadius.medium,
    alignSelf: Align.center,
  },
});