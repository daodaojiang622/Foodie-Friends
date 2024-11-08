import React from 'react';
import { View, StyleSheet } from 'react-native';
import PressableButton from './PressableButton.js';
import { Button, ContainerStyle } from '../../Utils/Style';

export default function AddScreenButtons({ onSave, onCancel, theme }) {
  return (
    <View style={styles.buttonContainer}>
      <PressableButton 
        title="Save" 
        onPress={onSave}
      />
      <PressableButton 
        title="Cancel" 
        onPress={onCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
      flexDirection: ContainerStyle.flexDirection,
      justifyContent: ContainerStyle.justifyContent,
      marginTop: Button.buttonMarginTop,
      marginHorizontal: Button.buttonMarginHorizontal,
  },
});
