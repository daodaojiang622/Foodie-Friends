import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { ThemeContext } from '../Components/ThemeContext';

export default function MeetUpScreen({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [upcomingMeetUps, setUpcomingMeetUps] = useState([]);
  const [pastMeetUps, setPastMeetUps] = useState([]);

  const handleCreateMeetUp = () => {
    // Navigate to the screen where users can create a meet-up
    navigation.navigate('CreateMeetUp');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Meet-Ups</Text>
        {upcomingMeetUps.length === 0 ? (
          <View style={styles.noMeetUpsContainer}>
            <Text>No upcoming meet-ups</Text>
            <Button title="Create a Meet-Up" onPress={handleCreateMeetUp} />
          </View>
        ) : (
          upcomingMeetUps.map((meetUp, index) => (
            <View key={index} style={styles.meetUpItem}>
              <Text>{meetUp.title}</Text>
              <Text>{meetUp.date}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <ScrollView style={styles.section}>
        <Text style={styles.sectionTitle}>Past Meet-Ups</Text>
        {pastMeetUps.length === 0 ? (
          <View style={styles.noMeetUpsContainer}>
            <Text>No past meet-ups</Text>
          </View>
        ) : (
          pastMeetUps.map((meetUp, index) => (
            <View key={index} style={styles.meetUpItem}>
              <Text>{meetUp.title}</Text>
              <Text>{meetUp.date}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    flex: 1,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noMeetUpsContainer: {
    alignItems: 'center',
  },
  meetUpItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});