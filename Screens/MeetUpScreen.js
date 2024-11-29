import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Pressable } from 'react-native';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import { deleteFromDB, subscribeToMeetUps } from '../Firebase/firestoreHelper'; 
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

export default function MeetUpScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [upcomingMeetUps, setUpcomingMeetUps] = useState([]);
  const [pastMeetUps, setPastMeetUps] = useState([]);
  const collectionName = 'meetups';

  const handleCreateMeetUp = () => {
    navigation.navigate('EditMeetUp');
  };

  const handleDeleteMeetUp = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this meet-up?",
      [
        {
          text: "No",
          onPress: () => console.log("MeetUp Delete Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", 
          onPress: 
            async () => {
              await deleteFromDB(id, collectionName);
              navigation.navigate('MeetUp');
            }
        }
      ],
      { cancelable: false }
    );
  };

  const fetchMeetUps = () => {
    subscribeToMeetUps(collectionName, (meetUps) => {
      const currentDateTime = moment();
      const upcoming = [];
      const past = [];

      meetUps.forEach(meetUp => {
        const meetUpDateTime = moment(`${meetUp.date} ${meetUp.time}`, 'YYYY-MM-DD hh:mm A');
        if (meetUpDateTime.isAfter(currentDateTime)) {
          upcoming.push(meetUp);
        } else {
          past.push(meetUp);
        }
      });

      setUpcomingMeetUps(upcoming);
      setPastMeetUps(past);
    });
  };

  useEffect(() => {
    fetchMeetUps();

    const interval = setInterval(() => {
      fetchMeetUps(); // Refresh every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);


  const handleEditMeetUp = (meetUp, isPast) => {
    navigation.navigate('EditMeetUp', { meetUp, confirmDelete: handleDeleteMeetUp, isPast });
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
            <Pressable key={index} onPress={() => handleEditMeetUp(meetUp, false)}>
              <View key={index} style={styles.meetUpItem}>

                <View style={styles.meetUpContainer}>

                  <View style={styles.meetUpInfoContainer}>
                    <Text style={styles.meetUpTitle}>{meetUp.restaurant}</Text>
                    <View style={styles.meetUpDateTimeContainer}>
                      <Ionicons name="time-outline" style={styles.meetUpDateTimeIcon} />
                      <Text style={styles.meetUpText}>{meetUp.time}, {meetUp.date}</Text>
                    </View>
                  </View>

                  <View style={styles.deleteButtonContainer}>
                    <Ionicons 
                      name="trash" 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMeetUp(meetUp.id)}
                    />
                  </View>

                </View>
              </View>
            </Pressable>
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
            <Pressable key={index} onPress={() => handleEditMeetUp(meetUp, true)}>
              <View key={index} style={styles.meetUpItem}>

                <View style={styles.meetUpContainer}>

                  <View style={styles.meetUpInfoContainer}>
                    <Text style={styles.meetUpTitle}>{meetUp.restaurant}</Text>
                    <View style={styles.meetUpDateTimeContainer}>
                      <Ionicons name="time-outline" style={styles.meetUpDateTimeIcon} />
                      <Text style={styles.meetUpText}>{meetUp.time}, {meetUp.date}</Text>
                    </View>
                  </View>

                  <View style={styles.deleteButtonContainer}>
                    <Ionicons 
                      name="trash" 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMeetUp(meetUp.id)}
                    />
                  </View>
                  
                </View>
              </View>
            </Pressable>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonTextStyle: {
    fontSize: 16,
  },
  inputText: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: '100%',
    padding: 5,
    marginBottom: 20,
  },
  meetUpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  meetUpDateTimeContainer: {
    flexDirection: 'row',
  },
  meetUpDateTimeIcon: {
    marginRight: 5,
    color: 'black',
    fontSize: 16, 
  },
  meetUpContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    fontSize: 20,
    color: 'black',
  }, 
  deleteButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
});