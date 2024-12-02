import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function UserAvatar({ username, profilePhotoUrl, theme }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profilePhotoUrl || 'https://via.placeholder.com/30' }}
        style={styles.image}
      />
      <Text style={[styles.username, { color: theme.textColor }]}>{username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
});
