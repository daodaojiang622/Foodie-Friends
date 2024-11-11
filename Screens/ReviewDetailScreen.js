import React, { useContext } from 'react';
import { View, Image, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { deleteFromDB } from '../Firebase/firestoreHelper';

export default function ReviewDetailScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { postId, title, description, imageUri, rating } = route.params;

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this review?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await deleteFromDB(postId, 'posts');
          navigation.goBack();
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </Pressable>
        <Pressable onPress={handleDelete}>
          <Ionicons name="trash" size={24} color="red" />
        </Pressable>
      </View>
      
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Text style={[styles.title, { color: theme.textColor }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textColor }]}>{description}</Text>
      <Text style={[styles.rating, { color: theme.textColor }]}>Rating: {rating} ⭐</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
