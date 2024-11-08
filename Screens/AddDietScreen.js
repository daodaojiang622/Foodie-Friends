import { View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {  Padding, ContainerStyle } from '../Utils/Style';
import { ThemeContext } from '../Components/ThemeContext';
import { writeToDB, updateDB, deleteFromDB } from '../Firebase/firestoreHelper'; 

import AddScreenButtons from '../Components/PressableButtons/AddScreenButtons';
import DeleteButton from '../Components/PressableButtons/DeleteButton';

import SpecialItemApproval from '../Components/SpecialItemApproval';

import DateInput from '../Components/Inputs/DateInput';
import FormInput from '../Components/Inputs/FormInput';


export default function AddActivityScreen() {
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(null);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const collectionName = 'diet';

  const route = useRoute();
  const [isSpecial, setIsSpecial] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [itemId, setItemId] = useState(null);

  useEffect(() => {
    if (route.params?.item) {
      const { item } = route.params;
      console.log("Route params item:", item);
      setDescription(item.name);
      setCalories(item.otherData);
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
    if (!description) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return;
    }
    if (!calories || isNaN(calories) || parseFloat(calories) < 0) {
        Alert.alert('Validation Error', 'Please enter a valid calories (positive number or 0).');
        return;
      }
    if (!date) {
      Alert.alert('Validation Error', 'Please select a date.');
      return;
    }

    // Determine if the activity is special
    const isSpecial = parseFloat(calories) > 800;
  
    const updatedActivity = { 
        name: description, 
        date: date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' +
              date.toLocaleDateString('en-US', { month: 'short' }) + ' ' +
              date.toLocaleDateString('en-US', { day: '2-digit' }) + ' ' +
              date.getFullYear(),
        otherData: calories,
        type: 'diet',
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
        <FormInput label="Description" value={description} onChangeText={setDescription} theme={theme} inputStyle={styles.descriptionStyle} />
        <FormInput label="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" theme={theme} />
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
  descriptionStyle: {
    height: 100,
  },
});