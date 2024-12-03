import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Align, ContainerStyle, Font, Padding, Height, BorderRadius } from '../Utils/Style';

const UserInfo = ({ profilePhotoUrl, username, textColor }) => (
  <View style={styles.userContainer}>
    <Image
      source={{ uri: profilePhotoUrl || 'https://www.fearfreehappyhomes.com/wp-content/uploads/2021/04/bigstock-Kitten-In-Pink-Blanket-Looking-415440131.jpg' }}
      style={styles.profileImage}
    />
    <Text style={[styles.username, { color: textColor }]}>{username}</Text>
  </View>
);

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: ContainerStyle.flexDirection,
    alignItems: Align.center,
    marginTop: Padding.large,
  },
  profileImage: {
    width: Height.image,
    height: Height.image,
    borderRadius: BorderRadius.large,
    marginRight: Padding.large,
  },
  username: {
    fontSize: Font.sizeMedium,
  },
});

export default UserInfo;
