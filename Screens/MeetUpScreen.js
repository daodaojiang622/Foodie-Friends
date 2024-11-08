import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Alert, TextInput } from 'react-native';
import moment from 'moment';
import { ThemeContext } from '../Components/ThemeContext';
import PressableButton from '../Components/PressableButtons/PressableButton';
import FormInput from '../Components/Inputs/FormInput';
import DateInput from '../Components/Inputs/DateInput';
import TimeInput from '../Components/Inputs/TimeInput';
import { writeToDB } from '../Firebase/firestoreHelper';

export default function MeetUpScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [upcomingMeetUps, setUpcomingMeetUps] = useState([]);
  const [pastMeetUps, setPastMeetUps] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [restaurant, setRestaurant] = useState('');
  // const [date, setDate] = useState(new Date());
  // const [time, setTime] = useState('');
  // const [details, setDetails] = useState('');
  // const collectionName = 'meetups';

  const handleCreateMeetUp = () => {
    navigation.navigate('EditMeetUp');
  };

  // const closeModal = () => {
  //   setModalVisible(false);
  // };

  // const confirmCancel = () => {
  //   Alert.alert(
  //     "Confirm Cancel",
  //     "Are you sure you want to cancel?",
  //     [
  //       {
  //         text: "No",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //       { text: "Yes", onPress: closeModal }
  //     ],
  //     { cancelable: false }
  //   );
  // };

  // const handleSave = async () => {
  //   if (!restaurant) {
  //     Alert.alert("Validation Error", "Restaurant cannot be empty.");
  //     return;
  //   }
  //   if (!time) {
  //     Alert.alert("Validation Error", "Time cannot be empty.");
  //     return;
  //   }
  //   if (!date) {
  //     Alert.alert("Validation Error", "Date cannot be empty.");
  //     return;
  //   }

  //   const selectedDateTime = moment(`${moment(date).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mm A');
  //   const currentDateTime = moment();

  //   if (selectedDateTime.isBefore(currentDateTime)) {
  //     Alert.alert("Validation Error", "The selected date and time cannot be in the past.");
  //     return;
  //   }

  //   const formattedDate = moment(date).format('YYYY-MM-DD'); // Format the date to YYYY-MM-DD

  //   const meetUp = {
  //     restaurant: restaurant,
  //     date: formattedDate,
  //     details: details,
  //     time: time,
  //   };

  //   console.log(meetUp);
  //   await writeToDB(meetUp, collectionName);

  //   // Save the meet-up (you can add your save logic here)
  //   Alert.alert("Success", "Meet-up saved successfully!");
  //   closeModal();
  // };

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

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={styles.modalTitle}>Create a Meet-Up</Text>
            <Text style={styles.inputText}>Restaurant*</Text>
            <TextInput 
              style={styles.inputContainer} 
              value={restaurant}
              onChangeText={setRestaurant}
            />

            <TimeInput time={time} setTime={setTime} />

            <DateInput date={date} setDate={setDate} />

            <Text style={styles.inputText}>Details: </Text>
            <TextInput 
              placeholder='Who is coming? What are we celebrating?'
              style={[styles.inputContainer, { height: 100 }]} 
              multiline={true}
              value={details}
              onChangeText={setDetails}
            />

            <View style={styles.buttonContainer}>
              <PressableButton 
                title="Cancel" 
                onPress={confirmCancel} 
                textStyle={[styles.buttonTextStyle, { color: 'red' }]}
                buttonStyle={{ marginTop: 0 }}
              />
              <PressableButton 
                title="Save" 
                onPress={handleSave}
                textStyle={styles.buttonTextStyle}
                buttonStyle={{ marginTop: 0 }}
              />
            </View>
          </View>
        </View>
      </Modal> */}
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
});