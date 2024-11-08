import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Padding, ContainerStyle, Width, Margin } from '../Utils/Style';
import { ThemeContext } from '../Components/ThemeContext';
import { writeToDB, updateDB, deleteFromDB } from '../Firebase/firestoreHelper'; 
import DateInput from '../Components/Inputs/DateInput';
import FormInput from '../Components/Inputs/FormInput';

import AddScreenButtons from '../Components/PressableButtons/AddScreenButtons';
import DeleteButton from '../Components/PressableButtons/DeleteButton';

import SpecialItemApproval from '../Components/SpecialItemApproval';

export default function AddActivityScreen() {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(null);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Walking', value: 'Walking' },
    { label: 'Running', value: 'Running' },
    { label: 'Swimming', value: 'Swimming' },
    { label: 'Weight Training', value: 'Weight Training' },
    { label: 'Yoga', value: 'Yoga' },
    { label: 'Cycling', value: 'Cycling' },
    { label: 'Hiking', value: 'Hiking' },
  ]);
  const collectionName = 'activity';
  const route = useRoute();
  const [isSpecial, setIsSpecial] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [itemId, setItemId] = useState(null);

  useEffect(() => {
    if (route.params?.item) {
      const { item } = route.params;
      setValue(item.name);
      setDuration(item.otherData.replace(' min', ''));
      setDate(new Date(item.date));
      setItemId(item.id); 
      setIsSpecial(item.isSpecial);
      setIsApproved(item.isApproved);
      navigation.setOptions({
        title: 'Edit',
        headerRight: () => (
          <DeleteButton onPress={confirmDelete} />
        ),
      });
    }
  }, [route.params]);

  const confirmDelete = () => {
    const itemId = route.params.item.id;
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            console.log("Attempting to delete item with ID:", itemId);
            try {
              await deleteFromDB(itemId, collectionName);
              navigation.goBack();
            } catch (error) {
              console.log(error.message);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const validateAndSave = async () => {
    if (!value) {
      Alert.alert('Validation Error', 'Please select an activity.');
      return;
    }
    if (!duration || isNaN(duration) || parseFloat(duration) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid duration (positive number).');
      return;
    }
    if (!date) {
      Alert.alert('Validation Error', 'Please select a date.');
      return;
    }

    // Determine if the activity is special
    const isSpecial = (value === 'Running' || value === 'Weight Training') && parseFloat(duration) > 60;

    // Create the updated activity object
    const updatedActivity = {
      name: value,
      date: date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' +
            date.toLocaleDateString('en-US', { month: 'short' }) + ' ' +
            date.toLocaleDateString('en-US', { day: '2-digit' }) + ' ' +
            date.getFullYear(),
      otherData: `${duration} min`,
      type: 'activity',
      isSpecial: isSpecial,
      isApproved: isApproved,
    };

   // If editing, update the existing document in Firestore
   if (itemId) {
    // pop up a confirmation dialog for save, when confirm, update the doc
    Alert.alert(
      'Confirm Save',
      'Are you sure you want to save the changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await updateDB(itemId, updatedActivity, collectionName);
              navigation.goBack();
            } catch (error) {
              console.log('Error', 'Failed to save changes. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  } else {
    // If not editing, create a new entry (just in case)
    try {
      await writeToDB(updatedActivity, collectionName);
      navigation.goBack();
    } catch (error) {
      console.log('Error', 'Failed to save changes. Please try again.');
    }
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
          <Text style={[styles.label, { color: theme.headerColor}]}>Activity *</Text>
          <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select an activity"
              style={[styles.dropdown, {backgroundColor: theme.backgroundColor}]}
              dropDownContainerStyle={[styles.dropdownContainer, {backgroundColor: theme.backgroundColor}]}
          />

        <FormInput label="Duration (min)" value={duration} onChangeText={setDuration} theme={theme} keyboardType="numeric" />
        <DateInput label="Date" date={date} setDate={setDate} theme={theme} />

        {route.params?.item?.isSpecial === true && (
          <SpecialItemApproval
            isApproved={isApproved}
            setIsApproved={setIsApproved}
            theme={theme}
          />
        )}

        <AddScreenButtons onSave={validateAndSave} onCancel={() => navigation.goBack()} theme={theme} />    

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: ContainerStyle.flex,
    padding: Padding.xlarge,
  },
  dropdown: {
    marginBottom: Margin.large,
    width: Width.large,
  },
});
