import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../Components/ThemeContext';
import ScreenWrapper from '../Components/ScreenWrapper';
import { fetchDataFromDB } from '../Firebase/firestoreHelper';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const reviews = await fetchDataFromDB('reviews'); // Assuming 'reviews' is the collection name
      setRecentReviews(reviews);
    };
    loadReviews();
  }, []);

  const renderReviewItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate('ReviewDetail', { reviewId: item.id })} style={styles.reviewItem}>
      <Text style={styles.reviewText}>“{item.text}”</Text>
      <Text style={styles.reviewMeta}>{item.date} ago, {item.restaurant}</Text>
    </Pressable>
  );

  return (
    <ScreenWrapper>
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
        <Text style={[styles.username, { color: theme.textColor }]}>Kiara Knightly</Text>
        
        {/* Action Buttons */}
        <Pressable onPress={() => navigation.navigate('ReviewDrafts')} style={styles.actionButton}>
          <Ionicons name="create-outline" size={24} color={theme.textColor} />
          <Text style={[styles.buttonText, { color: theme.textColor }]}>Review Drafts</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('FoodGallery')} style={styles.actionButton}>
          <Ionicons name="images-outline" size={24} color={theme.textColor} />
          <Text style={[styles.buttonText, { color: theme.textColor }]}>My Food Gallery</Text>
        </Pressable>
      </View>

      <View style={styles.reviewsSection}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recently Reviewed</Text>
        <FlatList
          data={recentReviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reviewsList}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1d1d1',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: '60%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  reviewsSection: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewsList: {
    paddingBottom: 20,
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  reviewText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  reviewMeta: {
    fontSize: 12,
    color: '#555',
  },
});
