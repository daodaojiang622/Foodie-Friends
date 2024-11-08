import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Modal, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';

export default function MeetUpScreen({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [upcomingMeetUps, setUpcomingMeetUps] = useState([]);
  const [pastMeetUps, setPastMeetUps] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateMeetUp = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a Meet-Up</Text>
            {/* Add your form or content for creating a meet-up here */}
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>

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
});