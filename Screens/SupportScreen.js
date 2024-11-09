import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../Components/ThemeContext';

export default function SupportScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={styles.text}>
        🍔 Welcome to Foodie Friends 🍣
        {'\n'}{'\n'}
        Where your appetite is as big as our lack
        of support! Need help? So do we. But don't
        worry—whether you're discovering the best
        pizza in town or accidentally adding 37 photos of last
        night's sushi (we've all been there), we’ll cheer
        you on...silently. 
        {'\n'}{'\n'}
        For actual assistance, try asking
        a friend, Googling it, or crossing your fingers and
        hoping for the best!
        {'\n'}{'\n'}
        Happy eating and good luck! 🍕
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
});