import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';

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
      <Text style={styles.sectionTitle}>Upcoming Meet-Ups</Text>
      <ScrollView style={styles.section}>
        {upcomingMeetUps.length === 0 ? (
          <View style={styles.noMeetUpsContainer}>
            <Text style={styles.noMeetUpText}>No upcoming meet-ups</Text>
            <PressableButton 
              title="Create a Meet-Up" 
              onPress={handleCreateMeetUp} 
              textStyle={{ color: theme.buttonColor, fontSize: 18 }}
            />
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

      <Text style={styles.sectionTitle}>Past Meet-Ups</Text>
      <ScrollView style={styles.section}>
        {pastMeetUps.length === 0 ? (
          <View style={styles.noMeetUpsContainer}>
            <Text style={styles.noMeetUpText}>No past meet-ups</Text>
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
    borderColor: 'lightgray',
    borderWidth: 2,
    marginHorizontal: 30,
    marginBottom: 30,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 30,
    marginBottom: 10,
  },
  noMeetUpsContainer: {
    alignItems: 'center',
  },
  noMeetUpText: {
    fontSize: 18,
    marginTop: 30,
  },
  meetUpItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});