import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext';
import { ContainerStyle } from '../Utils/Style';

export default function ScreenWrapper({ children }) {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.backgroundColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: ContainerStyle.flex,
    flexGrow: ContainerStyle.flexGrow,
  },
});