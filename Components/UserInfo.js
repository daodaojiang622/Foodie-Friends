import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
});

export default UserInfo;
