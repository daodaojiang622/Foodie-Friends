import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Colors, Button, Icon, Opacity } from '../../Utils/Style';

const DeleteButton = ({ onPress }) => {
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.DeleteButton,
        { opacity: pressed ? Opacity.partialOpaque : Opacity.opaque }
      ]}
    >
      <Icon.deleteIconComponent name={Icon.deleteIconName} style={styles.DeleteButton} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  DeleteButton: {
    color: Colors.tertiary,
    fontSize: Button.size,
  },
});

export default DeleteButton;